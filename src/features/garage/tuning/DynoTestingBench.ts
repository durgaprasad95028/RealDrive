/**
 * DynoTestingBench — High-Fidelity Chassis Dynamometer Simulation Engine
 * Simulates inertia roller dyno pulls, parasitic drivetrain drag, SAE J1349 atmospheric corrections, and sensor telemetry.
 */

export interface DynoAtmosphericConditions {
  ambientTempCelsius: number; // e.g. 25 C
  barometricPressureKPa: number; // e.g. 101.3 kPa
  relativeHumidityPercent: number; // e.g. 40%
}

export interface DynoDataPoint {
  rpm: number;
  wheelHorsepower: number;
  wheelTorqueNm: number;
  flywheelHorsepower: number;
  flywheelTorqueNm: number;
  boostPressurePsi: number;
  airFuelRatio: number;
  exhaustGasTempC: number;
  intakeAirTempC: number;
  knockVoltage: number;
  rollerSpeedKmh: number;
}

export interface DynoPullResult {
  vehicleId: string;
  vehicleName: string;
  gearUsed: number;
  gearRatio: number;
  finalDriveRatio: number;
  drivetrainEfficiency: number;
  peakWheelHorsepower: number;
  peakWheelHorsepowerRpm: number;
  peakWheelTorqueNm: number;
  peakWheelTorqueRpm: number;
  peakBoostPsi: number;
  saeCorrectionFactor: number;
  durationSeconds: number;
  curveData: DynoDataPoint[];
}

export class DynoTestingBench {
  /**
   * Calculates SAE J1349 atmospheric horsepower correction factor:
   * CF = 1.18 * (99.0 / P_dry) * sqrt((T_amb + 273) / 298) - 0.18
   */
  public static calculateSAECorrectionFactor(conditions: DynoAtmosphericConditions): number {
    const P_dry = conditions.barometricPressureKPa * 0.99; // dry air pressure estimate
    const T_kelvin = conditions.ambientTempCelsius + 273.15;
    const cf = 1.18 * (99.0 / P_dry) * Math.sqrt(T_kelvin / 298.15) - 0.18;
    return Math.max(0.85, Math.min(1.25, cf));
  }

