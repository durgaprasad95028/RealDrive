/**
 * ============================================================================
 * REALDRIVE ENTITY — GARAGE PROPERTY ENTITY
 * ============================================================================
 * Player real estate garages, mechanic lift bays, tool tier upgrades,
 * dyno testing stations, and vehicle parking capacity.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface GarageEntity {
  id: string;
  ownerId: string;
  name: string;
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  address: string;
  tier: 'BASIC_2_CAR' | 'WORKSHOP_5_CAR' | 'MANSION_10_CAR' | 'COMMERCIAL_25_CAR' | 'UNDERGROUND_VAULT_50_CAR';
  vehicleCapacity: number;
  currentVehicleCount: number;
  hasHydraulicLift: boolean;
  hasDynoTuningCell: boolean;
  hasPaintBooth: boolean;
  hasLaserWheelAlignment: boolean;
  securityLevel: number; // 1 to 5
  dailyMaintenanceCost: number;
  marketValuation: number;
  interiorTheme: 'CLEAN_MINIMALIST' | 'GRITTY_INDUSTRIAL' | 'CYBERPUNK_NEON' | 'LUXURY_SHOWROOM';
  createdAt: string;
  updatedAt: string;
}

export const GarageSchema: TableSchema<GarageEntity> = {
  name: 'garages',
  primaryKey: 'id',
  indexes: ['ownerId', 'district', 'tier'],
  foreignKeys: [
    {
      field: 'ownerId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
