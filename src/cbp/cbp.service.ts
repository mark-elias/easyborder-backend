import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CrossingService } from '../crossing/crossing.service';
import { WaitTimeService } from '../wait-time/wait-time.service';
import { CBPPort, CBPLane, ParsedLane } from './cbp.types';
import { SKIP_PORTS, getOriginCity } from './cbp-mappings';

@Injectable()
export class CbpService {
  private readonly CBP_API_URL = 'https://bwt.cbp.gov/api/waittimes';

  constructor(
    private httpService: HttpService,
    private crossingService: CrossingService,
    private waitTimeService: WaitTimeService,
  ) {}

  // Main function: fetch from API and save
  async fetchWaitTimes(): Promise<void> {
    try {
      console.log('Fetching from CBP API...');

      // Get data from API
      const response = await firstValueFrom(
        this.httpService.get<CBPPort[]>(this.CBP_API_URL),
      );
      const ports = response.data;

      // Delete old wait times
      await this.waitTimeService.deleteAll();

      // Process each port
      for (const port of ports) {
        if (SKIP_PORTS.includes(port.port_number)) {
          continue;
        }
        await this.savePort(port);
      }

      console.log('✅ Saved wait times for all ports');
    } catch (error: unknown) {
      console.error('❌ Failed to fetch wait times', error);
      throw error;
    }
  }

  // Save one port's data
  private async savePort(port: CBPPort): Promise<void> {
    try {
      // Figure out origin country and city
      const originCountry = port.border === 'Mexican Border' ? 'MX' : 'CA';
      const originCity = getOriginCity(port.port_name, originCountry);

      // Find or create crossing
      let crossing = await this.crossingService.findByPortNumber(
        port.port_number,
      );

      if (!crossing) {
        crossing = await this.crossingService.create({
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
        });
      } else {
        await this.crossingService.update(crossing, {
          originCountry,
          originCity,
          destinationCity: port.port_name,
          date: port.date,
          time: port.time,
          portStatus: port.port_status,
          constructionNotice: port.construction_notice,
        });
      }

      // Save wait time
      await this.waitTimeService.create({
        crossing: crossing._id,
        portNumber: port.port_number,
        fetchedAt: new Date(),
        isCurrent: true,
        passengerVehicle: {
          standard: this.parseLane(
            port.passenger_vehicle_lanes?.standard_lanes,
          ),
          sentri: this.parseLane(
            port.passenger_vehicle_lanes?.NEXUS_SENTRI_lanes,
          ),
          ready: this.parseLane(port.passenger_vehicle_lanes?.ready_lanes),
        },
        pedestrian: {
          standard: this.parseLane(port.pedestrian_lanes?.standard_lanes),
          ready: this.parseLane(port.pedestrian_lanes?.ready_lanes),
        },
      });
    } catch (error: unknown) {
      console.error(`❌ Failed to save port ${port.port_number}`, error);
    }
  }

  // Convert CBP lane format to our format
  private parseLane(lane?: CBPLane): ParsedLane {
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
