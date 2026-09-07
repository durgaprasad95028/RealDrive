/**
 * ============================================================================
 * REALDRIVE ENTITY — MARKETPLACE AUCTION ENTITY
 * ============================================================================
 * Player-to-player live vehicle auctions, reserve prices, instant buyout,
 * bidding history, anti-sniping duration extensions, escrow fund locks.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface AuctionBid {
  bidId: string;
  bidderId: string;
  bidderUsername: string;
  amount: number;
  placedAt: string;
}

export interface MarketplaceAuctionEntity {
  id: string;
  sellerId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleVin: string;
  vehicleMileageKm: number;
  vehicleConditionPct: number;
  startingBid: number;
  currentHighestBid: number;
  highestBidderId?: string;
  highestBidderUsername?: string;
  reservePrice?: number;
  buyoutPrice?: number;
  bidIncrementMin: number;
  bidsCount: number;
  bidsHistoryJson: string; // Serialized AuctionBid[]
  status: 'ACTIVE' | 'SOLD' | 'RESERVE_NOT_MET' | 'BUYOUT_PURCHASED' | 'CANCELLED';
  startsAt: string;
  expiresAt: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MarketplaceAuctionSchema: TableSchema<MarketplaceAuctionEntity> = {
  name: 'marketplace_auctions',
  primaryKey: 'id',
  indexes: ['sellerId', 'highestBidderId', 'status', 'currentHighestBid', 'expiresAt'],
  foreignKeys: [
    {
      field: 'sellerId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
    {
      field: 'vehicleId',
      referencesTable: 'vehicles',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
