/**
 * EngineTuningStudio — Comprehensive Powertrain Engineering, ECU Calibration & Forced Induction
 */

export type ECUStage = 'STOCK' | 'STAGE_1_FLASH' | 'STAGE_2_PRO' | 'STAGE_3_CUSTOM' | 'STANDALONE_RACE';

export type TurbochargerUpgrade =
  | 'STOCK_OEM'
  | 'BALL_BEARING_QUICK_SPOOL'
  | 'BILLET_WHEEL_HYBRID'
  | 'LARGE_FRAME_SINGLE'
  | 'TWIN_SCROLL_TWIN_TURBO'
  | 'COMPOUND_SEQUENTIAL';

export type CamshaftProfile =
  | 'STOCK_OEM'
  | 'STREET_PERFORMANCE_264'
  | 'FAST_ROAD_272'
  | 'RACE_AGGRESSIVE_288'
  | 'FULL_DRAG_304_LOPE';

export type ForgedInternalsLevel =
  | 'STOCK_CAST'
  | 'FORGED_RODS_PISTONS'
  | 'BILLET_CRANK_SLEEVED_BLOCK'
  | 'FULL_TITANIUM_RACE_BUILD';

export type ExhaustSystemType =
  | 'STOCK_OEM'
  | 'CAT_BACK_STAINLESS'
  | 'HIGH_FLOW_CAT_TITANIUM'
  | 'STRAIGHT_PIPE_RACE_HEADER'
  | 'VALVED_TITANIUM_ACTIVE';

export type FuelSystemType =
  | 'STOCK_OEM'
  | 'STAGE_1_550CC_INJECTORS'
  | 'STAGE_2_1050CC_PUMP'
  | 'E85_FLEX_FUEL_2000CC';

export type NitrousSystemType =
  | 'NONE'
  | 'WET_SHOT_50HP'
  | 'WET_SHOT_100HP'
  | 'DIRECT_PORT_200HP'
  | 'PROGRESSIVE_STAGE2_300HP';

export interface EngineTuneConfiguration {
  ecuStage: ECUStage;
  ignitionTimingAdvanceDeg: number; // e.g. -2 to +8 degrees
  targetAirFuelRatio: number; // e.g. 11.2 to 14.7
  revLimiterRpm: number;
  launchControlRpm: number;
  antiLagEnabled: boolean;
  turbocharger: TurbochargerUpgrade;
  targetBoostPsi: number;
  wastegateCrackingPsi: number;
  camshaft: CamshaftProfile;
  internals: ForgedInternalsLevel;
  exhaust: ExhaustSystemType;
  fuelSystem: FuelSystemType;
  nitrous: NitrousSystemType;
}

export interface TunedPerformanceMetrics {
  stockHp: number;
  tunedHp: number;
  hpGain: number;
  stockTorqueNm: number;
  tunedTorqueNm: number;
  torqueGainNm: number;
  stockWeightKg: number;
  tunedWeightKg: number;
  weightDeltaKg: number;
  newRedlineRpm: number;
  maxSafeBoostPsi: number;
  turboLagFactor: number; // 0.0 (instant) to 1.0 (heavy lag)
  exhaustSoundDb: number;
  overallReliabilityScore: number; // 0 to 100%
  tuningCostCredits: number;
}

