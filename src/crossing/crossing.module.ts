import { Module } from '@nestjs/common';
import { CrossingService } from './crossing.service';
import { CrossingController } from './crossing.controller';

@Module({
  exports: [CrossingService],
  providers: [CrossingService],
  controllers: [CrossingController],
})
export class CrossingModule {}
