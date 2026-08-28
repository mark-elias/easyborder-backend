import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WaitTimeService {
  constructor(private prisma: PrismaService) {}

  // get wait times for a specific crossing
  async getForCrossing(crossingId: string) {
    return this.prisma.waitTime.findUnique({
      where: { crossingId },
      include: {
        crossing: {
          select: {
            id: true,
            portName: true,
            crossingName: true,
          },
        },
      },
    });
  }

  //===== used by CBP service
  // Delete all old wait times
  async deleteAll(): Promise<void> {
    await this.prisma.waitTime.deleteMany({});
  }

  // Create new wait time
  async create(waitTimeData: {
    crossingId: string;
    commercial?: any;
    passenger?: any;
    pedestrian?: any;
  }) {
    return this.prisma.waitTime.create({
      data: waitTimeData,
    });
  }
  //===============
}
