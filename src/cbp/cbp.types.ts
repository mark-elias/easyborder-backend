// Types for CBP API
export interface CBPLane {
  update_time: string;
  operational_status: string;
  delay_minutes: string;
  lanes_open: string;
}

export interface CBPPort {
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

// Type for our parsed lane data
export interface ParsedLane {
  updateTime: string;
  operationalStatus: string;
  delayMinutes: number;
  lanesOpen: number;
}
