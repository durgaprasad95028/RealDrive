/**
 * ============================================================================
 * REALDRIVE ENTITY — VEHICLE TELEMETRY ENTITY
 * ============================================================================
 * High-speed 60Hz telemetry session logs:
 * Lateral/Longitudinal G-forces, slip angles, suspension travel, throttle/brake trace.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface TelemetrySample {
  timestampMs: number;
  speedKmh: number;
  engineRpm: number;
  gear: number;
  throttlePct: number;
  brakePressureBar: number;
  clutchPct: number;
  steeringAngleDeg: number;
  lateralG: number;
  longitudinalG: number;
  verticalG: number;
  yawRateDegSec: number;
  tireSlipRatioFL: number;
  tireSlipRatioFR: number;
  tireSlipRatioRL: number;
  tireSlipRatioRR: number;
  tireTempFL: number;
  tireTempFR: number;
  tireTempRL: number;
  tireTempRR: number;
  brakeTempFL: number;
  brakeTempFR: number;
  brakeTempRL: number;
  brakeTempRR: number;
  engineCoolantTempC: number;
  oilTempC: number;
  turboBoostBar: number;
  fuelRemainingLiters: number;
  posX: number;
  posY: number;
  posZ: number;
}

export interface VehicleTelemetryEntity {
  id: string;
  vehicleId: string;
  userId: string;
  trackId?: string;
  sessionType: 'FREE_ROAM' | 'TIME_ATTACK' | 'DRAG_STRIP' | 'DRIFT_TANDEM' | 'CIRCUIT_RACE';
  maxSpeedKmh: number;
  maxLateralG: number;
  maxLongitudinalG: number;
  maxRpm: number;
  averageSpeedKmh: number;
  totalDistanceKm: number;
  totalDurationSeconds: number;
  lapTimeSeconds?: number;
  samplesJson: string; // Serialized compressed array of TelemetrySample
  createdAt: string;
}

export const VehicleTelemetrySchema: TableSchema<VehicleTelemetryEntity> = {
  name: 'vehicle_telemetry_logs',
  primaryKey: 'id',
  indexes: ['vehicleId', 'userId', 'trackId', 'sessionType'],
  foreignKeys: [
    {
      field: 'vehicleId',
      referencesTable: 'vehicles',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
