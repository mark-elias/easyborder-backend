import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CbpController } from './cbp.controller';
import { CbpService } from './cbp.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CbpScheduler } from './cbp.scheduler';
import { CrossingModule } from 'src/crossing/crossing.module';
import { WaitTimeModule } from 'src/wait-time/wait-time.module';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    CrossingModule,
    WaitTimeModule,
  ],
  providers: [CbpService, CbpScheduler],
  exports: [CbpService],
  controllers: [CbpController],
})
export class CbpModule {}
