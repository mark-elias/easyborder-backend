import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Crossing } from './crossing.schema';

@Injectable()
export class CrossingService {
  constructor(private prisma: PrismaService) {}

  // Get crossings by origin country and origin city
  async getCrossingsByCountryAndCity(
    originCountry: string,
    originCity: string,
  ): Promise<Crossing[]> {
    return this.prisma.crossing.findMany({
      where: { originCountry, originCity },
      orderBy: { portName: 'asc' },
    });
  }

  // ===== used by CBP service ===========
  // Find crossing by port number
  async findByPortNumber(portNumber: string): Promise<Crossing | null> {
    return this.prisma.crossing.findUnique({
      where: { portNumber },
    });
  }

  // Create new crossing
  async create(crossingData: Partial<Crossing>): Promise<Crossing> {
    return this.prisma.crossing.create({
      data: crossingData as any,
    });
  }

  // Update existing crossing
  async update(id: string, updates: Partial<Crossing>): Promise<Crossing> {
    return this.prisma.crossing.update({
      where: { id },
      data: updates as any,
    });
  }
}
