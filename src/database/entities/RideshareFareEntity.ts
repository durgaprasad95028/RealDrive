/**
 * ============================================================================
 * REALDRIVE ENTITY — RIDESHARE FARE & PASSENGER TRIP ENTITY
 * ============================================================================
 * Urban passenger rides, surge pricing multipliers, passenger personalities,
 * conversation dialog events, ride smoothness scoring, and passenger tips.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface RideshareFareEntity {
  id: string;
  fareCode: string;
  driverId?: string;
  passengerName: string;
  passengerAvatar: string;
  passengerMood: 'CHEERFUL' | 'BUSINESS_RUSH' | 'TALKATIVE' | 'SILENT_VIP' | 'INTOXICATED_PARTY' | 'NERVOUS';
  pickupLocation: string;
  pickupDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  pickupCoords: { x: number; y: number; z: number };
  dropoffLocation: string;
  dropoffDistrict: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  dropoffCoords: { x: number; y: number; z: number };
  estimatedDistanceKm: number;
  estimatedDurationSeconds: number;
  baseFare: number;
  surgeMultiplier: number;
  finalFare: number;
  tipAmount: number;
  status: 'DISPATCHED' | 'ACCEPTED' | 'PASSENGER_PICKED_UP' | 'COMPLETED' | 'CANCELLED';
  passengerRatingGiven?: number; // 1 to 5
  drivingSmoothnessScorePct?: number; // 0 to 100%
  completedAt?: string;
  createdAt: string;
}

export const RideshareFareSchema: TableSchema<RideshareFareEntity> = {
  name: 'rideshare_fares',
  primaryKey: 'id',
  indexes: ['driverId', 'pickupDistrict', 'dropoffDistrict', 'status', 'createdAt'],
  uniqueKeys: ['fareCode'],
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
