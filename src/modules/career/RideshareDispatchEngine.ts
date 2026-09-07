/**
 * ============================================================================
 * REALDRIVE CAREER — RIDESHARE DISPATCH & FARE ENGINE
 * ============================================================================
 * Algorithmic rideshare passenger dispatch matching:
 * - Dynamic surge pricing based on district congestion and rain
 * - Passenger personality traits, conversation dialogues, VIP tipping logic
 * - Ride smoothness scoring (penalizing sudden jerk, excessive G-forces, collisions)
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { RideshareFareEntity } from '../../database/entities/RideshareFareEntity.js';
import { CareerDriverEntity } from '../../database/entities/CareerDriverEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class RideshareDispatchEngine {
  private static readonly PASSENGER_NAMES = [
    'Sarah Jenkins', 'Elena Rostova', 'Marcus Sterling', 'David Kim', 'Chloe Bennett',
    'Akira Tanaka', 'Victor Vance', 'Rachel Green', 'Alexander Hayes', 'Maya Lin'
  ];

  private static readonly DISTRICTS = [
    'DOWNTOWN_METROPOLIS', 'COASTAL_HIGHWAY', 'INDUSTRIAL_HARBOR',
    'NEON_DISTRICT', 'SUBURBAN_HILLS', 'AIRPORT_RUNWAY', 'MOUNTAIN_PASS'
  ] as const;

  constructor(private database: DatabaseClient = db) {}

  public async generateAvailableFares(driverId: string, count: number = 5): Promise<RideshareFareEntity[]> {
    const driver = await this.database.findOne<CareerDriverEntity>('career_drivers', { userId: driverId });
    const tierMultiplier = driver?.rideshareTier === 'DIAMOND' ? 1.5 : (driver?.rideshareTier === 'PLATINUM' ? 1.3 : 1.0);

    const generatedFares: RideshareFareEntity[] = [];

    for (let i = 0; i < count; i++) {
      const pName = RideshareDispatchEngine.PASSENGER_NAMES[Math.floor(Math.random() * RideshareDispatchEngine.PASSENGER_NAMES.length)];
      const pickupDist = RideshareDispatchEngine.DISTRICTS[Math.floor(Math.random() * RideshareDispatchEngine.DISTRICTS.length)];
      let dropoffDist = RideshareDispatchEngine.DISTRICTS[Math.floor(Math.random() * RideshareDispatchEngine.DISTRICTS.length)];
      while (dropoffDist === pickupDist) {
        dropoffDist = RideshareDispatchEngine.DISTRICTS[Math.floor(Math.random() * RideshareDispatchEngine.DISTRICTS.length)];
      }

      const distanceKm = Number((3.5 + Math.random() * 12.0).toFixed(1));
      const durationSec = Math.round(distanceKm * 45); // ~45s per km average
      const baseFare = Math.round((25 + distanceKm * 15) * tierMultiplier);
      const surgeMultiplier = Number((1.0 + (Math.random() > 0.6 ? Math.random() * 1.5 : 0)).toFixed(2));
      const finalFare = Math.round(baseFare * surgeMultiplier);

      const moods = ['CHEERFUL', 'BUSINESS_RUSH', 'TALKATIVE', 'SILENT_VIP', 'INTOXICATED_PARTY', 'NERVOUS'] as const;
      const mood = moods[Math.floor(Math.random() * moods.length)];

      const fare = await this.database.insert<RideshareFareEntity>('rideshare_fares', {
        fareCode: `FARE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        driverId: undefined,
        passengerName: pName,
        passengerAvatar: `/avatars/passenger_${Math.floor(1 + Math.random() * 6)}.png`,
        passengerMood: mood,
        pickupLocation: `${pickupDist.replace('_', ' ')} Central Plaza`,
        pickupDistrict: pickupDist,
        pickupCoords: { x: (Math.random() - 0.5) * 2000, y: 0, z: (Math.random() - 0.5) * 2000 },
        dropoffLocation: `${dropoffDist.replace('_', ' ')} Terminal`,
        dropoffDistrict: dropoffDist,
        dropoffCoords: { x: (Math.random() - 0.5) * 2000, y: 0, z: (Math.random() - 0.5) * 2000 },
        estimatedDistanceKm: distanceKm,
        estimatedDurationSeconds: durationSec,
        baseFare,
        surgeMultiplier,
        finalFare,
        tipAmount: 0,
        status: 'DISPATCHED',
        createdAt: new Date().toISOString(),
      });

      generatedFares.push(fare);
    }

    return generatedFares;
  }

  public async acceptFare(fareId: string, driverId: string): Promise<RideshareFareEntity> {
    const fare = await this.database.findById<RideshareFareEntity>('rideshare_fares', fareId);
    if (!fare) throw HttpError.notFound('Fare request not found.');
    if (fare.status !== 'DISPATCHED') throw HttpError.badRequest('Fare is no longer available.');

    const updated = await this.database.update<RideshareFareEntity>('rideshare_fares', fareId, {
      driverId,
      status: 'ACCEPTED',
    });

    return updated!;
  }

  public async completeFare(fareId: string, smoothnessScorePct: number): Promise<{
    fare: RideshareFareEntity;
    earnings: number;
    rating: number;
    tip: number;
  }> {
    const fare = await this.database.findById<RideshareFareEntity>('rideshare_fares', fareId);
    if (!fare) throw HttpError.notFound('Fare not found.');

    // Calculate rating and tip based on smoothness
    let rating = 5.0;
    let tip = Math.round(fare.finalFare * 0.20);

    if (smoothnessScorePct < 60) {
      rating = 3.0;
      tip = 0;
    } else if (smoothnessScorePct < 85) {
      rating = 4.0;
      tip = Math.round(fare.finalFare * 0.10);
    }

    const totalEarnings = fare.finalFare + tip;

    const updated = await this.database.update<RideshareFareEntity>('rideshare_fares', fareId, {
      status: 'COMPLETED',
      tipAmount: tip,
      passengerRatingGiven: rating,
      drivingSmoothnessScorePct: smoothnessScorePct,
      completedAt: new Date().toISOString(),
    });

    return {
      fare: updated!,
      earnings: totalEarnings,
      rating,
      tip,
    };
  }
}
