/**
 * ============================================================================
 * REALDRIVE ENTITY — FREIGHT HAULING CONTRACT ENTITY
 * ============================================================================
 * Industrial semi-truck and heavy cargo delivery contracts, tonnage weight,
 * refrigeration temperature bounds, hazardous material escort parameters.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface FreightContractEntity {
  id: string;
  contractCode: string;
  driverId?: string;
  cargoType: 'INDUSTRIAL_MACHINERY' | 'LIQUID_PETROLEUM' | 'HIGH_VOLTAGE_BATTERIES' | 'LUXURY_SUPERCAR_FLEET' | 'PERISHABLE_PRODUCE' | 'CONSTRUCTION_STEEL';
  cargoWeightTons: number;
  isFragile: boolean;
  isHazardous: boolean;
  requiredRefrigerationTempC?: number;
  originHub: string;
  originDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  destinationHub: string;
  destinationDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  totalDistanceKm: number;
  payoutAmount: number;
  penaltyPerDamagePct: number;
  timeLimitSeconds: number;
  cargoHealthPct: number;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'DELIVERED_PERFECT' | 'DELIVERED_DAMAGED' | 'FAILED_TIME_EXPIRED';
  deliveredAt?: string;
  createdAt: string;
}

export const FreightContractSchema: TableSchema<FreightContractEntity> = {
  name: 'freight_contracts',
  primaryKey: 'id',
  indexes: ['driverId', 'cargoType', 'originDistrict', 'destinationDistrict', 'status'],
  uniqueKeys: ['contractCode'],
  foreignKeys: [
    {
      field: 'driverId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'SET_NULL',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
