import { Controller, Get, Query } from '@nestjs/common';
import { CrossingService } from './crossing.service';

@Controller('crossings')
export class CrossingController {
  constructor(private crossingService: CrossingService) {}

  // GET /crossings - Get all crossings
  @Get()
  async getAllCrossings() {
    const crossings = await this.crossingService.getAll();
    return {
      count: crossings.length,
      data: crossings,
    };
  }

  // GET /crossings/cities?originCountry=MX - Get cities for a country
  @Get('cities')
  async getCities(@Query('originCountry') originCountry: string) {
    if (!originCountry) {
      return { error: 'originCountry query parameter is required' };
    }

    const cities = await this.crossingService.getCities(originCountry);
    return {
      count: cities.length,
      data: cities,
    };
  }
}
