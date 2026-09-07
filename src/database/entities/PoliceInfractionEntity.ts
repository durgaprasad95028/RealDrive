/**
 * ============================================================================
 * REALDRIVE ENTITY — POLICE INFRACTION & CITATION ENTITY
 * ============================================================================
 * Traffic police incident logs, moving violations, reckless endangerment,
 * PIT maneuver arrest records, fines, and license penalty points.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface PoliceInfractionEntity {
  id: string;
  citationNumber: string;
  driverId: string;
  driverUsername: string;
  vehicleId: string;
  vehiclePlate: string;
  violationType:
    | 'SPEEDING_MINOR'
    | 'EXCESSIVE_SPEEDING_DANGEROUS'
    | 'RED_LIGHT_VIOLATION'
    | 'RECKLESS_DRIFTING'
    | 'EVADING_POLICE_PURSUIT'
    | 'STRIKING_POLICE_CRUISER'
    | 'DRIVING_WITHOUT_INSURANCE'
    | 'DESTRUCTIVE_STREET_RACING';
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  recordedSpeedKmh?: number;
  speedLimitKmh?: number;
  fineAmount: number;
  penaltyPoints: number;
  isPaid: boolean;
  isImpoundedVehicle: boolean;
  pursuitDurationSeconds?: number;
  issuedAt: string;
  paidAt?: string;
}

export const PoliceInfractionSchema: TableSchema<PoliceInfractionEntity> = {
  name: 'police_infractions',
  primaryKey: 'id',
  indexes: ['driverId', 'violationType', 'isPaid', 'issuedAt'],
  uniqueKeys: ['citationNumber'],
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
