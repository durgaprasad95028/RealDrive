/**
 * RideshareCareerEngine — Passenger Dispatch, Fare Algorithms, Surge Pricing & Rating Simulator
 */

export type RideshareServiceTier =
  | 'REAL_STANDARD'
  | 'REAL_COMFORT'
  | 'REAL_BLACK_EXECUTIVE'
  | 'REAL_SUV_LUXURY'
  | 'REAL_GREEN_EV';

export type PassengerMood = 'CHEERFUL' | 'BUSINESS_HURRIED' | 'TOURIST_RELAXED' | 'DEMANDING_VIP' | 'ANXIOUS';

export interface RidesharePassenger {
  id: string;
  name: string;
  avatarIcon: string;
  mood: PassengerMood;
  rating: number; // 4.2 to 5.0
  serviceTier: RideshareServiceTier;
  pickupDistrict: string;
  pickupLocationName: string;
  dropoffDistrict: string;
  dropoffLocationName: string;
  distanceKm: number;
  estimatedMinutes: number;
  baseFareCredits: number;
  surgeMultiplier: number;
  expectedTipPercent: number;
  specialRequests: string[];
  conversationTopics: string[];
}

export interface ActiveRideshareTrip {
  tripId: string;
  passenger: RidesharePassenger;
  startTime: number;
  elapsedSeconds: number;
  distanceCoveredKm: number;
  comfortScore: number; // 0 to 100
  hardBrakingEvents: number;
  highSpeedTurns: number;
  collisions: number;
  speedingIncidents: number;
  isCompleted: boolean;
  finalFareCredits: number;
  tipEarnedCredits: number;
  passengerReview: string;
  passengerRatingGiven: number;
}

export interface DriverRideshareProfile {
  driverRating: number; // 1.0 to 5.0
  totalTripsCompleted: number;
  totalEarningsCredits: number;
  acceptanceRatePercent: number;
  cancellationRatePercent: number;
  tierLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  serviceTiersUnlocked: RideshareServiceTier[];
}

export class RideshareCareerEngine {
  private static passengerNames: string[] = [
    'Alexander Hayes',
    'Elena Rostova',
    'Marcus Vance',
    'Sophia Chen',
    'Julian Thorne',
    'Chloe Dubois',
    'David Sterling',
    'Amara Okafor',
    'Liam O’Connor',
    'Natasha Volkov',
    'Vikram Patel',
    'Isabella Morales',
  ];

