/**
 * ============================================================================
 * REALDRIVE ENTITY — POLICE WANTED HEAT & PURSUIT RECORD ENTITY
 * ============================================================================
 * Player wanted heat levels (Heat 1: Local Cruiser to Heat 5: Corvette Interceptor
 * & Police Helicopter Searchlight), active search grid radius, pursuit tactics.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface PursuitCruiserUnit {
  unitId: string;
  unitType: 'CROWN_VICTORIA_PATROL' | 'CHARGER_INTERCEPTOR' | 'CORVETTE_PURSUIT' | 'RHINO_SUV_BLOCKER' | 'AIR_SUPPORT_HELICOPTER';
  callsign: string;
  distanceToSuspectM: number;
  damagePct: number;
  hasLineOfSight: boolean;
}

export interface WantedRecordEntity {
  id: string;
  driverId: string;
  driverUsername: string;
  vehicleId: string;
  vehiclePlate: string;
  heatLevel: 1 | 2 | 3 | 4 | 5;
  bountyRewardCredits: number;
  pursuitDurationSeconds: number;
  lastKnownDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  lastKnownCoords: { x: number; y: number; z: number };
  searchRadiusMeters: number;
  activeCruisersJson: string; // Serialized PursuitCruiserUnit[]
  roadblocksDeployed: number;
  spikeStripsDeployed: number;
  helicopterActive: boolean;
  evasionCooldownRemainingSeconds: number;
  status: 'ACTIVE_PURSUIT' | 'COOLDOWN_SEARCHING' | 'EVADED_SUCCESS' | 'BUSTED_ARRESTED';
  startedAt: string;
  endedAt?: string;
}

export const WantedRecordSchema: TableSchema<WantedRecordEntity> = {
  name: 'wanted_records',
  primaryKey: 'id',
  indexes: ['driverId', 'heatLevel', 'status', 'startedAt'],
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
