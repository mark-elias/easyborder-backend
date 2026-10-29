import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';
import { DRIZZLE_DB } from 'src/db/drizzle.constants';
import * as schema from 'src/db/schema';
import { favorites, users } from 'src/db/schema';
import { CreateUserDto } from './DTOs/create-user.dto';
import { TravelerType, LaneType } from './enums/favorite.enums';

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_DB) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(user: CreateUserDto) {
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, user.email),
    });
    if (existingUser)
      throw new BadRequestException('User with this email already exists');

    // retry up to 5 times if username is taken
    let username: string = '';
    for (let i = 0; i < 5; i++) {
      username = generateUsername();
      const taken = await this.db.query.users.findFirst({
        where: eq(users.username, username),
      });
      if (!taken) break;
    }

    const now = new Date();
    const [newUser] = await this.db
      .insert(users)
      .values({
        id: createId(),
        ...user,
        username,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newUser;
  }

  async addFavoriteWaitTime(
    userId: string,
    crossingId: string,
    travelerType: TravelerType,
    laneType: LaneType,
  ) {
    const existing = await this.db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.crossingId, crossingId),
        eq(favorites.travelerType, travelerType),
        eq(favorites.laneType, laneType),
      ),
    });

    if (existing) {
      throw new BadRequestException('Favorite already exists');
    }

    const [favorite] = await this.db
      .insert(favorites)
      .values({
        id: createId(),
        userId,
        crossingId,
        travelerType,
        laneType,
        createdAt: new Date(),
      })
      .returning();

    return favorite;
  }

  async removeFavoriteWaitTime(userId: string, favoriteId: string) {
    const favorite = await this.db.query.favorites.findFirst({
      where: and(eq(favorites.id, favoriteId), eq(favorites.userId, userId)),
    });

    if (!favorite) {
      throw new BadRequestException('Favorite not found');
    }

    const [deleted] = await this.db
      .delete(favorites)
      .where(eq(favorites.id, favoriteId))
      .returning();

    return deleted;
  }

  async getFavorites(userId: string) {
    return this.db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
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
