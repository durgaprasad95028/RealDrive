/**
 * ============================================================================
 * REALDRIVE SEED DATA - FORMULA SINGLE-SEATER & INDYCAR DATABASE (PART 6)
 * ============================================================================
 * Open-wheel single-seater prototypes with extreme downforce:
 * - RealDrive Apex F1-26 (1,000 HP 1.6L V6 Turbo Hybrid with Active Aerodynamics DRS)
 * - Dallara IR-18 IndyCar (2.4L Twin-Turbo V6 Speedway Aero Spec @ 385 kph)
 * - Super Formula SF23 (2.0L Turbocharged Inline-4 550 HP with Push-to-Pass Overtake)
 * - Formula E Gen3 Evo (470 HP Dual-Motor All-Wheel Drive Acceleration Record)
 */

export interface FormulaSingleSeaterSpec {
  readonly id: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly formulaSeries: 'formula_one_world_championship' | 'indycar_series' | 'super_formula_japan' | 'formula_e_world_championship';
  readonly engineDescription: string;
  readonly displacementLiters: number;
  readonly maxRpm: number;
  readonly totalPowerHp: number;
  readonly minWeightKg: number; // Including driver & ballast
  readonly weightDistributionFrontPercent: number;
  readonly downforceAt250KphN: number; // e.g. 24,000 N (2.4 tons downforce)
  readonly dragCoefficientCd: number;
  readonly frontalAreaM2: number;
  readonly drsDragReductionPercent: number; // 28-35% drag dump with flap open
  readonly maxLateralGForce: number; // Up to 5.2G in high-speed sweepers
  readonly maxBrakingGForce: number; // Up to 5.8G under heavy braking from 350 kph
  readonly zeroTo100KphSec: number;
  readonly zeroTo200KphSec: number;
  readonly topSpeedKph: number;
  readonly gearRatios: readonly number[];
  readonly baseMSRPUSD: number;
}

export const FORMULA_SINGLE_SEATER_PART6_DATABASE: readonly FormulaSingleSeaterSpec[] = [
  {
    id: 'veh_formula_one_apex_f1_26',
    make: 'Apex Racing Team',
    model: 'Apex F1-26 Ground Effect Hybrid',
    year: 2026,
    formulaSeries: 'formula_one_world_championship',
    engineDescription: '1.6L 90° V6 Turbocharged Internal Combustion Engine + 350kW MGU-K Hybrid',
    displacementLiters: 1.6,
    maxRpm: 15000,
    totalPowerHp: 1050,
    minWeightKg: 798,
    weightDistributionFrontPercent: 45.5,
    downforceAt250KphN: 24500, // Venturi floor ground effect tunnels
    dragCoefficientCd: 0.72, // High-downforce Monaco/Silverstone spec
    frontalAreaM2: 1.45,
    drsDragReductionPercent: 32.0,
    maxLateralGForce: 5.4,
    maxBrakingGForce: 5.9,
    zeroTo100KphSec: 1.85,
    zeroTo200KphSec: 4.10,
    topSpeedKph: 365,
    gearRatios: [3.40, 3.42, 2.38, 1.82, 1.45, 1.20, 1.02, 0.88, 0.76],
    baseMSRPUSD: 14500000
  },
  {
    id: 'veh_indycar_dallara_ir18_speedway',
    make: 'Dallara',
    model: 'IR-18 Indy 500 Speedway Spec',
    year: 2025,
    formulaSeries: 'indycar_series',
    engineDescription: '2.4L Twin-Turbocharged 90° V6 (Chevy / Honda Spec)',
    displacementLiters: 2.4,
    maxRpm: 12200,
    totalPowerHp: 750,
    minWeightKg: 745,
    weightDistributionFrontPercent: 44.0,
    downforceAt250KphN: 9800, // Low-drag oval speedway wing configuration
    dragCoefficientCd: 0.38,
    frontalAreaM2: 1.42,
    drsDragReductionPercent: 0.0,
    maxLateralGForce: 4.2,
    maxBrakingGForce: 4.8,
    zeroTo100KphSec: 2.20,
    zeroTo200KphSec: 4.80,
    topSpeedKph: 388, // 241 mph Indianapolis pole qualifying speed
    gearRatios: [3.30, 3.10, 2.20, 1.65, 1.30, 1.08, 0.92],
    baseMSRPUSD: 2800000
  },
  {
    id: 'veh_super_formula_sf23_mugen',
    make: 'Dallara / Mugen',
    model: 'Super Formula SF23',
    year: 2024,
    formulaSeries: 'super_formula_japan',
    engineDescription: '2.0L Direct-Injected Inline-4 Turbocharged NRE (550 HP + 50 HP OTS Push-to-Pass)',
    displacementLiters: 2.0,
    maxRpm: 9500,
    totalPowerHp: 600,
    minWeightKg: 677, // Featherweight carbon single seater
    weightDistributionFrontPercent: 44.5,
    downforceAt250KphN: 21000,
    dragCoefficientCd: 0.68,
    frontalAreaM2: 1.40,
    drsDragReductionPercent: 0.0,
    maxLateralGForce: 4.8,
    maxBrakingGForce: 5.2,
    zeroTo100KphSec: 2.05,
    zeroTo200KphSec: 4.40,
    topSpeedKph: 330,
    gearRatios: [3.35, 3.25, 2.28, 1.72, 1.35, 1.10, 0.92],
    baseMSRPUSD: 1850000
  }
];

export class FormulaSingleSeatersPart6Service {
  public static getAllFormulaCars(): FormulaSingleSeaterSpec[] {
    return [...FORMULA_SINGLE_SEATER_PART6_DATABASE];
  }
}
