import {
  Controller,
  Post,
  Delete,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from './schemas/user.schema';
import { AddFavoriteDto } from './DTOs/add-favorite.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  async addFavorite(
    @Request() req: { user: User },
    @Body() body: AddFavoriteDto,
  ) {
    return this.userService.addFavoriteWaitTime(
      req.user._id.toString(),
      body.crossingId,
      body.travelerType,
      body.laneType,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:favoriteId')
  async removeFavorite(
    @Request() req: { user: User },
    @Param('favoriteId') favoriteId: string,
  ) {
    return this.userService.removeFavoriteWaitTime(
      req.user._id.toString(),
      favoriteId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Request() req: { user: User }) {
    return this.userService.getFavorites(req.user._id.toString());
  }
}
