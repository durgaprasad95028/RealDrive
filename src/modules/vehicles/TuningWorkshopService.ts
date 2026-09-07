/**
 * ============================================================================
 * REALDRIVE VEHICLES — TUNING WORKSHOP & UPGRADE SERVICE
 * ============================================================================
 * Aftermarket parts catalog, mechanical modification calculations,
 * weight reduction, suspension stiffness, and laser alignment geometry.
 */

import { VehicleEntity } from '../../database/entities/VehicleEntity.js';
import { VehicleTuningEntity } from '../../database/entities/VehicleTuningEntity.js';

export interface TuningPartOption {
  id: string;
  category: 'ECU' | 'TURBO' | 'EXHAUST' | 'INTAKE' | 'SUSPENSION' | 'BRAKES' | 'TIRES' | 'DIFFERENTIAL' | 'AERO';
  name: string;
  priceCredits: number;
  horsepowerDelta: number;
  torqueDeltaNm: number;
  weightReductionKg: number;
  lateralGDelta: number;
  description: string;
}

export class TuningWorkshopService {
  public static readonly PARTS_CATALOG: TuningPartOption[] = [
    // ECU
    { id: 'part_ecu_s1', category: 'ECU', name: 'Stage 1 Remap (Street Flash)', priceCredits: 2500, horsepowerDelta: 45, torqueDeltaNm: 60, weightReductionKg: 0, lateralGDelta: 0, description: 'Optimized ignition timing and air/fuel maps for pump 93 octane gas.' },
    { id: 'part_ecu_s2', category: 'ECU', name: 'Stage 2 Remap + Burble Tune', priceCredits: 6500, horsepowerDelta: 95, torqueDeltaNm: 120, weightReductionKg: 0, lateralGDelta: 0, description: 'Aggressive boost curves, anti-lag launch control, and pop-and-bang exhaust deceleration.' },
    { id: 'part_ecu_s3', category: 'ECU', name: 'Stage 3 Full Race Standalone ECU (MoTeC)', priceCredits: 18000, horsepowerDelta: 190, torqueDeltaNm: 220, weightReductionKg: -5, lateralGDelta: 0, description: 'Fully programmable dual-core motorsport ECU with rolling anti-lag and traction telemetry.' },

    // Forced Induction
    { id: 'part_turbo_twin', category: 'TURBO', name: 'Garrett Twin Ball-Bearing Turbos (GT3582R)', priceCredits: 22000, horsepowerDelta: 240, torqueDeltaNm: 260, weightReductionKg: 2, lateralGDelta: 0, description: 'Billet compressor wheels with ceramic dual ball-bearings capable of 2.5 bar boost.' },
    { id: 'part_supercharger_whipple', category: 'TURBO', name: 'Whipple 3.8L Twin-Screw Supercharger', priceCredits: 26000, horsepowerDelta: 280, torqueDeltaNm: 340, weightReductionKg: 18, lateralGDelta: -0.02, description: 'Instantaneous low-end torque delivery with screaming twin-screw supercharger whine.' },

    // Exhaust
    { id: 'part_exh_titanium', category: 'EXHAUST', name: 'Akrapovič Full Titanium Valved Exhaust', priceCredits: 12500, horsepowerDelta: 30, torqueDeltaNm: 25, weightReductionKg: -22, lateralGDelta: 0.02, description: 'Ultra-lightweight titanium tubing with electronically actuated bypass valves.' },
    { id: 'part_exh_straight', category: 'EXHAUST', name: 'Custom Hood-Exit Straight Pipe Flame Thrower', priceCredits: 8000, horsepowerDelta: 40, torqueDeltaNm: 30, weightReductionKg: -30, lateralGDelta: 0.03, description: 'Zero backpressure straight pipe with dramatic blue backfire flames on shift.' },

    // Suspension
    { id: 'part_susp_kw_v3', category: 'SUSPENSION', name: 'KW Clubsport 3-Way Adjustable Coilovers', priceCredits: 9500, horsepowerDelta: 0, torqueDeltaNm: 0, weightReductionKg: -8, lateralGDelta: 0.22, description: 'Independent bump and rebound high/low-speed damping adjustment with forged top mounts.' },
    { id: 'part_susp_airlift', category: 'SUSPENSION', name: 'Air Lift Performance 3H Digital Air Suspension', priceCredits: 11000, horsepowerDelta: 0, torqueDeltaNm: 0, weightReductionKg: 10, lateralGDelta: 0.08, description: 'Height-sensor automated air management for frame-laying stance and slammed park mode.' },

    // Brakes
    { id: 'part_brk_carbon', category: 'BRAKES', name: 'Brembo Carbon-Ceramic 420mm 6-Pot Kit', priceCredits: 16500, horsepowerDelta: 0, torqueDeltaNm: 0, weightReductionKg: -24, lateralGDelta: 0.05, description: 'Zero fade endurance braking rotors capable of withstanding 1,000°C temperatures.' },

    // Tires
    { id: 'part_tire_slick', category: 'TIRES', name: 'Michelin Pilot Sport Cup 2 R Semi-Slicks', priceCredits: 4200, horsepowerDelta: 0, torqueDeltaNm: 0, weightReductionKg: 0, lateralGDelta: 0.35, description: 'Competition ultra-soft compound for maximum lateral grip and cornering g-force.' },
  ];

