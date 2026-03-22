import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Crossing, CrossingSchema } from './crossing.schema';
import { CrossingService } from './crossing.service';
import { CrossingController } from './crossing.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Crossing.name, schema: CrossingSchema },
    ]),
  ],
  exports: [MongooseModule, CrossingService],
  providers: [CrossingService],
  controllers: [CrossingController],
})
export class CrossingModule {}
