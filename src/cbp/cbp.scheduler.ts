import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CbpService } from './cbp.service';

@Injectable()
export class CbpScheduler {
  constructor(private cbpService: CbpService) {}

  // run every 30 mins
  @Cron(CronExpression.EVERY_30_MINUTES)
  async fetchWaitTime() {
    try {
      console.log('running scheduled cbp api fetch');
      await this.cbpService.fetchWaitTimes();
      console.log('shceduled api fetch complete ✅');
    } catch (error: unknown) {
      console.error('scheduled cbp api fetch FAILED 🚨', error);
    }
  }
}
