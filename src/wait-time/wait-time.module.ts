import { Module } from '@nestjs/common';
import { WaitTime, WaitTimeSchema } from './wait-time.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WaitTimeService } from './wait-time.service';
import { WaitTimeController } from './wait-time.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WaitTime.name, schema: WaitTimeSchema },
    ]),
  ],
  exports: [MongooseModule, WaitTimeService],
  providers: [WaitTimeService],
  controllers: [WaitTimeController],
})
export class WaitTimeModule {}
