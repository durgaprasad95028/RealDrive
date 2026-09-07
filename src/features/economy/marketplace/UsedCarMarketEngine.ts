/**
 * UsedCarMarketEngine — Procedural Marketplace, Vehicle History Reports, Haggling AI & Live Auctions
 */

import { VEHICLE_CATALOG_DATA, VehicleCatalogEntry } from '../../vehicles/fleet/VehicleCatalogData';

export type TitleStatus = 'CLEAN' | 'REBUILT_SALVAGE' | 'LEMON_BUYBACK' | 'THEFT_RECOVERY';

export type SellerPersonality = 'FIRM_ENTHUSIAST' | 'DESPERATE_SELLER' | 'SHREWD_DEALER' | 'ELDERLY_CARETAKER';

export interface MechanicalConditionReport {
  engineHealthPercent: number; // 30% to 100%
  transmissionWearPercent: number;
  suspensionBushingWearPercent: number;
  brakePadThicknessMm: number; // 2mm to 12mm
  tireTreadDepthMm: number; // 1.5mm to 8.0mm
  bodyPaintConditionPercent: number;
  hasOilLeak: boolean;
  hasRustCorrosion: boolean;
  hasAccidentFrameDamage: boolean;
}

export interface UsedCarListing {
  id: string;
  vehicleId: string;
  catalogEntry: VehicleCatalogEntry;
  year: number;
  mileageKm: number;
  previousOwnersCount: number;
  titleStatus: TitleStatus;
  sellerName: string;
  sellerPersonality: SellerPersonality;
  sellerLocationDistrict: string;
  sellerDescription: string;
  askingPriceCredits: number;
  minimumAcceptablePriceCredits: number;
  conditionReport: MechanicalConditionReport;
  customModificationsInstalled: string[];
  listingExpiresTimestamp: number;
}

export interface LiveAuctionItem {
  auctionId: string;
  listing: UsedCarListing;
  currentBidCredits: number;
  highestBidderName: string;
  reservePriceCredits: number;
  isReserveMet: boolean;
  bidsCount: number;
  timeRemainingSeconds: number;
  isHammerDown: boolean;
}

export class UsedCarMarketEngine {
  private static sellers: Array<{ name: string; personality: SellerPersonality }> = [
    { name: 'Klaus Schmidt', personality: 'FIRM_ENTHUSIAST' },
    { name: 'Tyler Vance', personality: 'DESPERATE_SELLER' },
    { name: 'Apex Premier Motors (Dealer)', personality: 'SHREWD_DEALER' },
    { name: 'Arthur Pendelton', personality: 'ELDERLY_CARETAKER' },
    { name: 'Dmitri Volkov', personality: 'FIRM_ENTHUSIAST' },
    { name: 'Samantha Brooks', personality: 'DESPERATE_SELLER' },
  ];

