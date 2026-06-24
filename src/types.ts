export interface TruckProfile {
  height: string;
  weight: string;
  class: string;
}

export interface RoutingOptions {
  avoidTolls: boolean;
  avoidHighways: boolean;
  optimizeRoute: boolean;
}

export interface Waypoint {
  id: string;
  address: string;
  latLng?: google.maps.LatLngLiteral;
}

export interface Hazard {
  type: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export interface AIAnalysis {
  hazards: Hazard[];
  fuelOptimization: string;
  overallAdvice: string;
}
