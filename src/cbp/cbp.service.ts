import { Injectable } from '@nestjs/common';
import axios from 'axios';
// services
import { CrossingService } from '../crossing/crossing.service';
import { WaitTimeService } from '../wait-time/wait-time.service';
// schemas
import { Crossing } from '../crossing/crossing.schema';
// types
import {
  CBPPort,
  CBPLane,
  ReformattedCrossing,
  ReformattedLane,
} from './cbp.types';
import { SKIP_PORTS, getOriginCity } from './cbp-mappings';

@Injectable()
export class CbpService {
  private readonly CBP_API_URL =
    process.env.CBP_API_URL || 'https://bwt.cbp.gov/api/waittimes';

  constructor(
    private crossingService: CrossingService,
    private waitTimeService: WaitTimeService,
  ) {}

  // fetches all wait times from CBP API and saves to database
  async fetchWaitTimes(): Promise<void> {
    try {
      const response = await axios.get<CBPPort[]>(this.CBP_API_URL);
      const ports = response.data;

      await this.waitTimeService.deleteAll();

      for (const port of ports) {
        // dont save unused/duplicate cbp ports
        if (SKIP_PORTS.includes(port.port_number)) continue;

        await this.saveCrossing(port);
      }

      console.log('✅ successfully fetched wait times');
    } catch (error: unknown) {
      console.error('🚨 failed to fetch wait times:', error);
      throw error;
    }
  }

  // transforms CBP port data and saves crossing + wait time to database
  private async saveCrossing(port: CBPPort): Promise<void> {
    try {
      const reformatted = this.transformPort(port);
      const crossing = await this.saveOrUpdateCrossing(reformatted);

      // create waittime for crossing
      await this.waitTimeService.create({
        crossing: crossing._id,
        portNumber: port.port_number,
        fetchedAt: new Date(),
        isCurrent: true,
        passengerVehicle: reformatted.passengerVehicle,
        pedestrian: reformatted.pedestrian,
      });
    } catch (error: unknown) {
      console.error(`❌ Failed to save crossing ${port.port_number}:`, error);
    }
  }

  // determines origin country & city
  // converts CBP format to my ReformattedCrossing
  private transformPort(port: CBPPort): ReformattedCrossing {
    const originCountry = port.border === 'Mexican Border' ? 'MX' : 'CA';
    const originCity = getOriginCity(port.port_name, originCountry);

    return {
      portNumber: port.port_number,
      originCountry,
      originCity,
      destinationCity: port.port_name,
      portName: port.port_name,
      crossingName: port.crossing_name,
      hours: port.hours,
      date: port.date,
      time: port.time,
      portStatus: port.port_status,
      constructionNotice: port.construction_notice,
      passengerVehicle: {
        standard: this.reformatLane(
          port.passenger_vehicle_lanes?.standard_lanes,
        ),
        sentri: this.reformatLane(
          port.passenger_vehicle_lanes?.NEXUS_SENTRI_lanes,
        ),
        ready: this.reformatLane(port.passenger_vehicle_lanes?.ready_lanes),
      },
      pedestrian: {
        standard: this.reformatLane(port.pedestrian_lanes?.standard_lanes),
        ready: this.reformatLane(port.pedestrian_lanes?.ready_lanes),
      },
    };
  }

  // saves new crossing or updates existing crossing with latest data
  private async saveOrUpdateCrossing(
    data: ReformattedCrossing,
  ): Promise<Crossing> {
    // look for existing crossing by port #
    const crossing = await this.crossingService.findByPortNumber(
      data.portNumber,
    );

    // if no existing crossing, create crossing
    if (!crossing) {
      return await this.crossingService.create({
        portNumber: data.portNumber,
        originCountry: data.originCountry,
        originCity: data.originCity,
        destinationCity: data.destinationCity,
        portName: data.portName,
        crossingName: data.crossingName,
        hours: data.hours,
        date: data.date,
        time: data.time,
        portStatus: data.portStatus,
        constructionNotice: data.constructionNotice,
      });
    }

    // if crossing exists, update it
    return await this.crossingService.update(crossing, {
      originCountry: data.originCountry,
      originCity: data.originCity,
      destinationCity: data.destinationCity,
      date: data.date,
      time: data.time,
      portStatus: data.portStatus,
      constructionNotice: data.constructionNotice,
    });
  }

  // converts CBP lane data to my format
  private reformatLane(lane?: CBPLane): ReformattedLane {
    if (!lane) {
      return {
        updateTime: '',
        operationalStatus: 'N/A',
        delayMinutes: 0,
        lanesOpen: 0,
      };
    }

    return {
      updateTime: lane.update_time || '',
      operationalStatus: lane.operational_status || 'N/A',
      delayMinutes: Number(lane.delay_minutes) || 0,
      lanesOpen: Number(lane.lanes_open) || 0,
    };
  }
}
