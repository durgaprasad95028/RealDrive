/**
 * ============================================================================
 * REALDRIVE SEED DATA - VINTAGE LEGENDS & GROUP B RALLY DATABASE (PART 4)
 * ============================================================================
 * Master technical registry of iconic historic motorsport machinery:
 * - Group B Rally Legends: Audi Sport Quattro S1 E2, Lancia Delta S4, Peugeot 205 T16
 * - 90s Golden Era JDM Icons: Mazda RX-7 FD3S Spirit R, Honda NSX-R NA2, Nissan Skyline R33 LM
 * - Raw Analog Supercars: Dodge Viper GTS ACR V10, Shelby Cobra 427 S/C, McLaren F1 XP5
 */

export interface VintageLegendSpec {
  readonly id: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly classification: 'group_b_rally' | 'jdm_golden_era' | 'analog_v10_v12' | 'classic_muscle';
  readonly engineName: string;
  readonly displacementCc: number;
  readonly cylinderConfig: string;
  readonly aspiration: 'turbocharged' | 'twin_turbo' | 'twin_charged_turbo_super' | 'naturally_aspirated';
  readonly maxHorsepowerHp: number;
  readonly maxTorqueNm: number;
  readonly redlineRpm: number;
  readonly weightKg: number;
  readonly drivetrain: 'awd_50_50' | 'awd_variable_center_diff' | 'rwd_front_engine' | 'rwd_mid_engine';
  readonly zeroTo100KphSec: number;
  readonly topSpeedKph: number;
  readonly dragCoefficientCd: number;
  readonly frontalAreaM2: number;
  readonly soundExhaustProfile: 'rotary_brap' | 'inline5_turbo_chirp' | 'v10_open_headers' | 'boxer_rumble';
  readonly torqueCurve: readonly { rpm: number; torqueNm: number }[];
  readonly gearRatios: readonly number[];
  readonly finalDrive: number;
}

