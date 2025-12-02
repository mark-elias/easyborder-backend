import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './DTOs/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto): Promise<User> {
    // check if user already exists
    const existingUser = await this.userModel.findOne({
      email: user.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // create user in the database
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
