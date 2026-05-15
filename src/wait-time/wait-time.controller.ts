import { Controller, Get, Param } from '@nestjs/common';
import { WaitTimeService } from './wait-time.service';
import { Throttle } from '@nestjs/throttler';

@Controller('wait-times')
export class WaitTimeController {
  constructor(private waitTimeService: WaitTimeService) {}

  // get waittimes by specific crossing
  // /api/wait-times/:crossingId
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Get(':crossingId')
  async getForCrossing(@Param('crossingId') crossingId: string) {
    return this.waitTimeService.getForCrossing(crossingId);
  }
}