export const VINTAGE_LEGENDS_DATABASE_PART4: readonly VintageLegendSpec[] = [
  // ==========================================================================
  // GROUP B RALLY MONSTERS
  // ==========================================================================
  {
    id: 'veh_audi_sport_quattro_s1_e2',
    make: 'Audi',
    model: 'Sport Quattro S1 E2 Pikes Peak',
    year: 1986,
    classification: 'group_b_rally',
    engineName: '2.1L 20V Turbocharged Inline-5 (Aluminium Block)',
    displacementCc: 2110,
    cylinderConfig: 'Inline-5',
    aspiration: 'turbocharged',
    maxHorsepowerHp: 590,
    maxTorqueNm: 590,
    redlineRpm: 8800,
    weightKg: 1090,
    drivetrain: 'awd_50_50',
    zeroTo100KphSec: 2.30, // 0-100 on loose gravel
    topSpeedKph: 260,
    dragCoefficientCd: 0.48, // Massive snowplow front wings & rear bi-plane wing
    frontalAreaM2: 2.05,
    soundExhaustProfile: 'inline5_turbo_chirp',
    torqueCurve: [
      { rpm: 2500, torqueNm: 220 },
      { rpm: 4500, torqueNm: 480 },
      { rpm: 5500, torqueNm: 590 }, // Explosive KKK Turbo Boost Hit
      { rpm: 7500, torqueNm: 560 },
      { rpm: 8800, torqueNm: 480 }
    ],
    gearRatios: [3.40, 3.50, 2.30, 1.70, 1.30, 1.05, 0.88],
    finalDrive: 4.11
  },
  {
    id: 'veh_lancia_delta_s4',
    make: 'Lancia',
    model: 'Delta S4 Corsa Group B',
    year: 1985,
    classification: 'group_b_rally',
    engineName: '1.8L Twin-Charged (Roots Supercharger + KKK Turbocharger) Inline-4',
    displacementCc: 1759,
    cylinderConfig: 'Inline-4 Mid-Mounted',
    aspiration: 'twin_charged_turbo_super',
    maxHorsepowerHp: 550,
    maxTorqueNm: 540,
    redlineRpm: 8600,
    weightKg: 890, // Ultra-light tubular spaceframe & Kevlar body panels
    drivetrain: 'awd_variable_center_diff',
    zeroTo100KphSec: 2.40,
    topSpeedKph: 255,
    dragCoefficientCd: 0.44,
    frontalAreaM2: 1.92,
    soundExhaustProfile: 'inline5_turbo_chirp',
    torqueCurve: [
      { rpm: 1500, torqueNm: 350 }, // Supercharger instant low-end torque
      { rpm: 3500, torqueNm: 460 },
      { rpm: 5000, torqueNm: 540 }, // Turbo hand-off crossover
      { rpm: 7500, torqueNm: 520 },
      { rpm: 8600, torqueNm: 440 }
    ],
    gearRatios: [3.35, 3.65, 2.40, 1.80, 1.40, 1.15],
    finalDrive: 4.25
  },

  // ==========================================================================
  // JDM GOLDEN ERA SPECIALS
  // ==========================================================================
  {
    id: 'veh_mazda_rx7_spirit_r',
    make: 'Mazda',
    model: 'RX-7 Spirit R Type-A (FD3S)',
    year: 2002,
    classification: 'jdm_golden_era',
    engineName: '1.3L 13B-REW Sequential Twin-Turbo Twin-Rotor Wankel',
    displacementCc: 1308,
    cylinderConfig: '2-Rotor Wankel Rotary',
    aspiration: 'twin_turbo',
    maxHorsepowerHp: 280,
    maxTorqueNm: 314,
    redlineRpm: 8200,
    weightKg: 1270,
    drivetrain: 'rwd_front_engine', // 50:50 Front-Midship
    zeroTo100KphSec: 4.80,
    topSpeedKph: 265,
    dragCoefficientCd: 0.29,
    frontalAreaM2: 1.82,
    soundExhaustProfile: 'rotary_brap',
    torqueCurve: [
      { rpm: 2000, torqueNm: 240 },
      { rpm: 4500, torqueNm: 300 },
      { rpm: 5000, torqueNm: 314 }, // Secondary Turbo Transition
      { rpm: 7000, torqueNm: 290 },
      { rpm: 8200, torqueNm: 240 }
    ],
    gearRatios: [3.15, 3.48, 2.01, 1.39, 1.00, 0.76],
    finalDrive: 4.10
  },
  {
    id: 'veh_honda_nsx_r_na2',
    make: 'Honda',
    model: 'NSX-R (NA2 Chassis)',
    year: 2002,
    classification: 'jdm_golden_era',
    engineName: '3.2L C32B DOHC VTEC Naturally Aspirated 90° V6',
    displacementCc: 3179,
    cylinderConfig: 'V6 Mid-Mounted',
    aspiration: 'naturally_aspirated',
    maxHorsepowerHp: 290,
    maxTorqueNm: 304,
    redlineRpm: 8300,
    weightKg: 1270,
    drivetrain: 'rwd_mid_engine',
    zeroTo100KphSec: 4.40,
    topSpeedKph: 280,
    dragCoefficientCd: 0.30,
    frontalAreaM2: 1.78,
    soundExhaustProfile: 'rotary_brap',
    torqueCurve: [
      { rpm: 2500, torqueNm: 220 },
      { rpm: 5300, torqueNm: 280 }, // VTEC Cam Switch Point
      { rpm: 6500, torqueNm: 304 },
      { rpm: 7500, torqueNm: 295 },
      { rpm: 8300, torqueNm: 250 }
    ],
    gearRatios: [3.20, 3.06, 1.95, 1.42, 1.12, 0.91, 0.71],
    finalDrive: 4.23
  },

  // ==========================================================================
  // ANALOG RAW POWER SUPERCARS
  // ==========================================================================
  {
    id: 'veh_dodge_viper_gts_acr',
    make: 'Dodge',
    model: 'Viper GTS ACR (Phase II)',
    year: 1999,
    classification: 'analog_v10_v12',
    engineName: '8.0L Naturally Aspirated 90° Pushrod V10',
    displacementCc: 7990,
    cylinderConfig: 'V10 Front-Mounted',
    aspiration: 'naturally_aspirated',
    maxHorsepowerHp: 460,
    maxTorqueNm: 678,
    redlineRpm: 6000,
    weightKg: 1530,
    drivetrain: 'rwd_front_engine',
    zeroTo100KphSec: 4.00,
    topSpeedKph: 305,
    dragCoefficientCd: 0.35,
    frontalAreaM2: 1.98,
    soundExhaustProfile: 'v10_open_headers',
    torqueCurve: [
      { rpm: 1200, torqueNm: 520 }, // Mountain of low-end displacement torque
      { rpm: 2500, torqueNm: 620 },
      { rpm: 3700, torqueNm: 678 }, // Peak Torque @ 3700 RPM
      { rpm: 5200, torqueNm: 610 },
      { rpm: 6000, torqueNm: 540 }
    ],
    gearRatios: [3.30, 2.66, 1.78, 1.30, 1.00, 0.74, 0.50],
    finalDrive: 3.07
  }
];

export class VintageLegendsPart4Service {
  public static getAllVehicles(): VintageLegendSpec[] {
    return [...VINTAGE_LEGENDS_DATABASE_PART4];
  }

  public static getVehicleById(id: string): VintageLegendSpec | undefined {
    return VINTAGE_LEGENDS_DATABASE_PART4.find(v => v.id === id);
  }
}
