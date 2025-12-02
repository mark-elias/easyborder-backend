import { ConflictException, Injectable } from '@nestjs/common';
// for database stuff
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// for auth
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// User
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
// DTOs
import { CreateUserDto } from 'src/user/DTOs/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{ token: string }> {
    // get user data from createUserDto
    const { email, password } = createUserDto;

    try {
      // use user service to create user
      const user = await this.userService.create({
        email,
        password: await bcrypt.hash(password, 10),
      });

      // generate token
      const token = this.jwtService.sign({ id: user._id });

      // return token
      return { token };
    } catch (error) {
      if ((error as Error).message.includes('already exists')) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }
}
