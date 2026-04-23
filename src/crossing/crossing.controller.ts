import { Controller, Get, Query } from '@nestjs/common';
import { CrossingService } from './crossing.service';

@Controller('crossings')
export class CrossingController {
  constructor(private crossingService: CrossingService) {}

  // GET /crossings?originCountry=MX&originCity=Tijuana
  @Get()
  async getCrossings(
    @Query('originCountry') originCountry: string,
    @Query('originCity') originCity: string,
  ) {
    const crossings = await this.crossingService.getCrossingsByCountryAndCity(
      originCountry,
      originCity,
    );

    return {
      count: crossings.length,
      data: crossings,
    };
  }
}