  /**
   * Generates a batch of procedural rideshare ride requests tailored to player's vehicle and location
   */
  public static generateAvailableRequests(
    currentDistrictName: string,
    driverTier: RideshareServiceTier = 'REAL_STANDARD',
    activeSurgeMultiplier: number = 1.0
  ): RidesharePassenger[] {
    const destinations = [
      { district: 'Downtown', name: 'Apex Financial Plaza' },
      { district: 'Downtown', name: 'The Grand Royale Luxury Hotel' },
      { district: 'Airport', name: 'International Terminal Departures' },
      { district: 'Airport', name: 'Private VIP Executive Jet FBO' },
      { district: 'Harbor', name: 'Pier 9 Marina & Yacht Club' },
      { district: 'Harbor', name: 'Container Logistics Gate 4' },
      { district: 'Suburbs', name: 'Pinecrest Country Club' },
      { district: 'Suburbs', name: 'Oakridge Residential Villas' },
      { district: 'Mountain Pass', name: 'Skyline Ridge Scenic Overlook' },
    ];

    const requests: RidesharePassenger[] = [];
    const count = 3 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const name = this.passengerNames[Math.floor(Math.random() * this.passengerNames.length)];
      const dest = destinations[Math.floor(Math.random() * destinations.length)];

      const dist = Math.round((2.5 + Math.random() * 12.0) * 10) / 10;
      const estMin = Math.round((dist / 45) * 60 + 3);

      // Base fare: $4.50 base + $1.80/km + $0.40/min
      let baseRatePerKm = 1.8;
      let basePickupFee = 4.5;

      if (driverTier === 'REAL_COMFORT') {
        baseRatePerKm = 2.4;
        basePickupFee = 7.0;
      } else if (driverTier === 'REAL_BLACK_EXECUTIVE') {
        baseRatePerKm = 4.5;
        basePickupFee = 15.0;
      } else if (driverTier === 'REAL_SUV_LUXURY') {
        baseRatePerKm = 5.2;
        basePickupFee = 18.0;
      }

      const rawFare = basePickupFee + dist * baseRatePerKm + estMin * 0.45;
      const finalBase = Math.round(rawFare * activeSurgeMultiplier);

      const moods: PassengerMood[] = ['CHEERFUL', 'BUSINESS_HURRIED', 'TOURIST_RELAXED', 'DEMANDING_VIP', 'ANXIOUS'];
      const pickedMood = moods[Math.floor(Math.random() * moods.length)];

      requests.push({
        id: `ride_${Date.now()}_${i}`,
        name,
        avatarIcon: '👤',
        mood: pickedMood,
        rating: Math.round((4.4 + Math.random() * 0.6) * 10) / 10,
        serviceTier: driverTier,
        pickupDistrict: currentDistrictName,
        pickupLocationName: `${currentDistrictName} Central Way`,
        dropoffDistrict: dest.district,
        dropoffLocationName: dest.name,
        distanceKm: dist,
        estimatedMinutes: estMin,
        baseFareCredits: finalBase,
        surgeMultiplier: activeSurgeMultiplier,
        expectedTipPercent: pickedMood === 'DEMANDING_VIP' ? 25 : pickedMood === 'CHEERFUL' ? 18 : 10,
        specialRequests:
          pickedMood === 'DEMANDING_VIP'
            ? ['Prefers quiet cabin', 'Smooth cornering essential']
            : pickedMood === 'TOURIST_RELAXED'
            ? ['Enjoys city sightseeing commentary', 'Gentle pace']
            : ['Fastest direct route'],
        conversationTopics: [
          'Downtown skyscraper architecture',
          'Current city weather forecast',
          'Automotive engineering and car culture',
        ],
      });
    }

    return requests;
  }

  /**
   * Evaluates final trip score, tips, passenger review comment, and rating
   */
  public static completeTrip(trip: ActiveRideshareTrip): {
    totalCreditsEarned: number;
    ratingAwarded: number;
    reviewComment: string;
    xpEarned: number;
  } {
    let score = 100;
    score -= trip.hardBrakingEvents * 6;
    score -= trip.highSpeedTurns * 5;
    score -= trip.collisions * 35;
    score -= trip.speedingIncidents * 8;
    score = Math.max(0, Math.min(100, score));

    let rating = 5.0;
    let comment = 'Exceptional driver! Smooth ride, great car, and on time.';

    if (score < 40) {
      rating = 1.0 + Math.random() * 1.5;
      comment = 'Terrifying driving! Hard braking, erratic lane changes, and felt completely unsafe.';
    } else if (score < 70) {
      rating = 3.0 + Math.random() * 0.8;
      comment = 'Got to the destination okay, but the ride was fairly bumpy and rushed.';
    } else if (score < 88) {
      rating = 4.2 + Math.random() * 0.6;
      comment = 'Good, reliable ride. Would ride with this driver again.';
    }

    rating = Math.round(rating * 10) / 10;

    // Tip calculation based on satisfaction
    let tipCredits = 0;
    if (score >= 75) {
      const tipPct = (trip.passenger.expectedTipPercent * (score / 100)) / 100;
      tipCredits = Math.round(trip.passenger.baseFareCredits * tipPct);
    }

    const totalCredits = trip.passenger.baseFareCredits + tipCredits;
    const xp = Math.round(totalCredits * 0.85);

    return {
      totalCreditsEarned: totalCredits,
      ratingAwarded: rating,
      reviewComment: comment,
      xpEarned: xp,
    };
  }
}
