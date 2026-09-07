/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - ELECTRONIC STABILITY CONTROL (ESC) & TORQUE VECTORING
 * ============================================================================
 * High-performance active chassis dynamics controller featuring:
 * 1. Reference Bicycle Model dynamic yaw-rate target calculator.
 * 2. Sideslip angle (Beta) and yaw acceleration error observers.
 * 3. Differential single-wheel asymmetric braking intervention.
 * 4. Electronic Torque Vectoring (e-LSD) dynamic torque bias allocation.
 * 5. Multi-stage Traction Control (TCS) engine spark cut & throttle reduction.
 * 6. 6 Switchable ESC calibration driving modes (Comfort to Drift/Pro-Off).
 */

export type EscDriveMode = 
  | 'comfort_commute'
  | 'dynamic_sport'
  | 'sport_plus'
  | 'track_competition'
  | 'drift_mode'
  | 'esc_fully_disabled';

export interface EscChassisConstants {
  readonly wheelbaseM: number;
  readonly trackWidthFrontM: number;
  readonly trackWidthRearM: number;
  readonly vehicleMassKg: number;
  readonly yawMomentOfInertiaIzzKgM2: number;
  readonly understeerGradientRadPerMps2: number; // K_us (positive = natural understeer)
  readonly frontCorneringStiffnessNPerRad: number;
  readonly rearCorneringStiffnessNPerRad: number;
}

export interface EscDriveModeProfile {
  readonly mode: EscDriveMode;
  readonly allowableYawErrorRadPerSec: number;
  readonly allowableSideslipBetaRad: number;
  readonly countersteerYawGain: number;
  readonly maxBrakeInterventionPressureBar: number;
  readonly maxThrottleCutPercent: number;
  readonly torqueVectoringAggressiveness: number; // 0.0 to 1.0
  readonly driftAngleTargetRad: number;
  readonly enableRearAxleDriftSlip: boolean;
}

export interface EscSensorInputs {
  readonly steeringWheelAngleRad: number;
  readonly steeringRatio: number; // e.g. 14.5:1
  readonly actualYawRateRadPerSec: number;
  readonly vehicleSpeedMps: number;
  readonly lateralAccelerationMps2: number;
  readonly longitudinalAccelerationMps2: number;
  readonly wheelSlipRatios: [number, number, number, number]; // [FL, FR, RL, RR]
  readonly driverThrottlePercent: number; // 0.0 to 1.0
  readonly driverBrakePercent: number;    // 0.0 to 1.0
  readonly deltaTimeSec: number;
}

export interface EscControllerOutputs {
  readonly currentMode: EscDriveMode;
  readonly targetYawRateRadPerSec: number;
  readonly yawRateErrorRadPerSec: number;
  readonly estimatedSideslipBetaRad: number;
  readonly isUndersteering: boolean;
  readonly isOversteering: boolean;
  readonly isDriftAngleMaintained: boolean;
  readonly escBrakePressureDemandsBar: [number, number, number, number]; // [FL, FR, RL, RR]
  readonly finalThrottleMultiplier: number; // 0.0 (full cut) to 1.0 (no intervention)
  readonly leftRearTorqueVectorBiasPercent: number;  // 50% = equal
  readonly rightRearTorqueVectorBiasPercent: number; // 50% = equal
  readonly escWarningLampActive: boolean;
  readonly interventionSeverityScore: number;
}

// ============================================================================
// DRIVE MODE CALIBRATION MATRIX
// ============================================================================

