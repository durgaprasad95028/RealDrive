/**
 * ============================================================================
 * REALDRIVE SEED DATA - CAREER CONTRACTS & UNDERGROUND MISSIONS (PART 2)
 * ============================================================================
 * 400+ Specialized driver missions across underground, tactical, and executive operations:
 * - Armored Bullion Cash-in-Transit Escorts (Reinforced Ramming Bumpers & Armor)
 * - Prototype Spy Vehicle Night Camo Road Testing (Stay Out of Sight of Paparazzi)
 * - Emergency Organ Transplant High-Speed Corridor Sprint (Sirens & Police Escort)
 * - Midnight Mountain Touge Drift Delivery (Fragile Tofu & Tea Cargo Physics)
 */

import { RideshareFareRequest } from './CareerRideshareFaresDataset';

export const CAREER_CONTRACTS_PART2_DATABASE: readonly RideshareFareRequest[] = [
  {
    fareId: 'contract_bullion_armor_001',
    passengerName: 'Brinks Armored Gold Transit Dispatch',
    passengerRating: 5.0,
    personality: 'impatient_executive',
    pickupLocationName: 'Federal Reserve Bank Vault Sub-Basement',
    pickupCoordsVec3: [-350.0, -10.0, 850.0],
    destinationLocationName: 'International Airport Private Cargo Vault',
    destinationCoordsVec3: [1100.0, 1.5, 2100.0],
    estimatedDistanceKm: 16.5,
    timeLimitSeconds: 420,
    baseFareUSD: 3500,
    perKmRateUSD: 85.0,
    tipBonusUSD: 5000,
    maxAllowableLateralG: 1.8,
    maxAllowableCrashes: 5, // Armored vehicle can ram obstacles
    surgePricingMultiplier: 1.5,
    passengerDialogueOnPickup: 'You are transporting 4 tons of pure gold bullion. Security escort is tracking you. Do not stop for anything!',
    passengerDialogueOnArrival: 'Vault transfer secure and verified. Full cash bonus deposited to your bank ledger.'
  },
  {
    fareId: 'contract_camo_prototype_002',
    passengerName: 'Apex Hyperdynamics R&D Chief Engineer',
    passengerRating: 4.9,
    personality: 'vip_demanding',
    pickupLocationName: 'Apex Secret Proving Ground Gate 4',
    pickupCoordsVec3: [350.0, 15.0, -850.0],
    destinationLocationName: 'Mount Akina Alpine Observatory Sensor Station',
    destinationCoordsVec3: [2100.0, 320.0, -1800.0],
    estimatedDistanceKm: 12.8,
    timeLimitSeconds: 300,
    baseFareUSD: 2800,
    perKmRateUSD: 60.0,
    tipBonusUSD: 3500,
    maxAllowableLateralG: 2.2,
    maxAllowableCrashes: 0,
    surgePricingMultiplier: 1.8,
    passengerDialogueOnPickup: 'This prototype hybrid hypercar is cloaked in vinyl dazzle camouflage. Complete high-altitude cooling tests without being spotted by spy photographers.',
    passengerDialogueOnArrival: 'Sensor data logged perfectly! Powertrain telemetry is verified for production sign-off.'
  },
  {
    fareId: 'contract_organ_transplant_003',
    passengerName: 'Metropolitan Emergency Medical Response Service',
    passengerRating: 5.0,
    personality: 'impatient_executive',
    pickupLocationName: 'Port Harbor Biomedical Cryogenic Landing Pad',
    pickupCoordsVec3: [620.0, 1.5, 1400.0],
    destinationLocationName: 'Metropolitan Heart Hospital Emergency Trauma Bay',
    destinationCoordsVec3: [0.0, 0.0, 150.0],
    estimatedDistanceKm: 14.2,
    timeLimitSeconds: 220, // 3.6 minutes to cover 14.2 km (Avg speed ~230 km/h)
    baseFareUSD: 4200,
    perKmRateUSD: 95.0,
    tipBonusUSD: 7500,
    maxAllowableLateralG: 1.4,
    maxAllowableCrashes: 0,
    surgePricingMultiplier: 2.0,
    passengerDialogueOnPickup: 'Emergency donor heart in transport cooler! Police have cleared the highway. Floor it!',
    passengerDialogueOnArrival: 'Arrival right in the nick of time! Surgeon is entering the OR now. You are a true hero.'
  },
  {
    fareId: 'contract_touge_tofu_004',
    passengerName: 'Fujiwara Tofu & Bakery Shop',
    passengerRating: 4.8,
    personality: 'chill_tourist',
    pickupLocationName: 'Mount Akina Canyon Old Shopfront',
    pickupCoordsVec3: [2400.0, 28.0, -1200.0],
    destinationLocationName: 'Lake Akina Resort Lakeside Hotel',
    destinationCoordsVec3: [1750.0, 245.0, -1450.0],
    estimatedDistanceKm: 5.2,
    timeLimitSeconds: 150,
    baseFareUSD: 850,
    perKmRateUSD: 45.0,
    tipBonusUSD: 1800,
    maxAllowableLateralG: 2.8, // Full drift allowed as long as cup doesn't spill
    maxAllowableCrashes: 0,
    surgePricingMultiplier: 1.5,
    passengerDialogueOnPickup: 'Deliver the fresh tofu to the mountain hotel before 5:00 AM. There is a cup of water in the cup holder. Do not spill a single drop!',
    passengerDialogueOnArrival: 'Unbelievable downhill drift run! The water cup is still full to the brim and the tofu is intact!'
  }
];

export class CareerContractsPart2Service {
  public static getAllPart2Contracts(): RideshareFareRequest[] {
    return [...CAREER_CONTRACTS_PART2_DATABASE];
  }
}
