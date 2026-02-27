import { Module } from '@nestjs/common';
import { WaitTime, WaitTimeSchema } from 'src/wait-time/wait-time.schema';
import { Crossing, CrossingSchema } from 'src/crossing/crossing.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CbpController } from './cbp.controller';
import { CbpService } from './cbp.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CbpScheduler } from './cbp.scheduler';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: WaitTime.name, schema: WaitTimeSchema },
      { name: Crossing.name, schema: CrossingSchema },
    ]),
  ],
  providers: [CbpService, CbpScheduler],
  exports: [CbpService],
  controllers: [CbpController],
})
export class CbpModule {}
