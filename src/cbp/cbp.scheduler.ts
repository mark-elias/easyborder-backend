import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CbpService } from './cbp.service';

@Injectable()
export class CbpScheduler {
  constructor(private cbpService: CbpService) {}

  // run every 15 mins
  @Cron('*/15 * * * *')
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
