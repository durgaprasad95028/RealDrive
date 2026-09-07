import { WeatherType, TimePeriod } from '../../../../types';

export type { WeatherType, TimePeriod };

export interface GamePoint {
  x: number;
  y: number;
  z: number;
}

export interface RoadSegment {
  index: number;
  p1: { world: GamePoint; screen: { x: number; y: number; w: number; scale: number } };
  p2: { world: GamePoint; screen: { x: number; y: number; w: number; scale: number } };
  curve: number;
  color: {
    road: string;
    grass: string;
    rumble: string;
    lane: string;
  };
  hasLight?: boolean;
  hasTree?: boolean;
  hasBuilding?: boolean;
  hasSignal?: boolean;
  signalState?: 'GREEN' | 'YELLOW' | 'RED';
  speedLimit?: number;
  roadSign?: string;
}

export interface TrafficCar {
  id: string;
  z: number; // Position along road track
  x: number; // Normalized road lane offset (-0.8 to +0.8)
  speed: number;
  maxSpeed: number;
  type: 'sedan' | 'suv' | 'taxi' | 'bus' | 'truck' | 'sports';
  color: string;
  width: number;
  length: number;
  targetLane: number;
  isBraking: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  life: number;
}

export type CameraMode = 'THIRD_PERSON' | 'FIRST_PERSON';

export interface GameTelemetry {
  speedKmh: number;
  rpm: number;
  gear: string;
  fuelPct: number;
  engineHealthPct: number;
  bodyHealthPct: number;
  distanceRemainingKm: number;
  totalTripKm: number;
  elapsedSeconds: number;
  violationsCount: number;
  speedLimit: number;
  currentInstruction: string;
  destinationName: string;
  safeScore: number;
  isSpeeding: boolean;
  cameraMode: CameraMode;
}
