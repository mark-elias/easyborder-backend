import { Module } from '@nestjs/common';
import { WaitTimeService } from './wait-time.service';
import { WaitTimeController } from './wait-time.controller';

@Module({
  exports: [WaitTimeService],
  providers: [WaitTimeService],
  controllers: [WaitTimeController],
})
export class WaitTimeModule {}
