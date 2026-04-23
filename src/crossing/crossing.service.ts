import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Crossing } from './crossing.schema';

@Injectable()
export class CrossingService {
  constructor(
    @InjectModel(Crossing.name) private crossingModel: Model<Crossing>,
  ) {}

  // Get crossings by origin country and origin city
  async getCrossingsByCountryAndCity(
    originCountry: string,
    originCity: string,
  ): Promise<Crossing[]> {
    return this.crossingModel
      .find({ originCountry, originCity })
      .sort({ portName: 1 })
      .exec();
  }

  // ===== used by CBP service ===========
  // Find crossing by port number
  async findByPortNumber(portNumber: string): Promise<Crossing | null> {
    return this.crossingModel.findOne({ portNumber }).exec();
  }

  // Create new crossing
  async create(crossingData: any): Promise<Crossing> {
    const crossing = new this.crossingModel(crossingData);
    return crossing.save();
  }

  // Update existing crossing
  async update(crossing: Crossing, updates: any): Promise<Crossing> {
    Object.assign(crossing, updates);
    return crossing.save();
  }
}
