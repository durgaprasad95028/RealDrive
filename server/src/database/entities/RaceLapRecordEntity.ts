/**
 * ============================================================================
 * REALDRIVE ENTITY — RACE LAP RECORD & SECTOR TELEMETRY ENTITY
 * ============================================================================
 * Hall of Fame lap records, Sector 1/2/3 split timing, apex speeds,
 * telemetry ghost file links, and track world record leaderboards.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface RaceLapRecordEntity {
  id: string;
  trackId: string;
  trackName: string;
  driverId: string;
  driverUsername: string;
  vehicleId: string;
  vehicleName: string;
  vehicleClass: string;
  lapTimeSeconds: number; // e.g. 78.432s
  sector1Seconds: number;
  sector2Seconds: number;
  sector3Seconds: number;
  topSpeedKmh: number;
  averageSpeedKmh: number;
  weatherCondition: string;
  isWorldRecord: boolean;
  isValidatedAntiCheat: boolean;
  ghostTelemetryDataUrl?: string;
  recordedAt: string;
}

export const RaceLapRecordSchema: TableSchema<RaceLapRecordEntity> = {
  name: 'race_lap_records',
  primaryKey: 'id',
  indexes: ['trackId', 'driverId', 'vehicleClass', 'lapTimeSeconds', 'isWorldRecord'],
  foreignKeys: [
    {
      field: 'driverId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
    {
      field: 'vehicleId',
      referencesTable: 'vehicles',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
