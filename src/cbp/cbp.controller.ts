import { Controller, Get } from '@nestjs/common';
import { CBPService } from './cbp.service';

@Controller('cbp')
export class CbpController {
  constructor(private cbpService: CBPService) {}

  // endpint for testing cbp api call
  @Get('test')
  async fetch() {
    await this.cbpService.fetchWaitTimes();
    return { message: 'wait times from cbp api have been fetched' };
  }
}