  /**
   * Generates a batch of procedural used vehicle listings
   */
  public static generateMarketListings(count: number = 10): UsedCarListing[] {
    const listings: UsedCarListing[] = [];
    const pool = VEHICLE_CATALOG_DATA.filter((v) => v.tier !== 'X'); // Exclude multi-million hypercars from ordinary classifieds

    for (let i = 0; i < count; i++) {
      const car = pool[Math.floor(Math.random() * pool.length)];
      const seller = this.sellers[Math.floor(Math.random() * this.sellers.length)];

      const mileage = Math.round(15000 + Math.random() * 190000);
      const owners = Math.min(6, Math.floor(1 + mileage / 40000));

      const isSalvage = Math.random() < 0.12;
      const title: TitleStatus = isSalvage ? 'REBUILT_SALVAGE' : 'CLEAN';

      // Condition degradation with mileage
      const wearBase = Math.max(0.35, 1.0 - (mileage / 240000) * 0.65);
      const condition: MechanicalConditionReport = {
        engineHealthPercent: Math.round((wearBase + (Math.random() * 0.2 - 0.1)) * 100),
        transmissionWearPercent: Math.round((1 - wearBase) * 100),
        suspensionBushingWearPercent: Math.round((1 - wearBase * 0.9) * 100),
        brakePadThicknessMm: Math.round((2.0 + Math.random() * 8.0) * 10) / 10,
        tireTreadDepthMm: Math.round((2.0 + Math.random() * 6.0) * 10) / 10,
        bodyPaintConditionPercent: Math.round((wearBase * 0.9 + 0.1) * 100),
        hasOilLeak: mileage > 90000 && Math.random() < 0.4,
        hasRustCorrosion: mileage > 120000 && Math.random() < 0.35,
        hasAccidentFrameDamage: isSalvage,
      };

      // Valuation calculation
      let priceDiscount = (mileage / 200000) * 0.45 + (1.0 - condition.engineHealthPercent / 100) * 0.3;
      if (isSalvage) priceDiscount += 0.35;
      priceDiscount = Math.min(0.75, Math.max(0.1, priceDiscount));

      const askingPrice = Math.round(car.priceCredits * (1.0 - priceDiscount));
      const minAcceptable = Math.round(
        askingPrice * (seller.personality === 'DESPERATE_SELLER' ? 0.78 : seller.personality === 'FIRM_ENTHUSIAST' ? 0.95 : 0.88)
      );

      const districts = ['Downtown', 'Suburbs', 'Harbor', 'Industrial', 'Airport'];
      const district = districts[Math.floor(Math.random() * districts.length)];

      listings.push({
        id: `listing_${Date.now()}_${i}`,
        vehicleId: car.id,
        catalogEntry: car,
        year: car.year - Math.floor(mileage / 25000),
        mileageKm: mileage,
        previousOwnersCount: owners,
        titleStatus: title,
        sellerName: seller.name,
        sellerPersonality: seller.personality,
        sellerLocationDistrict: district,
        sellerDescription:
          seller.personality === 'FIRM_ENTHUSIAST'
            ? 'Garage-kept, oil changed every 3,000 miles with synthetic oil. No lowballers, I know what I have.'
            : seller.personality === 'DESPERATE_SELLER'
            ? 'Moving overseas next week, priced for a quick cash sale today. Serious buyers only.'
            : 'Dealer certified pre-owned trade-in with clean CarFax inspection history.',
        askingPriceCredits: askingPrice,
        minimumAcceptablePriceCredits: minAcceptable,
        conditionReport: condition,
        customModificationsInstalled: mileage > 60000 ? ['Stage 1 Intake', 'Cat-Back Exhaust'] : [],
        listingExpiresTimestamp: Date.now() + 86400000 * 3,
      });
    }

    return listings;
  }

  /**
   * AI Negotiation counter-offer resolution
   */
  public static evaluateNegotiationOffer(
    listing: UsedCarListing,
    offeredPriceCredits: number
  ): {
    isAccepted: boolean;
    counterOfferCredits?: number;
    sellerResponseMsg: string;
  } {
    if (offeredPriceCredits >= listing.askingPriceCredits) {
      return {
        isAccepted: true,
        sellerResponseMsg: 'Deal! We have an agreement at full asking price.',
      };
    }

    if (offeredPriceCredits >= listing.minimumAcceptablePriceCredits) {
      return {
        isAccepted: true,
        sellerResponseMsg: `Alright, that is fair. I will accept your offer of $${offeredPriceCredits.toLocaleString()}.`,
      };
    }

    // Counter offer between offer and asking price
    const diff = listing.askingPriceCredits - offeredPriceCredits;
    const counter = Math.round(offeredPriceCredits + diff * 0.65);

    return {
      isAccepted: false,
      counterOfferCredits: counter,
      sellerResponseMsg: `That is too low for this car. The lowest I could possibly do is $${counter.toLocaleString()}.`,
    };
  }
}
