/**
 * ============================================================================
 * REALDRIVE SEED DATA - FORMULA DRIFT PRO SPEC VEHICLE DATABASE (PART 8)
 * ============================================================================
 * Professional Formula Drift competition machines:
 * - 70+ Degree Wisefab Angle Lock Steering Geometry
 * - Dual Hydraulic Wilwood Staging Handbrakes (Independent Rear Calipers)
 * - 1,000+ Wheel Horsepower on E85 Ethanol & Nitrous Oxide Spool Kits
 * - High-Smoke Valvoline/Falken Semi-Slick Tire Compounds
 */

export interface ProDriftVehicleSpec {
  readonly id: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly driverTeam: string;
  readonly engineSwap: string;
  readonly displacementLiters: number;
  readonly horsepowerWhp: number;
  readonly torqueNm: number;
  readonly maxSteeringAngleDeg: number;    // 68° to 74° extreme lock angle
  readonly ackermannSteeringPercent: number;// 0% parallel to -20% reverse Ackermann for drift transitions
  readonly hydroHandbrakePressureBar: number;
  readonly weightKg: number;
  readonly weightDistributionFrontPercent: number;
  readonly zeroTo100KphSec: number;
  readonly topDriftSpeedKph: number;
  readonly tireSmokeVolumeScore: number;  // 1 to 100 smoke intensity
  readonly baseMSRPUSD: number;
}

export const PRO_DRIFT_PART8_DATABASE: readonly ProDriftVehicleSpec[] = [
  {
    id: 'veh_formula_drift_gr_supra_2jz',
    make: 'Papadakis Racing',
    model: 'Toyota GR Supra (3.0L Billet 2JZ-GTE)',
    year: 2025,
    driverTeam: 'Rockstar Energy / Toyota Racing',
    engineSwap: '3.4L Billet Stroker 2JZ-GTE with BorgWarner EFR 9280 Turbo + Nitrous',
    displacementLiters: 3.4,
    horsepowerWhp: 1150,
    torqueNm: 1350,
    maxSteeringAngleDeg: 72.0, // Wisefab PRO Angle Kit
    ackermannSteeringPercent: -5.0,
    hydroHandbrakePressureBar: 140.0,
    weightKg: 1240,
    weightDistributionFrontPercent: 51.0,
    zeroTo100KphSec: 2.60,
    topDriftSpeedKph: 195, // High-speed drift initiation at 195 kph!
    tireSmokeVolumeScore: 98,
    baseMSRPUSD: 380000
  },
  {
    id: 'veh_formula_drift_silvia_s15_vr38',
    make: 'Nissan',
    model: 'Silvia S15 GT-R Powertrain (VR38DETT)',
    year: 2024,
    driverTeam: 'Midnight Sun Drift Engineering',
    engineSwap: '3.8L Twin-Turbo VR38DETT Dry-Sump V6',
    displacementLiters: 3.8,
    horsepowerWhp: 1200,
    torqueNm: 1420,
    maxSteeringAngleDeg: 74.0,
    ackermannSteeringPercent: 0.0, // Pure parallel steering
    hydroHandbrakePressureBar: 150.0,
    weightKg: 1190,
    weightDistributionFrontPercent: 52.0,
    zeroTo100KphSec: 2.50,
    topDriftSpeedKph: 205,
    tireSmokeVolumeScore: 100,
    baseMSRPUSD: 420000
  },
  {
    id: 'veh_formula_drift_rtr_mustang_v8',
    make: 'RTR Vehicles',
    model: 'Mustang Spec 5-D Supercharged V8',
    year: 2025,
    driverTeam: 'Monster Energy / RTR Drift Team',
    engineSwap: '7.0L Roush Yates NASCAR Spec Naturally Aspirated / Supercharged V8',
    displacementLiters: 7.0,
    horsepowerWhp: 1300,
    torqueNm: 1500,
    maxSteeringAngleDeg: 70.0,
    ackermannSteeringPercent: -8.0,
    hydroHandbrakePressureBar: 145.0,
    weightKg: 1320,
    weightDistributionFrontPercent: 53.0,
    zeroTo100KphSec: 2.40,
    topDriftSpeedKph: 210,
    tireSmokeVolumeScore: 100,
    baseMSRPUSD: 450000
  }
];

export class ProDriftPart8Service {
  public static getAllDriftCars(): ProDriftVehicleSpec[] {
    return [...PRO_DRIFT_PART8_DATABASE];
  }
}
