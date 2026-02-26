import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Crossing, CrossingSchema } from './crossing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Crossing.name, schema: CrossingSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class CrossingModule {}
