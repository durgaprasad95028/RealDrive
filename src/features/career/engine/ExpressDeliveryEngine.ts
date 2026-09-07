/**
 * ExpressDeliveryEngine — Hot Food, Medical Code-3 Courier & Multi-Drop Parcel Routing
 */

export type DeliveryMissionType = 'HOT_FOOD_GOURMET' | 'EMERGENCY_MEDICAL_CODE3' | 'MULTIDROP_ECOMMERCE_PARCEL';

export interface DeliveryPackage {
  id: string;
  recipientName: string;
  address: string;
  district: string;
  weightKg: number;
  isDelivered: boolean;
  timeWindowSec: number;
}

export interface ExpressDeliveryMission {
  id: string;
  title: string;
  missionType: DeliveryMissionType;
  pickupDistrict: string;
  pickupLocation: string;
  packages: DeliveryPackage[];
  totalDistanceKm: number;
  totalTimeLimitSec: number;
  baseRewardCredits: number;
  perDropBonusCredits: number;
  temperatureRequiredC?: number; // e.g. 75 C for pizza, -20 C for dry ice organs
  allowedSpillDegradation?: number;
  isEmergencySirenPermitted: boolean;
}

export interface ActiveDeliveryRun {
  mission: ExpressDeliveryMission;
  currentPackageIndex: number;
  elapsedSeconds: number;
  remainingTimeSeconds: number;
  currentTemperatureC?: number;
  packageBoxTiltDamage: number; // accumulates if vehicle rolls or pulls extreme lateral G
  deliveredCount: number;
  isFailed: boolean;
  isCompleted: boolean;
}

export class ExpressDeliveryEngine {
  /**
   * Generates active express delivery missions
   */
  public static generateAvailableMissions(): ExpressDeliveryMission[] {
    return [
      {
        id: 'deliv_pizza_rush_downtown',
        title: 'Artisan Wood-Fired Pizza Express Rush',
        missionType: 'HOT_FOOD_GOURMET',
        pickupDistrict: 'Downtown',
        pickupLocation: 'Luigi’s Brick-Oven Pizzeria (4th Ave)',
        packages: [
          {
            id: 'pkg_pz_1',
            recipientName: 'Dr. Kenneth Reed',
            address: 'Horizon High-Rise Penthouse #44',
            district: 'Downtown',
            weightKg: 2.2,
            isDelivered: false,
            timeWindowSec: 240,
          },
          {
            id: 'pkg_pz_2',
            recipientName: 'Sarah Jenkins',
            address: 'Apex Tech Incubator Suite 12B',
            district: 'Downtown',
            weightKg: 3.5,
            isDelivered: false,
            timeWindowSec: 420,
          },
        ],
        totalDistanceKm: 6.8,
        totalTimeLimitSec: 420,
        baseRewardCredits: 650,
        perDropBonusCredits: 200,
        temperatureRequiredC: 75,
        allowedSpillDegradation: 15,
        isEmergencySirenPermitted: false,
      },
      {
        id: 'deliv_medical_transplant_urgent',
        title: 'CODE 3: Emergency Heart Transplant Transport',
        missionType: 'EMERGENCY_MEDICAL_CODE3',
        pickupDistrict: 'Airport',
        pickupLocation: 'Medevac Air Ambulance Hangar 3',
        packages: [
          {
            id: 'pkg_med_heart',
            recipientName: 'Metro General Surgical Team A',
            address: 'University Hospital Surgical Trauma Bay',
            district: 'Downtown',
            weightKg: 8.0,
            isDelivered: false,
            timeWindowSec: 300, // 5 minutes flat
          },
        ],
        totalDistanceKm: 14.2,
        totalTimeLimitSec: 300,
        baseRewardCredits: 4500,
        perDropBonusCredits: 1000,
        temperatureRequiredC: 4, // 4 C cooler
        allowedSpillDegradation: 5,
        isEmergencySirenPermitted: true,
      },
      {
        id: 'deliv_ecommerce_parcels_suburbs',
        title: 'Prime Express Multi-Drop Residential Route',
        missionType: 'MULTIDROP_ECOMMERCE_PARCEL',
        pickupDistrict: 'Industrial',
        pickupLocation: 'Global Logistics Sorting Fulfillment Center',
        packages: [
          {
            id: 'pkg_ec_1',
            recipientName: 'Marcus Vance',
            address: '142 Pinecrest Valley Road',
            district: 'Suburbs',
            weightKg: 4.0,
            isDelivered: false,
            timeWindowSec: 360,
          },
          {
            id: 'pkg_ec_2',
            recipientName: 'Emily Clark',
            address: '88 Oakridge Meadow Way',
            district: 'Suburbs',
            weightKg: 1.5,
            isDelivered: false,
            timeWindowSec: 540,
          },
          {
            id: 'pkg_ec_3',
            recipientName: 'Robert Gomez',
            address: '210 Sunridge Hills Court',
            district: 'Suburbs',
            weightKg: 6.2,
            isDelivered: false,
            timeWindowSec: 720,
          },
        ],
        totalDistanceKm: 18.5,
        totalTimeLimitSec: 720,
        baseRewardCredits: 2200,
        perDropBonusCredits: 450,
        isEmergencySirenPermitted: false,
      },
    ];
  }

  /**
   * Evaluates drop completion
   */
  public static processPackageDrop(run: ActiveDeliveryRun): {
    isMissionFinished: boolean;
    rewardEarned: number;
    tipBonus: number;
  } {
    const pkg = run.mission.packages[run.currentPackageIndex];
    pkg.isDelivered = true;
    run.deliveredCount++;

    let tip = 0;
    if (run.remainingTimeSeconds > 60) {
      tip += 150; // fast delivery bonus
    }
    if (run.packageBoxTiltDamage < 5) {
      tip += 100; // perfect care bonus
    }

    const reward = run.mission.perDropBonusCredits;
    run.currentPackageIndex++;

    const isMissionFinished = run.currentPackageIndex >= run.mission.packages.length;
    if (isMissionFinished) {
      run.isCompleted = true;
    }

    return {
      isMissionFinished,
      rewardEarned: reward + (isMissionFinished ? run.mission.baseRewardCredits : 0),
      tipBonus: tip,
    };
  }
}
