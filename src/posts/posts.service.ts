import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
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

    // INSERT INTO "Post" ...
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

    // SELECT post + user.id, user.username with JOIN
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
    // SELECT post + user.id, user.username ORDER BY createdAt DESC
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
    // SELECT to check existence and ownership
    const [post] = await this.db
      .select({ id: posts.id, userId: posts.userId })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('You can only delete your own posts');

    // DELETE FROM "Post" WHERE id = postId
    await this.db.delete(posts).where(eq(posts.id, postId));
  }
}
