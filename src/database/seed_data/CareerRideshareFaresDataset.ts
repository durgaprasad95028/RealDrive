/**
 * ============================================================================
 * REALDRIVE SEED DATA - CAREER RIDESHARE FARES & PASSENGER DISPATCH MATRIX
 * ============================================================================
 * Dynamic urban taxi & rideshare passenger dispatch missions:
 * - VIP Celebrity & Executive Chauffeur Escorts
 * - Midnight Downtown Nightclub Bar Pickups (Motion Sickness Sensitivity)
 * - Emergency Rush-Hour Airport Express Runs (Strict Time Limits)
 * - Tourist Scenic Landmark Tours (Smooth Driving & Sightseeing Rewards)
 * - Underworld Getaway Fugitive Pickups (Evade Police Radar & Interceptors)
 */

export type PassengerPersonality = 
  | 'vip_demanding'
  | 'impatient_executive'
  | 'chill_tourist'
  | 'motion_sick_fragile'
  | 'thrill_seeker_speed_fan'
  | 'underground_fugitive';

export interface RideshareFareRequest {
  readonly fareId: string;
  readonly passengerName: string;
  readonly passengerRating: number; // 1.0 to 5.0 stars
  readonly personality: PassengerPersonality;
  readonly pickupLocationName: string;
  readonly pickupCoordsVec3: [number, number, number];
  readonly destinationLocationName: string;
  readonly destinationCoordsVec3: [number, number, number];
  readonly estimatedDistanceKm: number;
  readonly timeLimitSeconds: number;
  readonly baseFareUSD: number;
  readonly perKmRateUSD: number;
  readonly tipBonusUSD: number;
  readonly maxAllowableLateralG: number; // Exceeding this upsets passenger
  readonly maxAllowableCrashes: number;
  readonly surgePricingMultiplier: number;
  readonly passengerDialogueOnPickup: string;
  readonly passengerDialogueOnArrival: string;
}

