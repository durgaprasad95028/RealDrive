/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - DYNO GRAPH GENERATOR & ENGINE SIMULATION SERVICE
 * ============================================================================
 * Dynamometer bench testing service simulating engine brake torque (Nm), brake
 * horsepower (BHP/WHP), Brake Mean Effective Pressure (BMEP), Volumetric
 * Efficiency (VE), Brake Specific Fuel Consumption (BSFC), and Turbo Boost Spool.
 */

export interface DynoPlotPoint {
  readonly rpm: number;
  readonly flywheelHorsepowerBhp: number;
  readonly wheelHorsepowerWhp: number;
  readonly flywheelTorqueNm: number;
  readonly wheelTorqueNm: number;
  readonly turboBoostPsi: number;
  readonly airFuelRatioAfr: number;
  readonly exhaustGasTempC: number;
  readonly volumetricEfficiencyPercent: number;
  readonly brakeMeanEffectivePressureBar: number;
}

export interface DynoRunSummary {
  readonly peakHorsepowerBhp: number;
  readonly peakHorsepowerRpm: number;
  readonly peakTorqueNm: number;
  readonly peakTorqueRpm: number;
  readonly peakBoostPsi: number;
  readonly redlineRpm: number;
  readonly drivetrainLossPercent: number;
  readonly estimatedQuarterMileSec: number;
  readonly plotData: readonly DynoPlotPoint[];
}

export class DynoGraphGeneratorService {
  private static instance: DynoGraphGeneratorService;

  private constructor() {}

  public static getInstance(): DynoGraphGeneratorService {
    if (!DynoGraphGeneratorService.instance) {
      DynoGraphGeneratorService.instance = new DynoGraphGeneratorService();
    }
    return DynoGraphGeneratorService.instance;
  }

  public runDynamometerPull(
    baseHp: number,
    baseTorque: number,
    maxRpm: number = 8500,
    turboBoostTargetPsi: number = 18.0,
    targetAirFuelRatio: number = 12.2,
    ignitionAdvanceDeg: number = 24.0,
    drivetrainLossPercent: number = 14.5
  ): DynoRunSummary {
    const plotData: DynoPlotPoint[] = [];
    const rpmStep = 250;
    const idleRpm = 1000;

    let peakHp = 0;
    let peakHpRpm = 0;
    let peakTorque = 0;
    let peakTorqueRpm = 0;
    let maxBoost = 0;

    const torquePeakRpm = Math.round(maxRpm * 0.58);
    const hpPeakRpm = Math.round(maxRpm * 0.82);

    for (let rpm = idleRpm; rpm <= maxRpm; rpm += rpmStep) {
      // 1. Boost spool curve (Turbo lag & threshold)
      const spoolThresholdRpm = maxRpm * 0.35;
      let currentBoost = 0;
      if (rpm >= spoolThresholdRpm) {
        const spoolRatio = Math.min(1.0, (rpm - spoolThresholdRpm) / (maxRpm * 0.20));
        currentBoost = turboBoostTargetPsi * Math.pow(spoolRatio, 1.5);
      }
      maxBoost = Math.max(maxBoost, currentBoost);

      // 2. Volumetric Efficiency Curve
      const rpmFraction = (rpm - idleRpm) / (maxRpm - idleRpm);
      const veBase = 82.0 + 26.0 * Math.sin(rpmFraction * Math.PI); // Naturally aspirated VE ~95-108%
      const veBoosted = veBase * (1.0 + (currentBoost / 14.7)); // Pressure ratio multiplier

      // 3. Engine Torque Calculation (Nm)
      // Gaussian torque shape around peak torque RPM
      const torqueSigma = maxRpm * 0.28;
      const gaussianTorque = Math.exp(-0.5 * Math.pow((rpm - torquePeakRpm) / torqueSigma, 2));
      
      // Ignition advance modifier (optimal ~26 deg)
      const ignitionEfficiency = 1.0 - Math.pow((ignitionAdvanceDeg - 26.0) / 20.0, 2) * 0.12;
      // AFR efficiency modifier (optimal rich power ~12.2:1)
      const afrEfficiency = 1.0 - Math.pow((targetAirFuelRatio - 12.2) / 4.0, 2) * 0.15;

      const flywheelTorque = baseTorque * (0.45 + 0.55 * gaussianTorque) * (1.0 + (currentBoost / 22.0)) * ignitionEfficiency * afrEfficiency;
      
      // 4. Flywheel & Wheel Horsepower: HP = (Torque_Nm * RPM) / 7127
      const flywheelHp = (flywheelTorque * rpm) / 7127.0;
      const wheelHp = flywheelHp * (1.0 - (drivetrainLossPercent / 100.0));
      const wheelTorque = flywheelTorque * (1.0 - (drivetrainLossPercent / 100.0));

      // 5. BMEP & Exhaust Gas Temp (EGT)
      const displacementLiters = 4.0;
      const bmepBar = (4.0 * Math.PI * flywheelTorque) / (displacementLiters * 100.0);
      const egt = 450.0 + (rpm / maxRpm) * 350.0 + (currentBoost * 8.5) - ((targetAirFuelRatio - 11.5) * 18.0);

      if (flywheelHp > peakHp) {
        peakHp = flywheelHp;
        peakHpRpm = rpm;
      }

      if (flywheelTorque > peakTorque) {
        peakTorque = flywheelTorque;
        peakTorqueRpm = rpm;
      }

      plotData.push({
        rpm,
        flywheelHorsepowerBhp: Math.round(flywheelHp * 10) / 10,
        wheelHorsepowerWhp: Math.round(wheelHp * 10) / 10,
        flywheelTorqueNm: Math.round(flywheelTorque * 10) / 10,
        wheelTorqueNm: Math.round(wheelTorque * 10) / 10,
        turboBoostPsi: Math.round(currentBoost * 10) / 10,
        airFuelRatioAfr: targetAirFuelRatio,
        exhaustGasTempC: Math.round(egt),
        volumetricEfficiencyPercent: Math.round(veBoosted * 10) / 10,
        brakeMeanEffectivePressureBar: Math.round(bmepBar * 10) / 10
      });
    }

    // 1/4 mile estimate formula (approximate ET from HP/mass ratio)
    const testMassKg = 1450.0;
    const quarterMileSec = Math.round(5.825 * Math.pow(testMassKg / peakHp, 0.333) * 100) / 100;

    return {
      peakHorsepowerBhp: Math.round(peakHp),
      peakHorsepowerRpm: peakHpRpm,
      peakTorqueNm: Math.round(peakTorque),
      peakTorqueRpm: peakTorqueRpm,
      peakBoostPsi: Math.round(maxBoost * 10) / 10,
      redlineRpm: maxRpm,
      drivetrainLossPercent,
      estimatedQuarterMileSec: quarterMileSec,
      plotData
    };
  }
}
