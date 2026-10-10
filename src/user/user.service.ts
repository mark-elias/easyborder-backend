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
    if (existingUser)
      throw new BadRequestException('User with this email already exists');

    // retry up to 5 times if username is taken
    let username: string = '';
    for (let i = 0; i < 5; i++) {
      username = generateUsername();
      const taken = await this.prisma.user.findUnique({ where: { username } });
      if (!taken) break;
    }

    return this.prisma.user.create({
      data: { ...user, username },
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

// helper function for generating usernames
function generateUsername(): string {
  const adjectives = [
    'Silly',
    'Happy',
    'Quick',
    'Calm',
    'Bold',
    'Cool',
    'Brave',
    'Snappy',
  ];
  const nouns = [
    'Seal',
    'Panda',
    'Hawk',
    'Wolf',
    'Fox',
    'Bear',
    'Otter',
    'Lynx',
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  return `${adj}${noun}${num}`; // e.g. "SillySeal4823"
}
