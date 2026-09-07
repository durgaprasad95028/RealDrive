export type TireCompoundType = 
  | 'ECO_ALL_SEASON' 
  | 'SPORT_TOURING' 
  | 'SEMI_SLICK_TRACK' 
  | 'FULL_RACING_SLICK' 
  | 'OFF_ROAD_MUD_TERRAIN' 
  | 'WINTER_SNOW_STUDDED';

export interface TireThermalState {
  innerTempC: number;
  middleTempC: number;
  outerTempC: number;
  coreTempC: number;
  pressurePsi: number;
  wearPercent: number; // 0 = brand new, 100 = bald/blown
  isBlown: boolean;
}

export interface PacejkaCoefficients {
  // Longitudinal (Fx)
  B_long: number; // Stiffness factor
  C_long: number; // Shape factor
  D_long: number; // Peak friction factor
  E_long: number; // Curvature factor
  // Lateral (Fy)
  B_lat: number;
  C_lat: number;
  D_lat: number;
  E_lat: number;
  // Camber (Fy_gamma)
  CamberStiffness: number;
  // Load Sensitivity
  LoadSensitivityFactor: number;
  OptimalPressurePsi: number;
  OptimalTempC: number;
}

export interface WheelSlipState {
  wheelIndex: number; // 0: Front-Left, 1: Front-Right, 2: Rear-Left, 3: Rear-Right
  angularVelocityRadS: number; // Wheel spin speed (rad/s)
  longitudinalSpeedMS: number; // Hub forward speed (m/s)
  lateralSpeedMS: number; // Hub lateral sliding speed (m/s)
  steerAngleRad: number;
  camberAngleRad: number;
  normalLoadN: number; // Vertical load (Fz in Newtons)
  roadSurfaceGrip: number;
  isHydroplaning: boolean;
}

export interface TireForceResult {
  longitudinalForceN: number; // Fx (Drive / Braking grip)
  lateralForceN: number; // Fy (Cornering grip)
  aligningTorqueNm: number; // Mz (Self-aligning torque for force-feedback)
  longitudinalSlipRatio: number; // Sx (-1 to +1+)
  lateralSlipAngleRad: number; // Alpha (-pi/2 to +pi/2)
  effectiveGripCoefficient: number;
  heatGeneratedJoules: number;
}

export class PacejkaTireModel {
  private compound: TireCompoundType;
  private coeffs: PacejkaCoefficients;
  private thermal: TireThermalState;

  constructor(compound: TireCompoundType = 'SPORT_TOURING', initialPressurePsi = 32.0) {
    this.compound = compound;
    this.coeffs = this.getCoefficientsForCompound(compound);
    this.thermal = {
      innerTempC: 30.0,
      middleTempC: 30.0,
      outerTempC: 30.0,
      coreTempC: 30.0,
      pressurePsi: initialPressurePsi,
      wearPercent: 0.0,
      isBlown: false,
    };
  }

  private getCoefficientsForCompound(compound: TireCompoundType): PacejkaCoefficients {
    switch (compound) {
      case 'ECO_ALL_SEASON':
        return {
          B_long: 8.5, C_long: 1.45, D_long: 0.95, E_long: -0.8,
          B_lat: 8.0, C_lat: 1.30, D_lat: 0.90, E_lat: -1.0,
          CamberStiffness: 0.08, LoadSensitivityFactor: 0.00008,
          OptimalPressurePsi: 34, OptimalTempC: 65,
        };
      case 'SPORT_TOURING':
        return {
          B_long: 10.0, C_long: 1.65, D_long: 1.15, E_long: -0.6,
          B_lat: 9.5, C_lat: 1.45, D_lat: 1.10, E_lat: -0.85,
          CamberStiffness: 0.12, LoadSensitivityFactor: 0.00007,
          OptimalPressurePsi: 32, OptimalTempC: 80,
        };
      case 'SEMI_SLICK_TRACK':
        return {
          B_long: 12.0, C_long: 1.80, D_long: 1.35, E_long: -0.4,
          B_lat: 11.5, C_lat: 1.60, D_lat: 1.30, E_lat: -0.65,
          CamberStiffness: 0.18, LoadSensitivityFactor: 0.00006,
          OptimalPressurePsi: 29, OptimalTempC: 90,
        };
      case 'FULL_RACING_SLICK':
        return {
          B_long: 14.5, C_long: 1.95, D_long: 1.60, E_long: -0.2,
          B_lat: 13.8, C_lat: 1.75, D_lat: 1.55, E_lat: -0.45,
          CamberStiffness: 0.22, LoadSensitivityFactor: 0.00005,
          OptimalPressurePsi: 27, OptimalTempC: 100,
        };
      case 'OFF_ROAD_MUD_TERRAIN':
        return {
          B_long: 7.0, C_long: 1.35, D_long: 0.88, E_long: -1.1,
          B_lat: 6.8, C_lat: 1.25, D_lat: 0.82, E_lat: -1.2,
          CamberStiffness: 0.05, LoadSensitivityFactor: 0.00010,
          OptimalPressurePsi: 24, OptimalTempC: 55,
        };
      case 'WINTER_SNOW_STUDDED':
        return {
          B_long: 8.0, C_long: 1.40, D_long: 0.92, E_long: -0.9,
          B_lat: 7.5, C_lat: 1.32, D_lat: 0.86, E_lat: -1.05,
          CamberStiffness: 0.07, LoadSensitivityFactor: 0.00009,
          OptimalPressurePsi: 32, OptimalTempC: 45,
        };
    }
  }

