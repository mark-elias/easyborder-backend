import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// DTOs
import { CreateUserDto } from 'src/user/DTOs/create-user.dto';
import { LoginUserDto } from './DTOs/login-user.dto';
// auth
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
// rate limiting
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string }> {
    return this.authService.registerUser(createUserDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.authService.loginUser(loginUserDto);
  }

  //===== testing routes
  // protected route
  // @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Get('private-route')
  getExampleRoute(): string {
    return 'Hello World';
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Get('public-route')
  getPublicRoute(): string {
    return 'This is a public route';
  }
}
