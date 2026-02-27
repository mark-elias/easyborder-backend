import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WaitTime } from '../wait-time/wait-time.schema';
import { Crossing } from '../crossing/crossing.schema';

interface CBPLane {
  update_time: string;
  operational_status: string;
  delay_minutes: string;
  lanes_open: string;
}

interface CBPPort {
  port_number: string;
  border: string;
  port_name: string;
  crossing_name: string;
  hours: string;
  date: string;
  time: string;
  port_status: string;
  construction_notice: string;
  passenger_vehicle_lanes: {
    standard_lanes: CBPLane;
    NEXUS_SENTRI_lanes: CBPLane;
    ready_lanes: CBPLane;
  };
  pedestrian_lanes: {
    standard_lanes: CBPLane;
    ready_lanes: CBPLane;
  };
}

interface ParsedLane {
  updateTime: string;
  operationalStatus: string;
  delayMinutes: number;
  lanesOpen: number;
}

@Injectable()
export class CbpService {
  constructor(
    @InjectModel(WaitTime.name) private waitTimeModel: Model<WaitTime>,
    @InjectModel(Crossing.name) private crossingModel: Model<Crossing>,
    private httpService: HttpService,
  ) {}

  // fetch wait times from cbp API and save to database
  async fetchWaitTimes(): Promise<void> {
    // Get data from API
    const response = await firstValueFrom(
      this.httpService.get<CBPPort[]>('https://bwt.cbp.gov/api/waittimes'),
    );
    const ports = response.data;

    // Mark old wait times as outdated
    await this.waitTimeModel.updateMany(
      { isCurrent: true },
      { isCurrent: false },
    );

    // Loop through each port and save it
    for (const port of ports) {
      await this.savePort(port);
    }

    console.log('Saved wait times for all ports');
  }

  // Save data for one port
  async savePort(port: CBPPort): Promise<void> {
    // Find crossing in database
    let crossing = await this.crossingModel.findOne({
      portNumber: port.port_number,
    });

    // If crossing doesn't exist, create it
    if (!crossing) {
      crossing = new this.crossingModel({
        portNumber: port.port_number,
        border: port.border,
        portName: port.port_name,
        crossingName: port.crossing_name,
        hours: port.hours,
        date: port.date,
        time: port.time,
        portStatus: port.port_status,
        constructionNotice: port.construction_notice,
      });
      await crossing.save();
    } else {
      // Update existing crossing
      crossing.date = port.date;
      crossing.time = port.time;
      crossing.portStatus = port.port_status;
      crossing.constructionNotice = port.construction_notice;
      await crossing.save();
    }

    // Get passenger vehicle wait times
    const passengerVehicle = {
      standard: this.parseLane(port.passenger_vehicle_lanes?.standard_lanes),
      sentri: this.parseLane(port.passenger_vehicle_lanes?.NEXUS_SENTRI_lanes),
      ready: this.parseLane(port.passenger_vehicle_lanes?.ready_lanes),
    };

    // Get pedestrian wait times
    const pedestrian = {
      standard: this.parseLane(port.pedestrian_lanes?.standard_lanes),
      ready: this.parseLane(port.pedestrian_lanes?.ready_lanes),
    };

    // Create new wait time record
    const waitTime = new this.waitTimeModel({
      crossing: crossing._id,
      portNumber: port.port_number,
      fetchedAt: new Date(),
      isCurrent: true,
      passengerVehicle: passengerVehicle,
      pedestrian: pedestrian,
    });

    await waitTime.save();
  }

  // Parse lane data from API
  parseLane(lane?: CBPLane): ParsedLane {
    // If no data, return empty values
    if (!lane) {
      return {
        updateTime: '',
        operationalStatus: 'N/A',
        delayMinutes: 0,
        lanesOpen: 0,
      };
    }

    // convert API data format
    return {
      updateTime: lane.update_time || '',
      operationalStatus: lane.operational_status || 'N/A',
      delayMinutes: Number(lane.delay_minutes) || 0,
      lanesOpen: Number(lane.lanes_open) || 0,
    };
  }
}
