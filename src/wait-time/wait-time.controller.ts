import { Controller, Get, Param } from '@nestjs/common';
import { WaitTimeService } from './wait-time.service';

@Controller('wait-times')
export class WaitTimeController {
  constructor(private waitTimeService: WaitTimeService) {}

  // get waittimes by specific crossing
  // /api/wait-times/:crossingId
  @Get(':crossingId')
  async getForCrossing(@Param('crossingId') crossingId: string) {
    return this.waitTimeService.getForCrossing(crossingId);
  }
}
