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
        commercial: reformatted.commercial,
        passenger: reformatted.passenger,
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

    // maximum lanes
    const maxCommercial = this.parseMaxLanes(
      port.commercial_vehicle_lanes?.maximum_lanes,
    );
    const maxPassenger = this.parseMaxLanes(
      port.passenger_vehicle_lanes?.maximum_lanes,
    );
    const maxPedestrian = this.parseMaxLanes(
      port.pedestrian_lanes?.maximum_lanes,
    );

    return {
      portNumber: port.port_number,
      originCountry,
      originCity,
      destinationCity: port.port_name,
      portName: port.port_name,
      crossingName: port.crossing_name,
      hours: port.hours,
      cbpLastUpdateDate: port.date,
      cbpLastUpdateTime: port.time,
      portStatus: port.port_status,
      hasCommercialLanes: maxCommercial > 0,
      hasPassengerLanes: maxPassenger > 0,
      hasPedestrianLanes: maxPedestrian > 0,
      maxCommercialLanes: maxCommercial,
      maxPassengerLanes: maxPassenger,
      maxPedestrianLanes: maxPedestrian,

      constructionNotice: port.construction_notice,
      passenger: {
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
        cbpLastUpdateDate: data.cbpLastUpdateDate,
        cbpLastUpdateTime: data.cbpLastUpdateTime,
        portStatus: data.portStatus,
        hasCommercialLanes: data.hasCommercialLanes,
        hasPassengerLanes: data.hasPassengerLanes,
        hasPedestrianLanes: data.hasPedestrianLanes,
        maxCommercialLanes: data.maxCommercialLanes,
        maxPassengerLanes: data.maxPassengerLanes,
        maxPedestrianLanes: data.maxPedestrianLanes,

        constructionNotice: data.constructionNotice,
      });
    }

    // if crossing exists, update it
    return await this.crossingService.update(crossing, {
      originCountry: data.originCountry,
      originCity: data.originCity,
      destinationCity: data.destinationCity,
      cbpLastUpdateDate: data.cbpLastUpdateDate,
      cbpLastUpdateTime: data.cbpLastUpdateTime,
      portStatus: data.portStatus,
      hasCommercialLanes: data.hasCommercialLanes,
      hasPassengerLanes: data.hasPassengerLanes,
      hasPedestrianLanes: data.hasPedestrianLanes,
      maxCommercialLanes: data.maxCommercialLanes,
      maxPassengerLanes: data.maxPassengerLanes,
      maxPedestrianLanes: data.maxPedestrianLanes,

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

  private parseMaxLanes(value?: string): number {
    if (!value || value === 'N/A') return 0;
    return parseInt(value, 10) || 0;
  }
}
