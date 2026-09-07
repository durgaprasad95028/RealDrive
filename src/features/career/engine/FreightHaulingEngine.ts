/**
 * FreightHaulingEngine — Heavy Commercial Logistics, Cargo Contracts & Fleet Enterprise Simulator
 */

export type CargoCategory =
  | 'DRY_GOODS_CONTAINER'
  | 'REFRIGERATED_PERISHABLES'
  | 'FRAGILE_ELECTRONICS'
  | 'HAZMAT_CHEMICALS'
  | 'LUXURY_VEHICLE_CARRIER'
  | 'OVERSIZED_INDUSTRIAL_EQUIPMENT';

export interface FreightContract {
  id: string;
  title: string;
  category: CargoCategory;
  originDistrict: string;
  originHub: string;
  destinationDistrict: string;
  destinationHub: string;
  cargoWeightTons: number;
  minimumTruckHpRequired: number;
  fragilityPercent: number; // 0% (solid steel) to 90% (delicate glassware)
  hazardClass?: string;
  rewardCredits: number;
  bonusOnTimeCredits: number;
  damagePenaltyRatePerPercent: number; // credits deducted per 1% cargo damage
  distanceKm: number;
  timeLimitMinutes: number;
  requiredDriverLevel: number;
}

export interface ActiveFreightHaul {
  contract: FreightContract;
  cargoIntegrityPercent: number; // 100% -> decreases with hard impacts/rollovers
  currentFuelLiters: number;
  fuelBurnRateLitersPer100Km: number;
  distanceCoveredKm: number;
  elapsedSeconds: number;
  weighStationPassed: boolean;
  weighStationOverweightViolation: boolean;
  isDelivered: boolean;
}

export interface LogisticsCompanyEnterprise {
  companyName: string;
  headquartersDistrict: string;
  ownedDepots: string[];
  ownedTrucksCount: number;
  hiredDriversCount: number;
  reputationRating: number; // 0.0 to 10.0
  totalFreightDeliveredTons: number;
  totalCompanyRevenue: number;
  dailyOperatingCost: number;
}

export class FreightHaulingEngine {
  /**
   * Generates active high-paying logistics freight contracts
   */
  public static generateAvailableContracts(playerDriverLevel: number = 1): FreightContract[] {
    const contracts: FreightContract[] = [
      {
        id: 'freight_harbor_to_airport_chips',
        title: 'High-Density Silicon Microchip Wafers',
        category: 'FRAGILE_ELECTRONICS',
        originDistrict: 'Harbor',
        originHub: 'Port Terminal Pier 12 Container Gate',
        destinationDistrict: 'Airport',
        destinationHub: 'Air Cargo Freight Logistics Hub B',
        cargoWeightTons: 14.5,
        minimumTruckHpRequired: 420,
        fragilityPercent: 65,
        rewardCredits: 14500,
        bonusOnTimeCredits: 3500,
        damagePenaltyRatePerPercent: 250,
        distanceKm: 22.0,
        timeLimitMinutes: 18,
        requiredDriverLevel: 1,
      },
      {
        id: 'freight_industrial_to_downtown_steel',
        title: 'Structural Steel I-Beams for Skyscraper Core',
        category: 'OVERSIZED_INDUSTRIAL_EQUIPMENT',
        originDistrict: 'Industrial',
        originHub: 'Titan Heavy Foundry & Steel Yard',
        destinationDistrict: 'Downtown',
        destinationHub: 'Grand Tower Construction Staging Site',
        cargoWeightTons: 38.0,
        minimumTruckHpRequired: 560,
        fragilityPercent: 10,
        rewardCredits: 22000,
        bonusOnTimeCredits: 4800,
        damagePenaltyRatePerPercent: 120,
        distanceKm: 16.5,
        timeLimitMinutes: 22,
        requiredDriverLevel: 5,
      },
      {
        id: 'freight_chemical_tanker_corridor',
        title: 'Class 3 Flammable Industrial Polymer Solvents',
        category: 'HAZMAT_CHEMICALS',
        hazardClass: 'Class 3 Flammable Liquid (UN 1993)',
        originDistrict: 'Industrial',
        originHub: 'Apex Petrochemical Refining Plant',
        destinationDistrict: 'Harbor',
        destinationHub: 'Chemical Export Tanker Dock 3',
        cargoWeightTons: 26.5,
        minimumTruckHpRequired: 480,
        fragilityPercent: 85,
        rewardCredits: 31000,
        bonusOnTimeCredits: 7500,
        damagePenaltyRatePerPercent: 600,
        distanceKm: 28.0,
        timeLimitMinutes: 20,
        requiredDriverLevel: 10,
      },
      {
        id: 'freight_supercar_enclosed_transport',
        title: 'Enclosed Exotic Supercar Multi-Carrier',
        category: 'LUXURY_VEHICLE_CARRIER',
        originDistrict: 'Airport',
        originHub: 'Private Air Cargo Hangar 7',
        destinationDistrict: 'Suburbs',
        destinationHub: 'Pinecrest Luxury Concierge Collection',
        cargoWeightTons: 18.0,
        minimumTruckHpRequired: 450,
        fragilityPercent: 90,
        rewardCredits: 42000,
        bonusOnTimeCredits: 10000,
        damagePenaltyRatePerPercent: 950,
        distanceKm: 24.5,
        timeLimitMinutes: 25,
        requiredDriverLevel: 12,
      },
    ];

    return contracts.filter((c) => c.requiredDriverLevel <= playerDriverLevel + 2);
  }

  /**
   * Evaluates final freight delivery payout, cargo damage deductions, and company XP
   */
  public static processDeliverySettlement(haul: ActiveFreightHaul): {
    payoutCredits: number;
    cargoDamageDeduction: number;
    fuelCostDeduction: number;
    netProfitCredits: number;
    experienceEarned: number;
    reputationGain: number;
  } {
    const c = haul.contract;
    const damagePercent = Math.max(0, 100 - haul.cargoIntegrityPercent);
    const cargoDeduction = Math.round(damagePercent * c.damagePenaltyRatePerPercent);

    // Fuel cost: $1.45 per liter
    const fuelUsedLiters = (haul.distanceCoveredKm / 100) * haul.fuelBurnRateLitersPer100Km;
    const fuelCost = Math.round(fuelUsedLiters * 1.45);

    const isFast = haul.elapsedSeconds <= c.timeLimitMinutes * 60;
    const grossPayout = c.rewardCredits + (isFast ? c.bonusOnTimeCredits : 0);
    const netProfit = Math.max(0, grossPayout - cargoDeduction - fuelCost);

    const xp = Math.round(netProfit * 0.45);
    const rep = damagePercent === 0 ? 0.25 : damagePercent < 10 ? 0.1 : -0.3;

    return {
      payoutCredits: grossPayout,
      cargoDamageDeduction: cargoDeduction,
      fuelCostDeduction: fuelCost,
      netProfitCredits: netProfit,
      experienceEarned: xp,
      reputationGain: rep,
    };
  }
}
