/**
 * ============================================================================
 * REALDRIVE ENTITY — EXPRESS COURIER & FOOD DELIVERY ORDER ENTITY
 * ============================================================================
 * High-speed urban motorbike/compact car courier dispatches, temperature
 * decay timers, fragile medical organ transports, and rush delivery tips.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface DeliveryOrderEntity {
  id: string;
  orderNumber: string;
  courierId?: string;
  orderCategory: 'HOT_GOURMET_FOOD' | 'ICE_CREAM_FROZEN' | 'EMERGENCY_MEDICAL_BLOOD' | 'LEGAL_COURT_DOCUMENTS' | 'ELECTRONICS_HARDWARE';
  restaurantOrSenderName: string;
  recipientName: string;
  pickupAddress: string;
  pickupDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  deliveryAddress: string;
  deliveryDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  distanceKm: number;
  timeTargetSeconds: number;
  elapsedSeconds: number;
  qualityIntegrityPct: number; // 100% decaying over time / bumps
  basePay: number;
  bonusSpeedTip: number;
  totalEarnings: number;
  status: 'PENDING_PICKUP' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'SPOILED_FAILED';
  deliveredAt?: string;
  createdAt: string;
}

export const DeliveryOrderSchema: TableSchema<DeliveryOrderEntity> = {
  name: 'delivery_orders',
  primaryKey: 'id',
  indexes: ['courierId', 'orderCategory', 'status', 'createdAt'],
  uniqueKeys: ['orderNumber'],
  foreignKeys: [
    {
      field: 'courierId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'SET_NULL',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
