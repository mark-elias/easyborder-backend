import { Controller, Get } from '@nestjs/common';
import { CbpService } from './cbp.service';

@Controller('cbp')
export class CbpController {
  constructor(private cbpService: CbpService) {}

  // endpint for testing cbp api call
  @Get('test')
  async fetch() {
    try {
      await this.cbpService.fetchWaitTimes();
      return { message: 'wait times from cbp api have been fetched' };
    } catch {
      return { message: 'failed to fetch wait times from cbp api' };
    }
  }
}
