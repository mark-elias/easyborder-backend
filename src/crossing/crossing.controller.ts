import { Controller, Get, Query } from '@nestjs/common';
import { CrossingService } from './crossing.service';
import { Throttle } from '@nestjs/throttler';

@Controller('crossings')
export class CrossingController {
  constructor(private crossingService: CrossingService) {}

  // GET /crossings?originCountry=MX&originCity=Tijuana
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // max 5 req per min
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