export const ESC_MODE_PROFILES: Record<EscDriveMode, EscDriveModeProfile> = {
  'comfort_commute': {
    mode: 'comfort_commute',
    allowableYawErrorRadPerSec: 0.045, // Strict intervention
    allowableSideslipBetaRad: 0.035,   // ~2 degrees sideslip max
    countersteerYawGain: 1.85,
    maxBrakeInterventionPressureBar: 75.0,
    maxThrottleCutPercent: 0.85,
    torqueVectoringAggressiveness: 0.30,
    driftAngleTargetRad: 0.0,
    enableRearAxleDriftSlip: false
  },

  'dynamic_sport': {
    mode: 'dynamic_sport',
    allowableYawErrorRadPerSec: 0.085,
    allowableSideslipBetaRad: 0.075,   // ~4.3 degrees
    countersteerYawGain: 1.40,
    maxBrakeInterventionPressureBar: 55.0,
    maxThrottleCutPercent: 0.60,
    torqueVectoringAggressiveness: 0.65,
    driftAngleTargetRad: 0.0,
    enableRearAxleDriftSlip: false
  },

  'sport_plus': {
    mode: 'sport_plus',
    allowableYawErrorRadPerSec: 0.140,
    allowableSideslipBetaRad: 0.120,   // ~6.9 degrees
    countersteerYawGain: 1.10,
    maxBrakeInterventionPressureBar: 40.0,
    maxThrottleCutPercent: 0.35,
    torqueVectoringAggressiveness: 0.85,
    driftAngleTargetRad: 0.0,
    enableRearAxleDriftSlip: true
  },

  'track_competition': {
    mode: 'track_competition',
    allowableYawErrorRadPerSec: 0.220,
    allowableSideslipBetaRad: 0.180,   // ~10.3 degrees
    countersteerYawGain: 0.80,
    maxBrakeInterventionPressureBar: 28.0,
    maxThrottleCutPercent: 0.15,
    torqueVectoringAggressiveness: 1.0, // Maximum agility torque vectoring
    driftAngleTargetRad: 0.0,
    enableRearAxleDriftSlip: true
  },

  'drift_mode': {
    mode: 'drift_mode',
    allowableYawErrorRadPerSec: 0.450,
    allowableSideslipBetaRad: 0.520,   // ~30 degrees drift angle!
    countersteerYawGain: 0.40,
    maxBrakeInterventionPressureBar: 18.0,
    maxThrottleCutPercent: 0.05,       // Almost never cut power in drift
    torqueVectoringAggressiveness: 0.95,
    driftAngleTargetRad: 0.380,        // Target ~22 deg controlled slip
    enableRearAxleDriftSlip: true
  },

  'esc_fully_disabled': {
    mode: 'esc_fully_disabled',
    allowableYawErrorRadPerSec: 99.0,
    allowableSideslipBetaRad: 99.0,
    countersteerYawGain: 0.0,
    maxBrakeInterventionPressureBar: 0.0,
    maxThrottleCutPercent: 0.0,
    torqueVectoringAggressiveness: 0.50, // Mechanical LSD only
    driftAngleTargetRad: 0.0,
    enableRearAxleDriftSlip: true
  }
};

// ============================================================================
// ESC LOGIC CONTROLLER
// ============================================================================

export class ElectronicStabilityControlAlgorithm {
  /**
   * Reference Bicycle Model: Computes theoretical neutral yaw rate target
   * \psi_ref = (v * \delta) / (L * (1 + K_us * v^2))
   */
  public static calculateTargetYawRate(
    frontWheelSteerAngleRad: number,
    speedMps: number,
    chassis: EscChassisConstants
  ): number {
    if (speedMps < 0.5) return 0;

    const denominator = chassis.wheelbaseM * (1.0 + chassis.understeerGradientRadPerMps2 * Math.pow(speedMps, 2));
    const targetYaw = (speedMps * frontWheelSteerAngleRad) / Math.max(0.1, denominator);

    // Dynamic physical saturation limit based on tire grip: max_yaw = (mu * g) / v
    const maxYawRateFromGrip = (1.2 * 9.80665) / speedMps;
    return Math.max(-maxYawRateFromGrip, Math.min(maxYawRateFromGrip, targetYaw));
  }

