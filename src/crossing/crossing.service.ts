import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Crossing, Prisma } from '@prisma/client';

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
  async create(crossingData: Prisma.CrossingCreateInput): Promise<Crossing> {
    return this.prisma.crossing.create({
      data: crossingData,
    });
  }

  // Update existing crossing
  async update(
    id: string,
    updates: Prisma.CrossingUpdateInput,
  ): Promise<Crossing> {
    return this.prisma.crossing.update({
      where: { id },
      data: updates,
    });
  }
}
