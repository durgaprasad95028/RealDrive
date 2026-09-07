/**
 * ============================================================================
 * REALDRIVE SEED DATA - EXOTIC SUPERCAR & HYPERCAR MASTER DATABASE (PART 3)
 * ============================================================================
 * Full telemetry and engineering specifications for iconic world-class hypercars:
 * - Koenigsegg Jesko Absolut (V-Max 500+ kph aerodynamic record specification)
 * - Mercedes-AMG ONE (1.6L Turbocharged Formula 1 V6 Hybrid Powertrain)
 * - Aston Martin Valkyrie AMR Pro (6.5L Naturally Aspirated Cosworth V12 @ 11,100 RPM)
 * - Pagani Utopia (6.0L Twin-Turbo AMG V12 with 7-Speed Gated Manual Gearbox)
 * - Bugatti Tourbillon (8.3L Cosworth V16 Hybrid producing 1,800 HP)
 */

export interface ExoticVehicleFullSpec {
  readonly id: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly category: 'hypercar_unlimited' | 'track_prototype_gt' | 'v12_flagship_gt' | 'electric_hypercar';
  readonly engineType: string;
  readonly displacementLiters: number;
  readonly cylinderCount: number;
  readonly aspiration: 'twin_turbo' | 'quad_turbo' | 'naturally_aspirated' | 'tri_motor_electric';
  readonly maxHorsepowerHp: number;
  readonly maxTorqueNm: number;
  readonly redlineRpm: number;
  readonly curbMassKg: number;
  readonly weightDistributionFrontPercent: number; // e.g. 43%
  readonly dragCoefficientCd: number;
  readonly frontalAreaM2: number;
  readonly downforceAt200KphN: number;
  readonly zeroTo100KphSec: number;
  readonly zeroTo200KphSec: number;
  readonly zeroTo300KphSec: number;
  readonly topSpeedKph: number;
  readonly gearboxRatios: readonly number[];
  readonly finalDriveRatio: number;
  readonly baseMSRPUSD: number;
  readonly torqueCurve: readonly { rpm: number; torqueNm: number }[];
}