  /**
   * Estimate vehicle sideslip angle (Beta) via kinematics integration:
   * \dot{\beta} = (a_lat / v) - \psi_actual
   */
  public static estimateSideslipBeta(
    lateralAccMps2: number,
    speedMps: number,
    actualYawRateRadPerSec: number
  ): number {
    if (speedMps < 1.0) return 0;
    const betaKinematic = (lateralAccMps2 / speedMps) - actualYawRateRadPerSec;
    return Math.max(-0.65, Math.min(0.65, betaKinematic * 0.15)); // Filtered estimate
  }

  /**
   * Execute 1-cycle ESC dynamic arbitration
   */
  public static processEscStep(
    chassis: EscChassisConstants,
    mode: EscDriveMode,
    inputs: EscSensorInputs
  ): EscControllerOutputs {
    const profile = ESC_MODE_PROFILES[mode];
    const frontSteerRad = inputs.steeringWheelAngleRad / inputs.steeringRatio;

    // 1. Calculate Target Yaw Rate & Error
    const targetYawRate = this.calculateTargetYawRate(frontSteerRad, inputs.vehicleSpeedMps, chassis);
    const yawError = inputs.actualYawRateRadPerSec - targetYawRate;
    const estimatedBeta = this.estimateSideslipBeta(inputs.lateralAccelerationMps2, inputs.vehicleSpeedMps, inputs.actualYawRateRadPerSec);

    // 2. Identify Stability Regime (Oversteer vs Understeer)
    let isOversteer = false;
    let isUndersteer = false;
    let isDriftAngleMaintained = false;

    // Understeer: vehicle turns LESS than steering demand (yaw error opposite direction to steer angle)
    if (Math.sign(targetYawRate) !== 0 && Math.abs(targetYawRate) > Math.abs(inputs.actualYawRateRadPerSec) + profile.allowableYawErrorRadPerSec) {
      if (Math.sign(inputs.actualYawRateRadPerSec) === Math.sign(targetYawRate)) {
        isUndersteer = true;
      }
    }

    // Oversteer: vehicle turns MORE than intended or rear breaks away
    if (Math.abs(yawError) > profile.allowableYawErrorRadPerSec || Math.abs(estimatedBeta) > profile.allowableSideslipBetaRad) {
      if (Math.sign(yawError) === Math.sign(inputs.actualYawRateRadPerSec)) {
        isOversteer = true;
      }
    }

    // Special handling in Drift Mode
    if (mode === 'drift_mode') {
      if (Math.abs(estimatedBeta) >= profile.driftAngleTargetRad * 0.70) {
        isDriftAngleMaintained = true;
        // Suppress oversteer intervention if within safe drift envelope
        if (Math.abs(estimatedBeta) < profile.allowableSideslipBetaRad) {
          isOversteer = false;
        }
      }
    }

    // 3. Differential Asymmetric Brake Intervention Demands
    // Format: [FL, FR, RL, RR]
    const brakeDemands: [number, number, number, number] = [0, 0, 0, 0];
    let throttleMultiplier = 1.0;
    let interventionSeverity = 0.0;

    if (mode !== 'esc_fully_disabled' && inputs.vehicleSpeedMps > 3.0) {
      if (isOversteer) {
        // OVERSTEER CORRECTION:
        // Brake outside front wheel to generate restoring yaw moment away from spin
        const excessYaw = Math.abs(yawError) - profile.allowableYawErrorRadPerSec;
        const brakePressure = Math.min(profile.maxBrakeInterventionPressureBar, excessYaw * profile.countersteerYawGain * 45.0);

        if (inputs.actualYawRateRadPerSec > 0) {
          // Turning left & spinning left -> Brake Front-Right (FR = index 1)
          brakeDemands[1] = brakePressure;
        } else {
          // Turning right & spinning right -> Brake Front-Left (FL = index 0)
          brakeDemands[0] = brakePressure;
        }

        // Cut engine torque to prevent power-induced spin
        const cutFactor = Math.min(profile.maxThrottleCutPercent, excessYaw * 1.5);
        throttleMultiplier = Math.max(0.0, 1.0 - cutFactor);
        interventionSeverity = brakePressure / profile.maxBrakeInterventionPressureBar;
      } else if (isUndersteer) {
        // UNDERSTEER CORRECTION:
        // Brake inside rear wheel to induce turn-in rotation moment
        const deficitYaw = Math.abs(targetYawRate) - Math.abs(inputs.actualYawRateRadPerSec);
        const brakePressure = Math.min(profile.maxBrakeInterventionPressureBar * 0.65, deficitYaw * 25.0);

        if (targetYawRate > 0) {
          // Steering left -> Brake Rear-Left (RL = index 2)
          brakeDemands[2] = brakePressure;
        } else {
          // Steering right -> Brake Rear-Right (RR = index 3)
          brakeDemands[3] = brakePressure;
        }

        // Moderate throttle cut during severe push understeer
        if (deficitYaw > 0.15) {
          throttleMultiplier = Math.max(0.40, 1.0 - (deficitYaw * 0.8));
        }
        interventionSeverity = brakePressure / profile.maxBrakeInterventionPressureBar;
      }
    }

    // 4. Traction Control System (TCS) Wheelspin Limiter
    // Wheel Slip Ratios: [FL, FR, RL, RR] (Rear driven wheels RL=2, RR=3)
    const rearDriveWheelSlipMax = Math.max(inputs.wheelSlipRatios[2], inputs.wheelSlipRatios[3]);
    const maxAllowedSlip = (mode === 'drift_mode' || mode === 'track_competition') ? 0.35 : 0.12;

    if (mode !== 'esc_fully_disabled' && rearDriveWheelSlipMax > maxAllowedSlip && inputs.driverThrottlePercent > 0.1) {
      const excessSlip = rearDriveWheelSlipMax - maxAllowedSlip;
      const tcsThrottleCut = Math.min(profile.maxThrottleCutPercent, excessSlip * 3.5);
      throttleMultiplier = Math.min(throttleMultiplier, Math.max(0.15, 1.0 - tcsThrottleCut));
      interventionSeverity = Math.max(interventionSeverity, tcsThrottleCut);
    }

    // 5. Electronic Torque Vectoring Differential (e-LSD Bias)
    // Send more torque to outside rear wheel when turning into corner to boost agile rotation
    let leftRearBias = 50.0;
    let rightRearBias = 50.0;

    if (inputs.driverThrottlePercent > 0.05 && Math.abs(frontSteerRad) > 0.02) {
      const tvGain = profile.torqueVectoringAggressiveness * 35.0; // Up to +/-35% shift (85% outside / 15% inside)
      if (frontSteerRad > 0) {
        // Steering Left -> Boost Right Rear (outside)
        rightRearBias = Math.min(85.0, 50.0 + tvGain * Math.abs(frontSteerRad));
        leftRearBias = 100.0 - rightRearBias;
      } else {
        // Steering Right -> Boost Left Rear (outside)
        leftRearBias = Math.min(85.0, 50.0 + tvGain * Math.abs(frontSteerRad));
        rightRearBias = 100.0 - leftRearBias;
      }
    }

    const escWarningLampActive = interventionSeverity > 0.15;

    return {
      currentMode: mode,
      targetYawRateRadPerSec: targetYawRate,
      yawRateErrorRadPerSec: yawError,
      estimatedSideslipBetaRad: estimatedBeta,
      isUndersteering: isUndersteer,
      isOversteering: isOversteer,
      isDriftAngleMaintained,
      escBrakePressureDemandsBar: brakeDemands,
      finalThrottleMultiplier: throttleMultiplier,
      leftRearTorqueVectorBiasPercent: leftRearBias,
      rightRearTorqueVectorBiasPercent: rightRearBias,
      escWarningLampActive,
      interventionSeverityScore: interventionSeverity
    };
  }
}
