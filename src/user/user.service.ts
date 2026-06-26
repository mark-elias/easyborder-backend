import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async addFavoriteWaitTime(
    userId: string,
    crossingId: string,
    travelerType: string,
    laneType: string,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('favorites');

    const alreadyFavorited = user?.favorites.some(
      (f) =>
        (f.crossingId as unknown as Types.ObjectId).equals(crossingId) &&
        f.travelerType === travelerType &&
        f.laneType === laneType,
    );

    if (alreadyFavorited) {
      throw new BadRequestException('Favorite already exists');
    }

    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { favorites: { crossingId, travelerType, laneType } } },
      { new: true },
    );
  }

  async removeFavoriteWaitTime(
    userId: string,
    favoriteId: string,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('favorites');

    const exists = user?.favorites.some((f) => f._id.toString() === favoriteId);

    if (!exists) {
      throw new BadRequestException('Favorite not found');
    }

    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: { _id: new Types.ObjectId(favoriteId) } } },
      { new: true },
    );
  }

  async getFavorites(userId: string) {
    const user = await this.userModel.findById(userId).select('favorites');
    return user?.favorites ?? [];
  }
}
