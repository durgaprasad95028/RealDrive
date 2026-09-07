/**
 * ============================================================================
 * REALDRIVE ENTITY — RACE TOURNAMENT ENTRY & GRID REGISTRATION ENTITY
 * ============================================================================
 * Driver registrations, qualifying times, starting grid positions,
 * race penalties, pit stop counts, final classification, and championship points.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface RaceEntryEntity {
  id: string;
  tournamentId: string;
  driverId: string;
  driverUsername: string;
  vehicleId: string;
  vehicleModelName: string;
  qualifyingLapTimeSeconds?: number;
  startingGridPosition: number; // 1 to 24
  finishPosition?: number;
  totalRaceTimeSeconds?: number;
  bestLapTimeSeconds?: number;
  lapsCompleted: number;
  pitStopsCount: number;
  penaltiesTimeSeconds: number;
  disqualified: boolean;
  disqualificationReason?: string;
  prizeMoneyWon: number;
  championshipPointsEarned: number;
  status: 'REGISTERED' | 'ON_GRID' | 'RACING' | 'FINISHED' | 'DNF_CRASHED' | 'DSQ';
  createdAt: string;
}

export const RaceEntrySchema: TableSchema<RaceEntryEntity> = {
  name: 'race_entries',
  primaryKey: 'id',
  indexes: ['tournamentId', 'driverId', 'finishPosition', 'status'],
  foreignKeys: [
    {
      field: 'tournamentId',
      referencesTable: 'race_tournaments',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
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