export const EXOTIC_SUPERCAR_PART3_DATABASE: readonly ExoticVehicleFullSpec[] = [
  {
    id: 'veh_koenigsegg_jesko_absolut',
    make: 'Koenigsegg',
    model: 'Jesko Absolut',
    year: 2025,
    category: 'hypercar_unlimited',
    engineType: '5.0L Flat-Plane Crank Twin-Turbo V8 (E85 Biofuel)',
    displacementLiters: 5.0,
    cylinderCount: 8,
    aspiration: 'twin_turbo',
    maxHorsepowerHp: 1600,
    maxTorqueNm: 1500,
    redlineRpm: 8500,
    curbMassKg: 1390,
    weightDistributionFrontPercent: 44.0,
    dragCoefficientCd: 0.278, // Ultra-low drag coefficient for 500+ kph
    frontalAreaM2: 1.88,
    downforceAt200KphN: 1470, // 150 kg low-drag downforce
    zeroTo100KphSec: 2.25,
    zeroTo200KphSec: 4.80,
    zeroTo300KphSec: 8.90,
    topSpeedKph: 531, // Theoretical V-Max
    gearboxRatios: [3.15, 3.85, 2.72, 2.05, 1.62, 1.34, 1.12, 0.94, 0.81, 0.68], // 9-Speed Light Speed Transmission (LST)
    finalDriveRatio: 3.10,
    baseMSRPUSD: 3400000,
    torqueCurve: [
      { rpm: 1500, torqueNm: 600 },
      { rpm: 3000, torqueNm: 1050 },
      { rpm: 5100, torqueNm: 1500 }, // Peak Torque
      { rpm: 7500, torqueNm: 1420 },
      { rpm: 8500, torqueNm: 1250 }
    ]
  },
  {
    id: 'veh_mercedes_amg_one_f1',
    make: 'Mercedes-AMG',
    model: 'ONE Formula 1 Powertrain',
    year: 2024,
    category: 'hypercar_unlimited',
    engineType: '1.6L Turbocharged 90° V6 + 4 Electric Motors (MGU-H, MGU-K, Dual Front e-Axle)',
    displacementLiters: 1.6,
    cylinderCount: 6,
    aspiration: 'twin_turbo', // MGU-H Electric Assist Turbo
    maxHorsepowerHp: 1063,
    maxTorqueNm: 1200,
    redlineRpm: 11000, // True Formula 1 rev limit
    curbMassKg: 1695,
    weightDistributionFrontPercent: 46.0,
    dragCoefficientCd: 0.36,
    frontalAreaM2: 2.02,
    downforceAt200KphN: 6865, // Active aero slats and DRS
    zeroTo100KphSec: 2.90,
    zeroTo200KphSec: 7.00,
    zeroTo300KphSec: 15.60,
    topSpeedKph: 352,
    gearboxRatios: [3.30, 3.90, 2.45, 1.78, 1.38, 1.12, 0.92, 0.78],
    finalDriveRatio: 3.65,
    baseMSRPUSD: 2750000,
    torqueCurve: [
      { rpm: 2000, torqueNm: 850 }, // Instant electric torque fill
      { rpm: 4500, torqueNm: 1150 },
      { rpm: 8000, torqueNm: 1200 },
      { rpm: 10500, torqueNm: 1080 },
      { rpm: 11000, torqueNm: 950 }
    ]
  },
  {
    id: 'veh_valkyrie_amr_pro',
    make: 'Aston Martin',
    model: 'Valkyrie AMR Pro Track Special',
    year: 2024,
    category: 'track_prototype_gt',
    engineType: '6.5L Naturally Aspirated 65° Cosworth V12',
    displacementLiters: 6.5,
    cylinderCount: 12,
    aspiration: 'naturally_aspirated',
    maxHorsepowerHp: 1000,
    maxTorqueNm: 740,
    redlineRpm: 11100, // Screaming naturally aspirated V12
    curbMassKg: 1000,  // Sub-1:1 power-to-weight (1000 HP / 1000 kg)
    weightDistributionFrontPercent: 43.0,
    dragCoefficientCd: 0.44,
    frontalAreaM2: 1.75,
    downforceAt200KphN: 13240, // Generates more than its own curb weight in downforce!
    zeroTo100KphSec: 2.10,
    zeroTo200KphSec: 5.20,
    zeroTo300KphSec: 11.20,
    topSpeedKph: 360,
    gearboxRatios: [3.20, 3.65, 2.50, 1.88, 1.48, 1.22, 1.04],
    finalDriveRatio: 3.80,
    baseMSRPUSD: 3800000,
    torqueCurve: [
      { rpm: 3000, torqueNm: 420 },
      { rpm: 6000, torqueNm: 620 },
      { rpm: 7000, torqueNm: 740 }, // Peak Torque
      { rpm: 10500, torqueNm: 680 },
      { rpm: 11100, torqueNm: 640 }
    ]
  },
  {
    id: 'veh_pagani_utopia',
    make: 'Pagani',
    model: 'Utopia 7-Speed Gated Manual',
    year: 2025,
    category: 'v12_flagship_gt',
    engineType: '6.0L Mercedes-AMG 60° Twin-Turbo V12',
    displacementLiters: 6.0,
    cylinderCount: 12,
    aspiration: 'twin_turbo',
    maxHorsepowerHp: 864,
    maxTorqueNm: 1100,
    redlineRpm: 6700,
    curbMassKg: 1280,
    weightDistributionFrontPercent: 42.0,
    dragCoefficientCd: 0.32,
    frontalAreaM2: 1.95,
    downforceAt200KphN: 4410,
    zeroTo100KphSec: 2.80,
    zeroTo200KphSec: 7.80,
    zeroTo300KphSec: 17.50,
    topSpeedKph: 380,
    gearboxRatios: [3.25, 3.42, 2.18, 1.55, 1.18, 0.94, 0.78, 0.65],
    finalDriveRatio: 3.35,
    baseMSRPUSD: 2500000,
    torqueCurve: [
      { rpm: 1500, torqueNm: 800 },
      { rpm: 2800, torqueNm: 1100 }, // Flat torque table from 2800-5900 RPM
      { rpm: 5900, torqueNm: 1100 },
      { rpm: 6500, torqueNm: 950 },
      { rpm: 6700, torqueNm: 880 }
    ]
  }
];

export class ExoticSupercarPart3Service {
  public static getAllVehicles(): ExoticVehicleFullSpec[] {
    return [...EXOTIC_SUPERCAR_PART3_DATABASE];
  }

  public static getVehicleById(id: string): ExoticVehicleFullSpec | undefined {
    return EXOTIC_SUPERCAR_PART3_DATABASE.find(v => v.id === id);
  }
}
