/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - DEALERSHIP SHOWROOM & FINANCING SERVICE
 * ============================================================================
 * Service layer managing brand flagship showrooms, bespoke vehicle trim configurations,
 * financing calculation engines, and used car trade-in appraisals.
 */

import { VEHICLE_CATALOG } from '../vehicles/VehicleRepository';
import { UsedCarMarketplaceService, USED_CAR_MARKETPLACE_DATABASE } from '../../database/seed_data/UsedCarMarketplaceHistoricalDataset';

export interface ShowroomTrimPackage {
  readonly trimId: string;
  readonly trimName: string;
  readonly priceModifierUSD: number;
  readonly includedFeatures: readonly string[];
}

export interface ShowroomVehicleDisplay {
  readonly vehicleId: string;
  readonly brand: string;
  readonly name: string;
  readonly category: string;
  readonly baseMSRPUSD: number;
  readonly horsepowerHp: number;
  readonly torqueNm: number;
  readonly zeroTo100Sec: number;
  readonly topSpeedKph: number;
  readonly availableTrims: readonly ShowroomTrimPackage[];
  readonly exteriorColorsHex: readonly { name: string; hex: string; priceUSD: number }[];
  readonly interiorColorsHex: readonly { name: string; hex: string; priceUSD: number }[];
}

export interface FinancingPlanEstimate {
  readonly vehiclePriceUSD: number;
  readonly downPaymentUSD: number;
  readonly principalLoanUSD: number;
  readonly annualPercentageRateApr: number;
  readonly loanTermMonths: number;
  readonly monthlyPaymentUSD: number;
  readonly totalInterestCostUSD: number;
  readonly totalLoanRepaymentUSD: number;
}

export interface TradeInAppraisalResult {
  readonly vin: string;
  readonly vehicleMakeModel: string;
  readonly appraisedTradeInValueUSD: number;
  readonly privatePartyEstimatedValueUSD: number;
  readonly conditionDiscountPercent: number;
  readonly mileageDiscountPercent: number;
}

export class ShowroomInventoryService {
  private static instance: ShowroomInventoryService;

  private constructor() {}

  public static getInstance(): ShowroomInventoryService {
    if (!ShowroomInventoryService.instance) {
      ShowroomInventoryService.instance = new ShowroomInventoryService();
    }
    return ShowroomInventoryService.instance;
  }

  public getAvailableShowroomVehicles(): ShowroomVehicleDisplay[] {
    return VEHICLE_CATALOG.map(veh => {
      const msrp = veh.specs.basePriceUSD || (veh.specs.horsepower * 180 + 25000);
      return {
        vehicleId: veh.id,
        brand: veh.category.toUpperCase() + ' MOTORS',
        name: veh.name,
        category: veh.category,
        baseMSRPUSD: msrp,
        horsepowerHp: veh.specs.horsepower,
        torqueNm: veh.specs.torque,
        zeroTo100Sec: veh.specs.zeroToSixty,
        topSpeedKph: veh.specs.topSpeed,
        availableTrims: [
          { trimId: 'trim_base', trimName: 'Standard Competition', priceModifierUSD: 0, includedFeatures: ['Sport Leather Seats', 'Launch Control', 'Standard ESC'] },
          { trimId: 'trim_track_pack', trimName: 'Track Carbon Package', priceModifierUSD: 18500, includedFeatures: ['Carbon Ceramic Brakes', 'Titanium Exhaust', 'Recaro Pole Position Seats'] },
          { trimId: 'trim_corsa_unlimited', trimName: 'Corsa Unlimited Stradale', priceModifierUSD: 38000, includedFeatures: ['Active DRS Carbon Wing', 'Forged Magnesium Wheels', 'Telemetry BlackBox', 'Bespoke Livery'] }
        ],
        exteriorColorsHex: [
          { name: 'Apex Pure White', hex: '#FFFFFF', priceUSD: 0 },
          { name: 'Nardo Stealth Grey', hex: '#6C7074', priceUSD: 1200 },
          { name: 'Rosso Corsa Racing Red', hex: '#D40000', priceUSD: 2500 },
          { name: 'Bayside Midnight Blue', hex: '#0A2472', priceUSD: 2500 },
          { name: 'Liquid Forged Carbon', hex: '#1C1C1C', priceUSD: 8500 }
        ],
        interiorColorsHex: [
          { name: 'Nero Black Alcantara', hex: '#111111', priceUSD: 0 },
          { name: 'Tan Hermès Saddle Leather', hex: '#C18742', priceUSD: 3200 },
          { name: 'Acid Green Contrast Stitch', hex: '#BFFF00', priceUSD: 1800 }
        ]
      };
    });
  }

  public calculateFinancing(
    vehiclePriceUSD: number,
    downPaymentUSD: number,
    creditScoreRating: 'exceptional' | 'good' | 'fair' | 'poor' = 'good',
    loanTermMonths: 12 | 24 | 36 | 48 | 60 = 48
  ): FinancingPlanEstimate {
    const down = Math.max(0, Math.min(vehiclePriceUSD * 0.8, downPaymentUSD));
    const principal = vehiclePriceUSD - down;

    let apr = 5.9;
    if (creditScoreRating === 'exceptional') apr = 3.9;
    else if (creditScoreRating === 'good') apr = 5.9;
    else if (creditScoreRating === 'fair') apr = 8.9;
    else if (creditScoreRating === 'poor') apr = 13.5;

    const monthlyRate = (apr / 100.0) / 12.0;
    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const factor = Math.pow(1 + monthlyRate, loanTermMonths);
    const monthlyPayment = principal > 0 ? (principal * (monthlyRate * factor)) / (factor - 1) : 0;
    const totalRepaid = monthlyPayment * loanTermMonths;
    const totalInterest = Math.max(0, totalRepaid - principal);

    return {
      vehiclePriceUSD,
      downPaymentUSD: down,
      principalLoanUSD: principal,
      annualPercentageRateApr: apr,
      loanTermMonths,
      monthlyPaymentUSD: Math.round(monthlyPayment),
      totalInterestCostUSD: Math.round(totalInterest),
      totalLoanRepaymentUSD: Math.round(totalRepaid + down)
    };
  }

  public appraiseTradeInVehicle(vinOrListingId: string): TradeInAppraisalResult {
    const listing = USED_CAR_MARKETPLACE_DATABASE.find(l => l.vin === vinOrListingId || l.listingId === vinOrListingId);
    if (!listing) {
      return {
        vin: vinOrListingId,
        vehicleMakeModel: 'Generic Registered Vehicle',
        appraisedTradeInValueUSD: 18500,
        privatePartyEstimatedValueUSD: 23000,
        conditionDiscountPercent: 10,
        mileageDiscountPercent: 12
      };
    }

    const baseVal = listing.askingPriceUSD;
    const mileageDiscount = Math.min(35.0, (listing.mileageKm / 100000.0) * 20.0);
    const rustDiscount = listing.conditionReport.chassisRustScorePercent * 0.8;
    const totalDiscountPercent = mileageDiscount + rustDiscount;

    const privateParty = Math.round(baseVal * (1.0 - (totalDiscountPercent / 100.0)));
    const tradeInDealerValue = Math.round(privateParty * 0.82); // Wholesale 82% margin

    return {
      vin: listing.vin,
      vehicleMakeModel: `${listing.year} ${listing.make} ${listing.model}`,
      appraisedTradeInValueUSD: tradeInDealerValue,
      privatePartyEstimatedValueUSD: privateParty,
      conditionDiscountPercent: Math.round(rustDiscount),
      mileageDiscountPercent: Math.round(mileageDiscount)
    };
  }
}
