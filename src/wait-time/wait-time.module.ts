import { Module } from '@nestjs/common';
import { WaitTime, WaitTimeSchema } from './wait-time.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitTime.name, schema: WaitTimeSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WaitTimeModule {}
