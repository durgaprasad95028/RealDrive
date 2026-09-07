/**
 * ============================================================================
 * REALDRIVE VEHICLES — VIRTUAL DYNO SIMULATION SERVICE
 * ============================================================================
 * High-precision rolling-road dynamometer simulator:
 * - Engine brake mean effective pressure (BMEP)
 * - Volumetric efficiency (VE) maps across RPM band
 * - Air-Fuel Ratio (AFR) torque correction factor
 * - Turbocharger compressor map pressure ratio & mass flow
 * - Drivetrain parasitic loss calculations (AWD ~18%, RWD ~12%, FWD ~10%)
 */

export interface DynoPoint {
  rpm: number;
  engineHp: number;
  wheelHp: number;
  engineTorqueNm: number;
  wheelTorqueNm: number;
  boostBar: number;
  afr: number;
  exhaustGasTempC: number;
}

export interface DynoRunResult {
  vehicleId: string;
  vehicleName: string;
  maxEngineHp: number;
  maxEngineHpRpm: number;
  maxWheelHp: number;
  maxTorqueNm: number;
  maxTorqueRpm: number;
  maxBoostBar: number;
  drivetrainLossPct: number;
  ambientTempC: number;
  airPressureHpa: number;
  curve: DynoPoint[];
  testedAt: string;
}

export interface DynoEngineConfig {
  displacementLiters: number;
  cylinders: number;
  idleRpm: number;
  redlineRpm: number;
  baseTorqueNm: number;
  ecuStage: 'STOCK' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'PRO_CUSTOM_STANDALONE';
  ignitionTimingDegrees: number;
  fuelAirTargetRatio: number;
  forcedInductionType: 'NATURALLY_ASPIRATED' | 'SINGLE_TURBO' | 'TWIN_TURBO' | 'ROOTS_SUPERCHARGER' | 'CENTRIFUGAL_SUPERCHARGER';
  targetBoostBar: number;
  intakeType: string;
  exhaustType: string;
  drivetrain: 'RWD' | 'FWD' | 'AWD' | '4WD';
}

export class DynoSimulationService {
  public static runDynoPull(config: DynoEngineConfig, vehicleId: string, vehicleName: string): DynoRunResult {
    const curve: DynoPoint[] = [];
    const rpmStep = 100;
    const startRpm = Math.max(1500, config.idleRpm + 500);
    const maxRpm = config.redlineRpm + 200;

    // Drivetrain loss factor
    let lossFactor = 0.12; // RWD 12%
    if (config.drivetrain === 'AWD' || config.drivetrain === '4WD') lossFactor = 0.18; // AWD 18%
    if (config.drivetrain === 'FWD') lossFactor = 0.10; // FWD 10%

    // ECU Stage multipliers
    let ecuMultiplier = 1.0;
    switch (config.ecuStage) {
      case 'STAGE_1': ecuMultiplier = 1.15; break;
      case 'STAGE_2': ecuMultiplier = 1.30; break;
      case 'STAGE_3': ecuMultiplier = 1.55; break;
      case 'PRO_CUSTOM_STANDALONE': ecuMultiplier = 1.80; break;
      default: ecuMultiplier = 1.0; break;
    }

    // Intake & exhaust airflow efficiency bonus
    let airflowBonus = 1.0;
    if (config.intakeType.includes('CARBON')) airflowBonus += 0.05;
    if (config.intakeType.includes('THROTTLE_BODIES')) airflowBonus += 0.10;
    if (config.exhaustType.includes('TITANIUM') || config.exhaustType.includes('STRAIGHT')) airflowBonus += 0.08;

    // Ignition timing bonus
    const timingDelta = config.ignitionTimingDegrees;
    const timingMultiplier = 1.0 + (timingDelta * 0.008);

    // AFR efficiency bell curve (Optimal ~12.5 for turbo, ~13.0 for NA)
    const targetOptimalAfr = config.forcedInductionType === 'NATURALLY_ASPIRATED' ? 13.0 : 12.2;
    const afrDelta = Math.abs(config.fuelAirTargetRatio - targetOptimalAfr);
    const afrEfficiency = Math.max(0.85, 1.0 - (afrDelta * 0.04));

    let maxHp = 0;
    let maxHpRpm = 0;
    let maxTorque = 0;
    let maxTorqueRpm = 0;
    let maxBoost = 0;

    for (let rpm = startRpm; rpm <= maxRpm; rpm += rpmStep) {
      // Volumetric efficiency curve (parabolic peak near 60% of redline)
      const rpmFraction = rpm / config.redlineRpm;
      let ve = Math.sin(rpmFraction * Math.PI * 0.85);
      if (ve < 0.2) ve = 0.2;

      // Boost calculation
      let currentBoost = 0;
      if (config.forcedInductionType.includes('TURBO')) {
        // Turbo spool curve (lag below 3000 RPM)
        const spoolFraction = Math.min(1.0, Math.max(0.0, (rpm - 2200) / 1800));
        currentBoost = config.targetBoostBar * Math.pow(spoolFraction, 1.8);
      } else if (config.forcedInductionType.includes('SUPERCHARGER')) {
        // Linear mechanical boost with RPM
        currentBoost = config.targetBoostBar * (rpm / config.redlineRpm);
      }

      const boostDensityFactor = 1.0 + (currentBoost * 0.95);

      // Torque in Newton-meters (Nm)
      const torqueNm = config.baseTorqueNm *
        ve *
        boostDensityFactor *
        ecuMultiplier *
        airflowBonus *
        timingMultiplier *
        afrEfficiency;

      // Horsepower from Torque: HP = (Torque_Nm * RPM) / 7127
      const engineHp = (torqueNm * rpm) / 7127;
      const wheelHp = engineHp * (1.0 - lossFactor);
      const wheelTorqueNm = torqueNm * (1.0 - lossFactor);

      // Exhaust Gas Temp (EGT)
      const egtC = 550 + (currentBoost * 120) + (rpmFraction * 200) - (config.fuelAirTargetRatio < 12.0 ? 50 : 0);

      if (engineHp > maxHp) {
        maxHp = Math.round(engineHp);
        maxHpRpm = rpm;
      }
      if (torqueNm > maxTorque) {
        maxTorque = Math.round(torqueNm);
        maxTorqueRpm = rpm;
      }
      if (currentBoost > maxBoost) {
        maxBoost = Number(currentBoost.toFixed(2));
      }

      curve.push({
        rpm,
        engineHp: Math.round(engineHp * 10) / 10,
        wheelHp: Math.round(wheelHp * 10) / 10,
        engineTorqueNm: Math.round(torqueNm * 10) / 10,
        wheelTorqueNm: Math.round(wheelTorqueNm * 10) / 10,
        boostBar: Math.round(currentBoost * 100) / 100,
        afr: Math.round(config.fuelAirTargetRatio * 10) / 10,
        exhaustGasTempC: Math.round(egtC),
      });
    }

    return {
      vehicleId,
      vehicleName,
      maxEngineHp: maxHp,
      maxEngineHpRpm: maxHpRpm,
      maxWheelHp: Math.round(maxHp * (1.0 - lossFactor)),
      maxTorqueNm: maxTorque,
      maxTorqueRpm: maxTorqueRpm,
      maxBoostBar: maxBoost,
      drivetrainLossPct: Math.round(lossFactor * 100),
      ambientTempC: 22,
      airPressureHpa: 1013.25,
      curve,
      testedAt: new Date().toISOString(),
    };
  }
}