  /**
   * Calculates instantaneous tire forces (Fx, Fy, Mz) using Pacejka Magic Formula curves.
   */
  public calculateForces(state: WheelSlipState, dtSec: number): TireForceResult {
    if (this.thermal.isBlown || state.normalLoadN <= 10) {
      return {
        longitudinalForceN: 0,
        lateralForceN: 0,
        aligningTorqueNm: 0,
        longitudinalSlipRatio: 0,
        lateralSlipAngleRad: 0,
        effectiveGripCoefficient: 0.15,
        heatGeneratedJoules: 0,
      };
    }

    const wheelRadiusM = 0.33; // Standard 18-19" tire outer radius
    const wheelLinearSpeedMS = state.angularVelocityRadS * wheelRadiusM;
    const vX = Math.max(0.1, Math.abs(state.longitudinalSpeedMS));

    // 1. Calculate Longitudinal Slip Ratio (Sx)
    let slipRatio = (wheelLinearSpeedMS - state.longitudinalSpeedMS) / vX;
    slipRatio = Math.max(-1.5, Math.min(1.5, slipRatio));

    // 2. Calculate Lateral Slip Angle (Alpha)
    const lateralSpeed = state.lateralSpeedMS;
    const slipAngleRad = Math.atan2(lateralSpeed, vX) - state.steerAngleRad;

    // 3. Load Sensitivity Reduction
    const nominalLoad = 4000; // 4000N per corner baseline
    const loadRatio = state.normalLoadN / nominalLoad;
    const loadGripCoeff = 1.0 - this.coeffs.LoadSensitivityFactor * (state.normalLoadN - nominalLoad);

    // 4. Thermal & Pressure Efficiency Curve
    const avgTemp = (this.thermal.innerTempC + this.thermal.middleTempC * 2 + this.thermal.outerTempC) / 4;
    const tempDelta = Math.abs(avgTemp - this.coeffs.OptimalTempC);
    const tempGripFactor = Math.max(0.65, 1.0 - (tempDelta / 80) ** 2);

    const pressureDelta = Math.abs(this.thermal.pressurePsi - this.coeffs.OptimalPressurePsi);
    const pressureGripFactor = Math.max(0.8, 1.0 - (pressureDelta / 20) * 0.15);

    // Base friction multiplier (incorporates compound, road surface, temperature, pressure, hydroplaning)
    let peakFriction = this.coeffs.D_long * state.roadSurfaceGrip * loadGripCoeff * tempGripFactor * pressureGripFactor;
    if (state.isHydroplaning) {
      peakFriction *= 0.35; // Severe grip drop when aquaplaning over puddles
    }

    // 5. Pacejka Magic Formula for Longitudinal Force (Fx)
    const B_x = this.coeffs.B_long;
    const C_x = this.coeffs.C_long;
    const D_x = peakFriction * state.normalLoadN;
    const E_x = this.coeffs.E_long;

    const BxSx = B_x * slipRatio;
    const fxBase = D_x * Math.sin(C_x * Math.atan(BxSx - E_x * (BxSx - Math.atan(BxSx))));

    // 6. Pacejka Magic Formula for Lateral Force (Fy)
    const B_y = this.coeffs.B_lat;
    const C_y = this.coeffs.C_lat;
    const D_y = this.coeffs.D_lat * state.roadSurfaceGrip * loadGripCoeff * tempGripFactor * state.normalLoadN;
    const E_y = this.coeffs.E_lat;

    const ByAlpha = B_y * slipAngleRad;
    let fyBase = D_y * Math.sin(C_y * Math.atan(ByAlpha - E_y * (ByAlpha - Math.atan(ByAlpha))));

    // Camber Thrust Force
    const camberForce = state.normalLoadN * this.coeffs.CamberStiffness * Math.sin(state.camberAngleRad);
    fyBase += camberForce;

    // 7. Friction Circle / Ellipse Coupling (Combined Slip Vector)
    // Ensures total force vector does not exceed maximum friction traction circle
    const maxAvailableForce = peakFriction * state.normalLoadN;
    const totalForceMag = Math.sqrt(fxBase ** 2 + fyBase ** 2);

    let fxFinal = fxBase;
    let fyFinal = fyBase;

    if (totalForceMag > maxAvailableForce && totalForceMag > 0.001) {
      const scale = maxAvailableForce / totalForceMag;
      fxFinal *= scale;
      fyFinal *= scale;
    }

    // 8. Self-Aligning Torque (Mz)
    const pneumaticTrail = 0.035 * (1.0 - Math.min(1.0, Math.abs(slipAngleRad) / 0.35));
    const aligningTorque = -fyFinal * pneumaticTrail;

    // 9. Tire Thermal Heating & Wear Update
    const slipSpeedMS = Math.sqrt((wheelLinearSpeedMS - state.longitudinalSpeedMS) ** 2 + lateralSpeed ** 2);
    const frictionWorkJoules = Math.abs(fxFinal * slipRatio + fyFinal * Math.sin(slipAngleRad)) * slipSpeedMS * dtSec;
    this.updateThermalAndWear(frictionWorkJoules, state.camberAngleRad, dtSec);

    return {
      longitudinalForceN: fxFinal,
      lateralForceN: fyFinal,
      aligningTorqueNm: aligningTorque,
      longitudinalSlipRatio: slipRatio,
      lateralSlipAngleRad: slipAngleRad,
      effectiveGripCoefficient: peakFriction,
      heatGeneratedJoules: frictionWorkJoules,
    };
  }

