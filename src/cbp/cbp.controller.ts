import { Controller, Get, UseGuards } from '@nestjs/common';
import { CbpService } from './cbp.service';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('cbp')
export class CbpController {
  constructor(private cbpService: CbpService) {}

  // endpint for manually triggering CBP API fetch
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // max 3 req per min
  @Get()
  async triggerFetch() {
    try {
      await this.cbpService.fetchWaitTimes();
      return { message: '✅ cbp data fetched succesfully' };
    } catch {
      return { message: '🚨 failed to fetch cbp data' };
    }
  }
}
