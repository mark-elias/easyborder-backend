import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// DTOs
import { CreateUserDto } from 'src/user/DTOs/create-user.dto';
// auth
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string }> {
    return this.authService.registerUser(createUserDto);
  }

  // protected route
  // @UseGuards(JwtAuthGuard)
  @Get('private-route')
  getExampleRoute(): string {
    return 'Hello World';
  }

  @UseGuards(JwtAuthGuard)
  @Get('public-route')
  getPublicRoute(): string {
    return 'This is a public route';
  }
}
