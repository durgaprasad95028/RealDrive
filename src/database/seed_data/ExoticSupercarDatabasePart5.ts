/**
 * ============================================================================
 * REALDRIVE SEED DATA - HYPER-EV & UNLIMITED PROTOTYPE DATABASE (PART 5)
 * ============================================================================
 * High-voltage electric and unlimited aerodynamic racing prototypes:
 * - Rimac Nevera Time Attack (1,914 HP Quad-Motor Torque Vectoring Hyper-EV)
 * - McMurtry Spéirling Pure (Twin-Fan Downforce Suction Ground-Effect Monster)
 * - Porsche 919 Hybrid Evo (Tribute Tour Le Mans LMP1 1,160 HP Record Car)
 * - Volkswagen ID.R (Pikes Peak & Goodwood Hillclimb Record Holder)
 * - Lotus Evija (2,000 HP All-Wheel Drive Electric Hypercar)
 */

export interface HyperEvPrototypeSpec {
  readonly id: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly powertrainClass: 'quad_motor_electric_bev' | 'dual_motor_fan_suction' | 'lmp1_hybrid_unlimited' | 'tri_motor_torque_vector';
  readonly totalSystemHorsepowerHp: number;
  readonly totalSystemTorqueNm: number;
  readonly batteryCapacityKwh: number;
  readonly architectureVoltageV: number;
  readonly maxRegenPowerKw: number;
  readonly curbMassKg: number;
  readonly weightDistributionFrontPercent: number;
  readonly downforceAt250KphN: number;
  readonly hasFanAssistedGroundEffect: boolean;
  readonly zeroTo100KphSec: number;
  readonly zeroTo200KphSec: number;
  readonly zeroTo300KphSec: number;
  readonly zeroTo400KphSec: number;
  readonly topSpeedKph: number;
  readonly dragCoefficientCd: number;
  readonly frontalAreaM2: number;
  readonly motorGearRatios: readonly number[];
  readonly baseMSRPUSD: number;
}

export const HYPER_EV_PROTOTYPES_DATABASE_PART5: readonly HyperEvPrototypeSpec[] = [
  // ==========================================================================
  // QUAD MOTOR ELECTRIC HYPERCARS
  // ==========================================================================
  {
    id: 'veh_rimac_nevera_time_attack',
    make: 'Rimac',
    model: 'Nevera Time Attack Edition',
    year: 2024,
    powertrainClass: 'quad_motor_electric_bev',
    totalSystemHorsepowerHp: 1914,
    totalSystemTorqueNm: 2360,
    batteryCapacityKwh: 120.0,
    architectureVoltageV: 800.0,
    maxRegenPowerKw: 400.0,
    curbMassKg: 2150, // Carbon monocoque battery-integrated chassis
    weightDistributionFrontPercent: 48.0,
    downforceAt250KphN: 5400,
    hasFanAssistedGroundEffect: false,
    zeroTo100KphSec: 1.74,
    zeroTo200KphSec: 4.42,
    zeroTo300KphSec: 9.22,
    zeroTo400KphSec: 21.31,
    topSpeedKph: 412,
    dragCoefficientCd: 0.30,
    frontalAreaM2: 2.12,
    motorGearRatios: [1.0, 7.85], // Front single-speed, Rear dual-speed
    baseMSRPUSD: 2900000
  },
  {
    id: 'veh_mcmurtry_speirling_pure',
    make: 'McMurtry',
    model: 'Spéirling Pure Fan Car',
    year: 2025,
    powertrainClass: 'dual_motor_fan_suction',
    totalSystemHorsepowerHp: 1000,
    totalSystemTorqueNm: 1250,
    batteryCapacityKwh: 60.0,
    architectureVoltageV: 800.0,
    maxRegenPowerKw: 250.0,
    curbMassKg: 990, // Sub-1,000 kg ultra-compact carbon single seater
    weightDistributionFrontPercent: 42.0,
    downforceAt250KphN: 22000, // 2,250 kg fan suction downforce on demand at ANY speed (even 0 km/h)!
    hasFanAssistedGroundEffect: true,
    zeroTo100KphSec: 1.40, // Instant 0-100 in 1.4s with 2G static grip
    zeroTo200KphSec: 3.50,
    zeroTo300KphSec: 8.50,
    zeroTo400KphSec: 99.0, // Geared for 300 kph sprint
    topSpeedKph: 305,
    dragCoefficientCd: 0.38,
    frontalAreaM2: 1.45,
    motorGearRatios: [1.0, 6.50],
    baseMSRPUSD: 1150000
  },
  {
    id: 'veh_porsche_919_hybrid_evo',
    make: 'Porsche',
    model: '919 Hybrid Evo (Tribute Tour)',
    year: 2018,
    powertrainClass: 'lmp1_hybrid_unlimited',
    totalSystemHorsepowerHp: 1160,
    totalSystemTorqueNm: 1350,
    batteryCapacityKwh: 16.5,
    architectureVoltageV: 800.0,
    maxRegenPowerKw: 500.0,
    curbMassKg: 849, // Removed headlights & WEC fuel flow restrictors
    weightDistributionFrontPercent: 45.0,
    downforceAt250KphN: 18500, // Active DRS rear wing + active front diffuser flaps
    hasFanAssistedGroundEffect: false,
    zeroTo100KphSec: 1.90,
    zeroTo200KphSec: 4.50,
    zeroTo300KphSec: 8.90,
    zeroTo400KphSec: 99.0,
    topSpeedKph: 369.4,
    dragCoefficientCd: 0.42,
    frontalAreaM2: 1.68,
    motorGearRatios: [1.0, 3.45, 2.30, 1.70, 1.35, 1.10, 0.92, 0.78],
    baseMSRPUSD: 8500000
  },
  {
    id: 'veh_volkswagen_id_r',
    make: 'Volkswagen',
    model: 'ID.R Electric Prototype',
    year: 2019,
    powertrainClass: 'quad_motor_electric_bev',
    totalSystemHorsepowerHp: 680,
    totalSystemTorqueNm: 650,
    batteryCapacityKwh: 45.0,
    architectureVoltageV: 800.0,
    maxRegenPowerKw: 280.0,
    curbMassKg: 1100,
    weightDistributionFrontPercent: 47.0,
    downforceAt250KphN: 12500, // Giant Pikes Peak hillclimb wing
    hasFanAssistedGroundEffect: false,
    zeroTo100KphSec: 2.15,
    zeroTo200KphSec: 5.10,
    zeroTo300KphSec: 12.50,
    zeroTo400KphSec: 99.0,
    topSpeedKph: 270,
    dragCoefficientCd: 0.46,
    frontalAreaM2: 1.82,
    motorGearRatios: [1.0, 7.20],
    baseMSRPUSD: 4500000
  }
];

export class HyperEvPrototypesPart5Service {
  public static getAllVehicles(): HyperEvPrototypeSpec[] {
    return [...HYPER_EV_PROTOTYPES_DATABASE_PART5];
  }

  public static getVehicleById(id: string): HyperEvPrototypeSpec | undefined {
    return HYPER_EV_PROTOTYPES_DATABASE_PART5.find(v => v.id === id);
  }
}
