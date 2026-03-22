import { Module } from '@nestjs/common';
import { WaitTime, WaitTimeSchema } from './wait-time.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WaitTimeService } from './wait-time.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitTime.name, schema: WaitTimeSchema },
    ]),
  ],
  exports: [MongooseModule],
  providers: [WaitTimeService],
})
export class WaitTimeModule {}
