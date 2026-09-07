/**
 * ============================================================================
 * REALDRIVE ENTITY — REAL ESTATE DEED & PROPERTY ENTITY
 * ============================================================================
 * High-end penthouses, beachfront estates, commercial dyno repair shops,
 * industrial logistics hubs, daily rental revenues, and property valuation.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface RealEstatePropertyEntity {
  id: string;
  deedNumber: string;
  ownerId?: string; // Null if state-owned / bank-owned for sale
  title: string;
  propertyType: 'PENTHOUSE_APARTMENT' | 'BEACHFRONT_MANSION' | 'MOUNTAIN_VILLA' | 'COMMERCIAL_WORKSHOP' | 'LOGISTICS_DEPOT' | 'AIRPORT_HANGAR';
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  streetAddress: string;
  purchasePrice: number;
  currentMarketValue: number;
  dailyRentalIncome: number;
  dailyPropertyTax: number;
  garageParkingSlots: number;
  hasHelipad: boolean;
  hasPrivateDynoBay: boolean;
  isRentedOut: boolean;
  tenantName?: string;
  accumulatedRentalPayout: number;
  lastTaxCollectedAt?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const RealEstatePropertySchema: TableSchema<RealEstatePropertyEntity> = {
  name: 'real_estate_properties',
  primaryKey: 'id',
  indexes: ['ownerId', 'propertyType', 'district', 'currentMarketValue'],
  uniqueKeys: ['deedNumber'],
  foreignKeys: [
    {
      field: 'ownerId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'SET_NULL',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