  /**
   * Simulates a full chassis dynamometer pull from low RPM to engine redline
   */
  public static executeDynoPull(
    vehicleId: string,
    vehicleName: string,
    peakHp: number,
    peakHpRpm: number,
    peakTorqueNm: number,
    peakTorqueRpm: number,
    redlineRpm: number,
    idleRpm: number,
    drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD',
    isTurbocharged: boolean,
    targetBoostPsi: number = 14.5,
    conditions: DynoAtmosphericConditions = {
      ambientTempCelsius: 22,
      barometricPressureKPa: 101.3,
      relativeHumidityPercent: 45,
    }
  ): DynoPullResult {
    // Determine drivetrain parasitic mechanical efficiency
    let drivetrainEfficiency = 0.86; // RWD ~14% loss
    if (drivetrain === 'FWD') drivetrainEfficiency = 0.89; // FWD ~11% loss
    else if (drivetrain === 'AWD' || drivetrain === '4WD') drivetrainEfficiency = 0.81; // AWD ~19% loss

    const saeCF = this.calculateSAECorrectionFactor(conditions);

    const gearUsed = 4; // 4th gear 1:1 direct drive approximation
    const gearRatio = 1.18;
    const finalDriveRatio = 3.73;

    const startRpm = Math.max(2000, idleRpm + 1000);
    const stepRpm = 100;
    const curveData: DynoDataPoint[] = [];

    let maxWhp = 0;
    let maxWhpRpm = 0;
    let maxWtq = 0;
    let maxWtqRpm = 0;
    let maxBoost = 0;

    for (let rpm = startRpm; rpm <= redlineRpm; rpm += stepRpm) {
      // 1. Calculate Torque at this RPM using a modified bell-curve torque profile
      const rpmFraction = (rpm - startRpm) / (redlineRpm - startRpm);

      // Torque shape: builds up, peaks around peakTorqueRpm, then tapers off near redline
      const torqueSpread = (redlineRpm - startRpm) * 0.45;
      const torqueDist = Math.abs(rpm - peakTorqueRpm);
      const torqueFalloff = Math.exp(-Math.pow(torqueDist / torqueSpread, 2));

      const flywheelTorque = peakTorqueNm * (0.65 + 0.35 * torqueFalloff);
      // Horsepower: HP = (Torque_Nm * RPM) / 7127
      const flywheelHp = (flywheelTorque * rpm) / 7127;

      // Wheel values with parasitic drivetrain loss & atmospheric SAE factor
      const wheelTorque = flywheelTorque * drivetrainEfficiency * saeCF;
      const wheelHp = flywheelHp * drivetrainEfficiency * saeCF;

      // Boost pressure simulation (turbo spool curve)
      let boost = 0;
      if (isTurbocharged) {
        // Spool threshold ~ 2500 RPM, full boost by 3800 RPM
        const spoolT = Math.max(0, Math.min(1, (rpm - 2200) / 1600));
        boost = targetBoostPsi * Math.pow(spoolT, 1.8);
      }

      // Air-Fuel Ratio (AFR) Lambda simulation: 14.7 idle -> 11.8 rich at high boost/RPM
      const afr = isTurbocharged ? 14.2 - (boost / targetBoostPsi) * 2.4 : 14.5 - (rpm / redlineRpm) * 1.8;

      // Exhaust Gas Temperature: 450 C base -> up to 880 C at redline full boost
      const egt = 420 + (rpm / redlineRpm) * 380 + (isTurbocharged ? (boost / targetBoostPsi) * 110 : 0);

      // Intake Air Temp
      const iat = conditions.ambientTempCelsius + (isTurbocharged ? (boost / targetBoostPsi) * 28 : 5);

      // Knock sensor voltage
      const knock = 0.05 + Math.random() * 0.08 + (afr > 13.0 && boost > 10 ? 0.35 : 0);

      // Roller wheel speed (km/h)
      const wheelRadiusM = 0.33;
      const totalRatio = gearRatio * finalDriveRatio;
      const wheelRps = rpm / (60 * totalRatio);
      const rollerSpeed = wheelRps * 2 * Math.PI * wheelRadiusM * 3.6;

      if (wheelHp > maxWhp) {
        maxWhp = wheelHp;
        maxWhpRpm = rpm;
      }
      if (wheelTorque > maxWtq) {
        maxWtq = wheelTorque;
        maxWtqRpm = rpm;
      }
      if (boost > maxBoost) {
        maxBoost = boost;
      }

      curveData.push({
        rpm,
        wheelHorsepower: Math.round(wheelHp * 10) / 10,
        wheelTorqueNm: Math.round(wheelTorque * 10) / 10,
        flywheelHorsepower: Math.round(flywheelHp * 10) / 10,
        flywheelTorqueNm: Math.round(flywheelTorque * 10) / 10,
        boostPressurePsi: Math.round(boost * 10) / 10,
        airFuelRatio: Math.round(afr * 100) / 100,
        exhaustGasTempC: Math.round(egt),
        intakeAirTempC: Math.round(iat),
        knockVoltage: Math.round(knock * 1000) / 1000,
        rollerSpeedKmh: Math.round(rollerSpeed * 10) / 10,
      });
    }

    const durationSeconds = (redlineRpm - startRpm) / 650; // ~8-12 seconds dyno pull

    return {
      vehicleId,
      vehicleName,
      gearUsed,
      gearRatio,
      finalDriveRatio,
      drivetrainEfficiency,
      peakWheelHorsepower: Math.round(maxWhp * 10) / 10,
      peakWheelHorsepowerRpm: maxWhpRpm,
      peakWheelTorqueNm: Math.round(maxWtq * 10) / 10,
      peakWheelTorqueRpm: maxWtqRpm,
      peakBoostPsi: Math.round(maxBoost * 10) / 10,
      saeCorrectionFactor: Math.round(saeCF * 1000) / 1000,
      durationSeconds: Math.round(durationSeconds * 10) / 10,
      curveData,
    };
  }
}