  public static calculateModifiedStats(vehicle: VehicleEntity, tuning: VehicleTuningEntity): {
    horsepower: number;
    torqueNm: number;
    topSpeedKmh: number;
    zeroToHundredSec: number;
    curbWeightKg: number;
    lateralG: number;
  } {
    let hp = vehicle.horsepower;
    let torque = vehicle.torqueNm;
    let weight = vehicle.curbWeightKg;
    let lateralG = vehicle.lateralGForce;

    // Apply ECU Stage
    if (tuning.ecuStage === 'STAGE_1') { hp += 45; torque += 60; }
    if (tuning.ecuStage === 'STAGE_2') { hp += 95; torque += 120; }
    if (tuning.ecuStage === 'STAGE_3') { hp += 190; torque += 220; }
    if (tuning.ecuStage === 'PRO_CUSTOM_STANDALONE') { hp += 280; torque += 340; }

    // Turbo Boost contribution: ~70 HP per 0.5 bar
    if (tuning.forcedInductionType.includes('TURBO') && tuning.turboBoostPressureBar > 0) {
      hp += Math.round(tuning.turboBoostPressureBar * 120);
      torque += Math.round(tuning.turboBoostPressureBar * 140);
    }

    // Camber & Coilovers contribution to lateral G
    if (tuning.suspensionCoiloverType === 'PRO_2WAY_ADJUSTABLE') {
      lateralG += 0.20;
    }
    if (tuning.camberFrontDeg < -2.0) {
      lateralG += 0.08;
    }

    // Tire Compound
    if (tuning.tireCompound === 'SEMI_SLICK_TRACK') lateralG += 0.25;
    if (tuning.tireCompound === 'FULL_SLICK_RACE') lateralG += 0.40;

    // Aero rear wing contribution
    if (tuning.rearWingAngleDeg > 10) {
      lateralG += 0.12;
    }

    // Acceleration 0-100 km/h: (Weight / HP) * 1.3 approximation
    const powerToWeightRatio = hp / (weight / 1000); // HP per ton
    let zeroToHundred = Math.max(1.8, Math.round((700 / powerToWeightRatio) * 10) / 10);

    // Top Speed calculation based on aerodynamic drag limit & HP
    const topSpeed = Math.round(Math.pow(hp / 0.0008, 1 / 3) * 1.85);

    return {
      horsepower: Math.round(hp),
      torqueNm: Math.round(torque),
      topSpeedKmh: Math.max(vehicle.topSpeedKmh, topSpeed),
      zeroToHundredSec: zeroToHundred,
      curbWeightKg: Math.round(weight),
      lateralGForce: Number(lateralG.toFixed(2)),
    } as any;
  }
}
