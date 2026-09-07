import * as THREE from 'three';

export type CameraMode = 'first_person' | 'third_person' | 'hood';

export type WeatherType = 'sunny' | 'rain' | 'fog' | 'heavy_rain';

export type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';

export type VehicleCategory = 'player' | 'sedan' | 'taxi' | 'suv' | 'motorcycle' | 'bus' | 'truck';

export type LaneDirection = 'forward' | 'opposite';

export type TrafficSignalState = 'red' | 'yellow' | 'green';

export interface TrafficSignal {
  id: string;
  position: THREE.Vector3;
  heading: number; // angle in radians
  state: TrafficSignalState;
  timer: number;
  greenDuration: number;
  yellowDuration: number;
  redDuration: number;
  poleGroup: THREE.Group;
  redLightMesh: THREE.Mesh;
  yellowLightMesh: THREE.Mesh;
  greenLightMesh: THREE.Mesh;
}

export interface RoadSegment {
  id: string;
  name: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  width: number;
  lanesForward: number;
  lanesOpposite: number;
  speedLimit: number;
}

export interface Waypoint {
  position: THREE.Vector3;
  name: string;
  isDestination?: boolean;
}

export interface NavigationInstruction {
  action: 'straight' | 'left' | 'right' | 'slight_left' | 'slight_right' | 'destination';
  text: string;
  streetName: string;
  distance: number;
}

export interface PlayerVehicleState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number; // in m/s (1 m/s = 3.6 km/h)
  speedKmh: number;
  rpm: number;
  gear: number | string;
  steeringAngle: number;
  throttle: number;
  brake: number;
  handbrake: boolean;
  fuelPercent: number;
  healthPercent: number;
  headlights: boolean;
  blinkerLeft: boolean;
  blinkerRight: boolean;
  inCollision: boolean;
  cameraMode: CameraMode;
}

export interface AITrafficVehicle {
  id: string;
  category: VehicleCategory;
  mesh: THREE.Group;
  position: THREE.Vector3;
  heading: number; // Y-axis rotation in radians
  targetSpeed: number;
  currentSpeed: number;
  laneIndex: number;
  direction: LaneDirection;
  length: number;
  width: number;
  height: number;
  wheels: THREE.Mesh[];
  brakeLights?: THREE.Mesh[];
  headlights?: THREE.SpotLight[];
  stoppingForSignal?: boolean;
  stoppedDistance?: number;
}

export interface GameTelemetry {
  speedKmh: number;
  rpm: number;
  gear: string;
  fuelPercent: number;
  vehicleHealth: number;
  speedLimit: number;
  distanceRemaining: number;
  destinationName: string;
  currentStreet: string;
  timeElapsed: number;
  headlightsOn: boolean;
  blinkerLeft: boolean;
  blinkerRight: boolean;
  cameraMode: CameraMode;
  violations: number;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  isPaused: boolean;
  isMissionComplete: boolean;
  score: number;
  cashEarned: number;
  xpEarned: number;
}
