import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaitTime } from './wait-time.schema';

@Injectable()
export class WaitTimeService {
  constructor(
    @InjectModel(WaitTime.name) private waitTimeModel: Model<WaitTime>,
  ) {}

  // get wait times for a specific crossing
  async getForCrossing(crossingId: string): Promise<WaitTime | null> {
    return this.waitTimeModel
      .findOne({ crossing: crossingId })
      .populate('crossing', '_id portName crossingName')
      .exec();
  }

  //===== used by CBP service
  // Delete all old wait times
  async deleteAll(): Promise<void> {
    await this.waitTimeModel.deleteMany({});
  }

  // Create new wait time
  async create(waitTimeData: any): Promise<WaitTime> {
    const waitTime = new this.waitTimeModel(waitTimeData);
    return waitTime.save();
  }
  //===============
}
