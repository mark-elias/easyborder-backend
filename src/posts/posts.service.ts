import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createId } from '@paralleldrive/cuid2';
import { DRIZZLE_DB } from 'src/db/drizzle.constants';
import * as schema from 'src/db/schema';
import { posts, users } from 'src/db/schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DRIZZLE_DB) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(userId: string, dto: CreatePostDto) {
    const now = new Date();

    // insert the new post
    const [post] = await this.db
      .insert(posts)
      .values({
        id: createId(),
        content: dto.content,
        userId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // fetch it back with the user's id and username included
    const [result] = await this.db
      .select({
        id: posts.id,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, post.id));

    return result;
  }

  async getAll() {
    return this.db
      .select({
        id: posts.id,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));
  }

  async delete(userId: string, postId: string): Promise<void> {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('You can only delete your own posts');

    await this.db.delete(posts).where(eq(posts.id, postId));
  }
}