  private updateThermalAndWear(heatJoules: number, camberRad: number, dtSec: number) {
    const specificHeatCapacity = 1800; // J/(kg*K) rubber
    const treadMassKg = 2.5; // per thermal zone
    const deltaTemp = heatJoules / (specificHeatCapacity * treadMassKg);

    // Distribution across Inner, Middle, Outer ribs based on camber
    const innerWeight = Math.max(0.2, 0.33 - camberRad * 1.5);
    const outerWeight = Math.max(0.2, 0.33 + camberRad * 1.5);
    const middleWeight = 1.0 - (innerWeight + outerWeight);

    this.thermal.innerTempC += deltaTemp * innerWeight;
    this.thermal.middleTempC += deltaTemp * middleWeight;
    this.thermal.outerTempC += deltaTemp * outerWeight;

    // Cooling to ambient (30C)
    const coolingRate = 0.08 * dtSec;
    this.thermal.innerTempC = THREE_LERP(this.thermal.innerTempC, 30.0, coolingRate);
    this.thermal.middleTempC = THREE_LERP(this.thermal.middleTempC, 30.0, coolingRate);
    this.thermal.outerTempC = THREE_LERP(this.thermal.outerTempC, 30.0, coolingRate);

    // Pressure increases with heat (Ideal gas approximation)
    const avgTempC = (this.thermal.innerTempC + this.thermal.middleTempC + this.thermal.outerTempC) / 3;
    this.thermal.pressurePsi = this.coeffs.OptimalPressurePsi * (1.0 + ((avgTempC - 20) / 293) * 0.25);

    // Wear accumulation
    const wearRate = (heatJoules / 5000000) * 100;
    this.thermal.wearPercent = Math.min(100, this.thermal.wearPercent + wearRate);

    // Blowout trigger under extreme heat (> 150C) and high wear (> 95%)
    if (this.thermal.wearPercent >= 98 || avgTempC > 165) {
      this.thermal.isBlown = true;
    }
  }

  public getThermalState(): TireThermalState {
    return { ...this.thermal };
  }

  public repairAndInflate(targetPressurePsi = 32.0) {
    this.thermal = {
      innerTempC: 30.0,
      middleTempC: 30.0,
      outerTempC: 30.0,
      coreTempC: 30.0,
      pressurePsi: targetPressurePsi,
      wearPercent: 0.0,
      isBlown: false,
    };
  }
}

function THREE_LERP(start: number, end: number, t: number): number {
  return start + (end - start) * Math.min(1, Math.max(0, t));
}