export class EngineTuningStudio {
  /**
   * Calculates tuned performance metrics based on installed engine modifications
   */
  public static calculateTunedMetrics(
    baseHp: number,
    baseTorqueNm: number,
    baseRedlineRpm: number,
    baseWeightKg: number,
    isNaturallyAspirated: boolean,
    tune: EngineTuneConfiguration
  ): TunedPerformanceMetrics {
    let hpMultiplier = 1.0;
    let torqueMultiplier = 1.0;
    let redlineOffset = 0;
    let weightDelta = 0;
    let cost = 0;
    let reliability = 100;
    let exhaustDb = 82; // stock baseline db
    let turboLag = 0.2;

    // 1. ECU Stage Multipliers
    switch (tune.ecuStage) {
      case 'STAGE_1_FLASH':
        hpMultiplier += isNaturallyAspirated ? 0.06 : 0.16;
        torqueMultiplier += isNaturallyAspirated ? 0.08 : 0.20;
        redlineOffset += 300;
        reliability -= 3;
        cost += 1500;
        break;
      case 'STAGE_2_PRO':
        hpMultiplier += isNaturallyAspirated ? 0.12 : 0.28;
        torqueMultiplier += isNaturallyAspirated ? 0.14 : 0.32;
        redlineOffset += 500;
        reliability -= 7;
        cost += 3800;
        break;
      case 'STAGE_3_CUSTOM':
        hpMultiplier += isNaturallyAspirated ? 0.20 : 0.45;
        torqueMultiplier += isNaturallyAspirated ? 0.22 : 0.48;
        redlineOffset += 800;
        reliability -= 12;
        cost += 7500;
        break;
      case 'STANDALONE_RACE':
        hpMultiplier += isNaturallyAspirated ? 0.28 : 0.65;
        torqueMultiplier += isNaturallyAspirated ? 0.29 : 0.68;
        redlineOffset += 1200;
        reliability -= 18;
        cost += 14000;
        break;
    }

    // 2. Timing Advance and AFR adjustments
    const timingBonus = (tune.ignitionTimingAdvanceDeg / 10) * 0.05;
    hpMultiplier += timingBonus;
    if (tune.ignitionTimingAdvanceDeg > 5) reliability -= 8; // risk of detonation knock

    if (tune.antiLagEnabled) {
      turboLag = 0.05;
      reliability -= 15;
      cost += 2200;
      exhaustDb += 12;
    }

    // 3. Turbocharger Upgrades
    switch (tune.turbocharger) {
      case 'BALL_BEARING_QUICK_SPOOL':
        hpMultiplier += 0.18;
        torqueMultiplier += 0.15;
        turboLag = 0.15;
        cost += 3200;
        break;
      case 'BILLET_WHEEL_HYBRID':
        hpMultiplier += 0.30;
        torqueMultiplier += 0.28;
        turboLag = 0.25;
        cost += 4800;
        break;
      case 'LARGE_FRAME_SINGLE':
        hpMultiplier += 0.55;
        torqueMultiplier += 0.50;
        turboLag = 0.48;
        cost += 8500;
        break;
      case 'TWIN_SCROLL_TWIN_TURBO':
        hpMultiplier += 0.48;
        torqueMultiplier += 0.46;
        turboLag = 0.22;
        cost += 11000;
        break;
      case 'COMPOUND_SEQUENTIAL':
        hpMultiplier += 0.70;
        torqueMultiplier += 0.68;
        turboLag = 0.12;
        cost += 16500;
        break;
    }

    // 4. Camshaft Profile
    switch (tune.camshaft) {
      case 'STREET_PERFORMANCE_264':
        hpMultiplier += 0.07;
        redlineOffset += 200;
        cost += 1200;
        break;
      case 'FAST_ROAD_272':
        hpMultiplier += 0.14;
        redlineOffset += 500;
        cost += 2200;
        break;
      case 'RACE_AGGRESSIVE_288':
        hpMultiplier += 0.22;
        redlineOffset += 900;
        reliability -= 8;
        cost += 3800;
        break;
      case 'FULL_DRAG_304_LOPE':
        hpMultiplier += 0.32;
        redlineOffset += 1400;
        reliability -= 15;
        cost += 5500;
        break;
    }

    // 5. Forged Internals Strength & Weight
    let maxSafeBoost = 15; // stock psi
    switch (tune.internals) {
      case 'FORGED_RODS_PISTONS':
        maxSafeBoost = 28;
        reliability += 15;
        weightDelta -= 6;
        cost += 4500;
        break;
      case 'BILLET_CRANK_SLEEVED_BLOCK':
        maxSafeBoost = 42;
        reliability += 25;
        weightDelta -= 12;
        cost += 9800;
        break;
      case 'FULL_TITANIUM_RACE_BUILD':
        maxSafeBoost = 58;
        reliability += 35;
        weightDelta -= 24;
        cost += 22000;
        break;
    }

    // 6. Exhaust System
    switch (tune.exhaust) {
      case 'CAT_BACK_STAINLESS':
        hpMultiplier += 0.04;
        weightDelta -= 8;
        exhaustDb += 6;
        cost += 1200;
        break;
      case 'HIGH_FLOW_CAT_TITANIUM':
        hpMultiplier += 0.08;
        weightDelta -= 18;
        exhaustDb += 10;
        cost += 3400;
        break;
      case 'STRAIGHT_PIPE_RACE_HEADER':
        hpMultiplier += 0.14;
        weightDelta -= 22;
        exhaustDb += 22;
        cost += 4800;
        break;
      case 'VALVED_TITANIUM_ACTIVE':
        hpMultiplier += 0.11;
        weightDelta -= 16;
        exhaustDb += 14;
        cost += 5200;
        break;
    }

    // 7. Fuel System & FlexFuel
    switch (tune.fuelSystem) {
      case 'STAGE_1_550CC_INJECTORS':
        hpMultiplier += 0.03;
        cost += 850;
        break;
      case 'STAGE_2_1050CC_PUMP':
        hpMultiplier += 0.07;
        cost += 1900;
        break;
      case 'E85_FLEX_FUEL_2000CC':
        hpMultiplier += 0.18; // Massive E85 cooling & octane boost
        torqueMultiplier += 0.15;
        cost += 4200;
        break;
    }

    // 8. Nitrous Oxide System
    let nitrousHp = 0;
    switch (tune.nitrous) {
      case 'WET_SHOT_50HP':
        nitrousHp = 50;
        cost += 1800;
        reliability -= 5;
        break;
      case 'WET_SHOT_100HP':
        nitrousHp = 100;
        cost += 2800;
        reliability -= 12;
        break;
      case 'DIRECT_PORT_200HP':
        nitrousHp = 200;
        cost += 5400;
        reliability -= 22;
        break;
      case 'PROGRESSIVE_STAGE2_300HP':
        nitrousHp = 300;
        cost += 8900;
        reliability -= 35;
        break;
    }

    const tunedHp = Math.round(baseHp * hpMultiplier + nitrousHp);
    const tunedTorque = Math.round(baseTorqueNm * torqueMultiplier);
    const tunedRedline = baseRedlineRpm + redlineOffset;
    const tunedWeight = Math.max(800, baseWeightKg + weightDelta);

    return {
      stockHp: baseHp,
      tunedHp,
      hpGain: tunedHp - baseHp,
      stockTorqueNm: baseTorqueNm,
      tunedTorqueNm: tunedTorque,
      torqueGainNm: tunedTorque - baseTorqueNm,
      stockWeightKg: baseWeightKg,
      tunedWeightKg: tunedWeight,
      weightDeltaKg: weightDelta,
      newRedlineRpm: tunedRedline,
      maxSafeBoostPsi: maxSafeBoost,
      turboLagFactor: Math.max(0.02, Math.min(1.0, turboLag)),
      exhaustSoundDb: Math.min(125, exhaustDb),
      overallReliabilityScore: Math.max(10, Math.min(100, reliability)),
      tuningCostCredits: cost,
    };
  }
}
