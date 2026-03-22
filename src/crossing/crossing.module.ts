import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Crossing, CrossingSchema } from './crossing.schema';
import { CrossingService } from './crossing.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Crossing.name, schema: CrossingSchema },
    ]),
  ],
  exports: [MongooseModule],
  providers: [CrossingService],
})
export class CrossingModule {}
