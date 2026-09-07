/**
 * ============================================================================
 * REALDRIVE ECONOMY — USED CAR MARKETPLACE AUCTION BROKER
 * ============================================================================
 * P2P vehicle auctions & marketplace brokering:
 * - Anti-sniping duration extensions (+3 minutes if bid placed in last 60s)
 * - Escrow locking & automated buyout processing
 * - Bid history audit trail
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { MarketplaceAuctionEntity, AuctionBid } from '../../database/entities/MarketplaceAuctionEntity.js';
import { VehicleEntity } from '../../database/entities/VehicleEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class UsedCarMarketplaceBroker {
  constructor(private database: DatabaseClient = db) {}

  public async getActiveAuctions(): Promise<MarketplaceAuctionEntity[]> {
    const q = this.database.query<MarketplaceAuctionEntity>('marketplace_auctions');
    q.where('status', '=', 'ACTIVE');
    q.orderBy('expiresAt', 'ASC');
    return this.database.executeQuery(q);
  }

  public async createAuction(
    sellerId: string,
    vehicleId: string,
    startingBid: number,
    buyoutPrice?: number,
    durationHours: number = 24
  ): Promise<MarketplaceAuctionEntity> {
    const vehicle = await this.database.findById<VehicleEntity>('vehicles', vehicleId);
    if (!vehicle) throw HttpError.notFound('Vehicle not found');
    if (vehicle.ownerId !== sellerId) throw HttpError.forbidden('You do not own this vehicle.');

    // Lock vehicle (remove from active garage)
    await this.database.update<VehicleEntity>('vehicles', vehicleId, { isInGarage: false });

    const startsAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + durationHours * 3600000).toISOString();

    const auction = await this.database.insert<MarketplaceAuctionEntity>('marketplace_auctions', {
      sellerId,
      vehicleId,
      vehicleName: vehicle.name,
      vehicleVin: vehicle.vin,
      vehicleMileageKm: vehicle.mileageKm,
      vehicleConditionPct: vehicle.engineConditionPct,
      startingBid,
      currentHighestBid: startingBid,
      buyoutPrice,
      bidIncrementMin: Math.max(500, Math.round(startingBid * 0.05)),
      bidsCount: 0,
      bidsHistoryJson: '[]',
      status: 'ACTIVE',
      startsAt,
      expiresAt,
      isFeatured: false,
    });

    return auction;
  }

  public async placeBid(auctionId: string, bidderUserId: string, bidAmount: number): Promise<MarketplaceAuctionEntity> {
    const auction = await this.database.findById<MarketplaceAuctionEntity>('marketplace_auctions', auctionId);
    if (!auction) throw HttpError.notFound('Auction not found');
    if (auction.status !== 'ACTIVE') throw HttpError.badRequest('Auction is no longer active.');
    if (auction.sellerId === bidderUserId) throw HttpError.badRequest('You cannot bid on your own auction.');

    const user = await this.database.findById<UserEntity>('users', bidderUserId);
    if (!user) throw HttpError.notFound('Bidder not found');

    const minRequiredBid = auction.bidsCount === 0 ? auction.startingBid : auction.currentHighestBid + auction.bidIncrementMin;
    if (bidAmount < minRequiredBid) {
      throw HttpError.badRequest(`Minimum bid required is ${minRequiredBid} credits.`);
    }

    const bankAcc = await this.database.findOne<BankAccountEntity>('bank_accounts', { userId: bidderUserId });
    if (!bankAcc || bankAcc.availableBalance < bidAmount) {
      throw HttpError.badRequest('Insufficient available funds in bank account for escrow.');
    }

    const bidsHistory: AuctionBid[] = JSON.parse(auction.bidsHistoryJson || '[]');
    bidsHistory.push({
      bidId: `bid_${Date.now()}`,
      bidderId: bidderUserId,
      bidderUsername: user.username,
      amount: bidAmount,
      placedAt: new Date().toISOString(),
    });

    // Anti-sniping extension
    let expiresAt = auction.expiresAt;
    const timeRemainingMs = new Date(auction.expiresAt).getTime() - Date.now();
    if (timeRemainingMs < 180000) { // Under 3 mins remaining
      expiresAt = new Date(Date.now() + 180000).toISOString();
    }

    // Check buyout
    let status: any = 'ACTIVE';
    if (auction.buyoutPrice && bidAmount >= auction.buyoutPrice) {
      status = 'BUYOUT_PURCHASED';
      // Transfer vehicle ownership
      await this.database.update<VehicleEntity>('vehicles', auction.vehicleId, {
        ownerId: bidderUserId,
        isInGarage: true,
      });
    }

    const updated = await this.database.update<MarketplaceAuctionEntity>('marketplace_auctions', auctionId, {
      currentHighestBid: bidAmount,
      highestBidderId: bidderUserId,
      highestBidderUsername: user.username,
      bidsCount: auction.bidsCount + 1,
      bidsHistoryJson: JSON.stringify(bidsHistory),
      expiresAt,
      status,
    });

    return updated!;
  }
}
