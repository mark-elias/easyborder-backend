import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { users } from 'src/db/schema';
type User = typeof users.$inferSelect;
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 post per min
  @Post()
  async create(@Request() req: { user: User }, @Body() body: CreatePostDto) {
    return this.postsService.create(req.user.id, body);
  }

  @Get()
  async getAll() {
    return this.postsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async delete(
    @Request() req: { user: User },
    @Param('postId') postId: string,
  ) {
    return this.postsService.delete(req.user.id, postId);
  }
}
