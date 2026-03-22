import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaitTime } from './wait-time.schema';

@Injectable()
export class WaitTimeService {
  constructor(
    @InjectModel(WaitTime.name) private waitTimeModel: Model<WaitTime>,
  ) {}

  // Delete all old wait times
  async deleteAll(): Promise<void> {
    await this.waitTimeModel.deleteMany({});
  }

  // Create new wait time
  async create(waitTimeData: any): Promise<WaitTime> {
    const waitTime = new this.waitTimeModel(waitTimeData);
    return waitTime.save();
  }

  // Get current wait time for a crossing
  async getCurrentForCrossing(crossingId: string): Promise<WaitTime | null> {
    return this.waitTimeModel
      .findOne({ crossing: crossingId, isCurrent: true })
      .exec();
  }

  // Get current wait time by port number
  async getCurrentByPortNumber(portNumber: string): Promise<WaitTime | null> {
    return this.waitTimeModel.findOne({ portNumber, isCurrent: true }).exec();
  }
}