export const RIDESHARE_FARES_DATABASE: readonly RideshareFareRequest[] = [
  {
    fareId: 'fare_vip_exec_001',
    passengerName: 'Julian Sterling (Hedge Fund Managing Director)',
    passengerRating: 4.9,
    personality: 'impatient_executive',
    pickupLocationName: 'Downtown Financial Plaza Tower 1',
    pickupCoordsVec3: [45.0, 0.0, 220.0],
    destinationLocationName: 'Oceanfront Pacific Private Helipad',
    destinationCoordsVec3: [1800.0, 14.0, -420.0],
    estimatedDistanceKm: 6.8,
    timeLimitSeconds: 240, // 4 minutes to sprint across town
    baseFareUSD: 85,
    perKmRateUSD: 14.5,
    tipBonusUSD: 150,
    maxAllowableLateralG: 0.95,
    maxAllowableCrashes: 0,
    surgePricingMultiplier: 1.8,
    passengerDialogueOnPickup: 'I have a private chopper departing in 4 minutes. Get me there fast and do not get stuck in traffic!',
    passengerDialogueOnArrival: 'Incredible driving! You just saved a twenty-million-dollar merger. Keep the change!'
  },
  {
    fareId: 'fare_nightclub_002',
    passengerName: 'Chloe & Dave (Club Revelers)',
    passengerRating: 4.4,
    personality: 'motion_sick_fragile',
    pickupLocationName: 'Neon Strip Cyberclub Apex',
    pickupCoordsVec3: [950.0, 8.0, 620.0],
    destinationLocationName: 'Green Hills Suburbia Villa 42',
    destinationCoordsVec3: [-1100.0, 6.0, -350.0],
    estimatedDistanceKm: 8.5,
    timeLimitSeconds: 480,
    baseFareUSD: 45,
    perKmRateUSD: 8.0,
    tipBonusUSD: 60,
    maxAllowableLateralG: 0.35, // Strict comfort limit to prevent car sickness
    maxAllowableCrashes: 0,
    surgePricingMultiplier: 2.2, // 2am surge
    passengerDialogueOnPickup: 'Please take it easy on the turns... Dave is feeling really nauseous after the club.',
    passengerDialogueOnArrival: 'Thank you so much for the smooth ride. You are a lifesaver.'
  },
  {
    fareId: 'fare_speed_demon_003',
    passengerName: 'Rex "Redline" Tanner',
    passengerRating: 5.0,
    personality: 'thrill_seeker_speed_fan',
    pickupLocationName: 'Mount Akina Touge Basecamp',
    pickupCoordsVec3: [2400.0, 28.0, -1200.0],
    destinationLocationName: 'Mount Akina Canyon Summit Lookout',
    destinationCoordsVec3: [1750.0, 245.0, -1450.0],
    estimatedDistanceKm: 5.2,
    timeLimitSeconds: 180,
    baseFareUSD: 120,
    perKmRateUSD: 20.0,
    tipBonusUSD: 250,
    maxAllowableLateralG: 2.50, // Wants high G drift action!
    maxAllowableCrashes: 1,
    surgePricingMultiplier: 1.5,
    passengerDialogueOnPickup: 'Show me what this car can really do! Drift every hairpin all the way up the mountain!',
    passengerDialogueOnArrival: 'YOOO! That was the wildest downhill drift run I have ever experienced! Take this fat tip!'
  },
  {
    fareId: 'fare_tourist_004',
    passengerName: 'Emma & Lars (Travel Bloggers)',
    passengerRating: 4.8,
    personality: 'chill_tourist',
    pickupLocationName: 'Oceanfront Sunset Pier',
    pickupCoordsVec3: [1450.0, 5.0, -120.0],
    destinationLocationName: 'Downtown Metropolitan Observation Deck',
    destinationCoordsVec3: [0.0, 0.0, 50.0],
    estimatedDistanceKm: 7.2,
    timeLimitSeconds: 420,
    baseFareUSD: 50,
    perKmRateUSD: 9.5,
    tipBonusUSD: 75,
    maxAllowableLateralG: 0.50,
    maxAllowableCrashes: 0,
    surgePricingMultiplier: 1.0,
    passengerDialogueOnPickup: 'Hi! We would love a nice scenic drive along the coast back towards the city center.',
    passengerDialogueOnArrival: 'Such a gorgeous view of the skyline. 5 stars on your profile!'
  },
  {
    fareId: 'fare_getaway_005',
    passengerName: 'Unknown Caller [Masked]',
    passengerRating: 3.2,
    personality: 'underground_fugitive',
    pickupLocationName: 'Industrial Harbor Dark Storage Alley',
    pickupCoordsVec3: [620.0, 1.5, 1400.0],
    destinationLocationName: 'Red Rock Desert Abandoned Airstrip',
    destinationCoordsVec3: [-1600.0, 5.0, -950.0],
    estimatedDistanceKm: 14.8,
    timeLimitSeconds: 360,
    baseFareUSD: 450,
    perKmRateUSD: 35.0,
    tipBonusUSD: 1000, // Massive illegal bounty
    maxAllowableLateralG: 2.0,
    maxAllowableCrashes: 2,
    surgePricingMultiplier: 3.0,
    passengerDialogueOnPickup: 'Step on it NOW! Cops are three blocks behind us. Lose the heat and head out into the desert!',
    passengerDialogueOnArrival: 'Clean escape. Here is a thousand in cash. You never saw me.'
  }
];

export class CareerRideshareDispatchService {
  public static getAvailableFares(): RideshareFareRequest[] {
    return [...RIDESHARE_FARES_DATABASE];
  }

  public static calculateFarePayout(fare: RideshareFareRequest, timeTakenSec: number, maxLateralGRecorded: number, crashesCount: number): {
    totalPayoutUSD: number;
    ratingAwarded: number;
    tipReceivedUSD: number;
    passengerMessage: string;
  } {
    let basePay = (fare.baseFareUSD + (fare.estimatedDistanceKm * fare.perKmRateUSD)) * fare.surgePricingMultiplier;
    let tip = fare.tipBonusUSD;
    let rating = fare.passengerRating;

    // Time penalty
    if (timeTakenSec > fare.timeLimitSeconds) {
      tip *= 0.5;
      rating -= 1.0;
    }

    // Comfort penalty
    if (maxLateralGRecorded > fare.maxAllowableLateralG && fare.personality === 'motion_sick_fragile') {
      tip = 0;
      rating = 2.0;
      return {
        totalPayoutUSD: Math.round(basePay),
        ratingAwarded: rating,
        tipReceivedUSD: 0,
        passengerMessage: 'I felt sick the whole ride! Terrible driving.'
      };
    }

    // Crash penalty
    if (crashesCount > fare.maxAllowableCrashes) {
      tip = 0;
      rating = 1.0;
      return {
        totalPayoutUSD: Math.round(basePay * 0.5),
        ratingAwarded: rating,
        tipReceivedUSD: 0,
        passengerMessage: 'You crashed the car! I am filing a complaint with dispatch.'
      };
    }

    const total = Math.round(basePay + tip);
    return {
      totalPayoutUSD: total,
      ratingAwarded: Math.min(5.0, rating),
      tipReceivedUSD: Math.round(tip),
      passengerMessage: fare.passengerDialogueOnArrival
    };
  }
}
