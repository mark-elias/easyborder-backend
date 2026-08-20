import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { TravelerType, LaneType } from './enums/favorite.enums';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: user,
    });
  }

  async addFavoriteWaitTime(
    userId: string,
    crossingId: string,
    travelerType: TravelerType,
    laneType: LaneType,
  ) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_crossingId_travelerType_laneType: {
          userId,
          crossingId,
          travelerType,
          laneType,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Favorite already exists');
    }

    return this.prisma.favorite.create({
      data: { userId, crossingId, travelerType, laneType },
    });
  }

  async removeFavoriteWaitTime(userId: string, favoriteId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { id: favoriteId, userId },
    });

    if (!favorite) {
      throw new BadRequestException('Favorite not found');
    }

    return this.prisma.favorite.delete({
      where: { id: favoriteId },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
    });
  }
}
