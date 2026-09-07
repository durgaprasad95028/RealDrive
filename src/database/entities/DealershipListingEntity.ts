/**
 * ============================================================================
 * REALDRIVE ENTITY — DEALERSHIP SHOWROOM LISTING ENTITY
 * ============================================================================
 * Official vehicle manufacturer showrooms, promotional discounts,
 * certified pre-owned stock, and dealership warranties.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface DealershipListingEntity {
  id: string;
  dealershipName: string;
  dealershipBrand: string;
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  vehicleModelId: string;
  vehicleName: string;
  vehicleClass: string;
  modelYear: number;
  retailPrice: number;
  discountPercentage: number;
  finalPrice: number;
  stockQuantity: number;
  isFeatured: boolean;
  warrantyDurationMonths: number;
  availableColors: string[];
  aprFinancingAvailable: boolean;
  minimumCreditScore: number;
  createdAt: string;
  updatedAt: string;
}

export const DealershipListingSchema: TableSchema<DealershipListingEntity> = {
  name: 'dealership_listings',
  primaryKey: 'id',
  indexes: ['dealershipBrand', 'district', 'vehicleClass', 'finalPrice', 'isFeatured'],
  timestamps: true,
  softDeletes: false,
};
