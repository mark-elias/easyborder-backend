import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
// DTOs
import { CreateUserDto } from 'src/user/DTOs/create-user.dto';
import { LoginUserDto } from './DTOs/login-user.dto';
// auth
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
// rate limiting
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.registerUser(createUserDto);

    // tells the broswer to store jwt in a cookie
    res.cookie('auth_token', token, {
      // reject jaavascript access (XSS)
      httpOnly: true,
      // only send cookie over HTTPS
      secure: this.configService.get('NODE_ENV') === 'production',
      // allow cross origin requests (my vercel to EC2)
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 1000, // 7 days
    });

    return { success: true, message: 'Registration successful' };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.loginUser(loginUserDto);

    // tells the broswer to store jwt in a cookie
    res.cookie('auth_token', token, {
      // reject jaavascript access (XSS)
      httpOnly: true,
      // only send cookie over HTTPS
      secure: process.env.NODE_ENV === 'production',
      // allow cross origin requests (my vercel to EC2)
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { success: true, message: 'login successsful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req: Request) {
    return { user: req.user };
  }

  //===== testing routes
  @UseGuards(JwtAuthGuard)
  @Get('protected-test')
  getProtectedRoute(): string {
    return 'You are authenticated';
  }
}
