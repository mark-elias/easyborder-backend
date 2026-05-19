// CBP API response types & my own reformatted types

//===== CBP API response types (raw from api)
export interface CBPLane {
  update_time: string;
  operational_status: string;
  delay_minutes: string;
  lanes_open: string;
}
// commercial
export interface CBPCommercialVehicleLanes {
  maximum_lanes: string;
  standard_lanes: CBPLane;
  FAST_lanes: CBPLane;
}
// passenger vehicles
export interface CBPPassengerVehicleLanes {
  maximum_lanes: string;
  standard_lanes: CBPLane;
  NEXUS_SENTRI_lanes: CBPLane;
  ready_lanes: CBPLane;
}
// pedestrian lanes
export interface CBPPedestrianLanes {
  maximum_lanes: string;
  standard_lanes: CBPLane;
  ready_lanes: CBPLane;
}
// compolete port data from CBP API
export interface CBPPort {
  port_number: string;
  border: string; // "Mexican Border" or "Canadian Border"
  port_name: string; // US port name
  crossing_name: string; // specific crossing ex: PedWest
  hours: string; // operating hours
  date: string; // last update data
  time: string; // last update time
  port_status: string; // "Open" "Closed"
  construction_notice: string; // notices or alerts from CBP about the port
  commercial_vehicle_lanes: CBPCommercialVehicleLanes;
  passenger_vehicle_lanes: CBPPassengerVehicleLanes;
  pedestrian_lanes: CBPPedestrianLanes;
}

//===== My reformated types
export interface ReformattedLane {
  updateTime: string;
  operationalStatus: string;
  // delayMinutes: number | 'N/A'; // 'N/A' = data unavailable, not 0
  delayMinutes: number;
  // lanesOpen: number | 'N/A'; // 'N/A' = data unavailable, not 0
  lanesOpen: number;
}

export interface ReformattedCommercialLanes {
  standard: ReformattedLane;
  fast: ReformattedLane;
}

export interface ReformattedPassengerLanes {
  standard: ReformattedLane;
  sentri: ReformattedLane;
  ready: ReformattedLane;
}

export interface ReformattedPedestrianLanes {
  standard: ReformattedLane;
  ready: ReformattedLane;
}

export interface ReformattedCrossing {
  // Unique identifier
  portNumber: string;
  // where traveler is crossing from
  originCountry: 'MX' | 'CA';
  originCity: string;
  // where traveler is going
  destinationCity: string;
  // CBP port name & crossing name
  portName: string;
  crossingName: string;

  // Operational info
  hours: string;
  cbpLastUpdateDate: string;
  cbpLastUpdateTime: string;
  portStatus: string;
  constructionNotice: string;

  hasCommercialLanes: boolean;
  hasPassengerLanes: boolean;
  hasPedestrianLanes: boolean;
  maxCommercialLanes: number;
  maxPassengerLanes: number;
  maxPedestrianLanes: number;

  // Wait time data
  commercial?: ReformattedCommercialLanes;
  passenger?: ReformattedPassengerLanes;
  pedestrian?: ReformattedPedestrianLanes;
}
