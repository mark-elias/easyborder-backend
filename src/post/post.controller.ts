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
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePostDto } from './DTOs/create-post.dto';
import { User } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 post per min
  @Post()
  async create(@Request() req: { user: User }, @Body() body: CreatePostDto) {
    return this.postService.create(req.user.id, body);
  }

  @Get()
  async getFeed() {
    return this.postService.getFeed();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async delete(
    @Request() req: { user: User },
    @Param('postId') postId: string,
  ) {
    return this.postService.delete(req.user.id, postId);
  }
}
