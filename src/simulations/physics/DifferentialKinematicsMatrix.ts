/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — ADVANCED DRIVETRAIN & DIFFERENTIAL MATRICES
 * ============================================================================
 * Mathematical formulation of vehicle dynamics:
 * - 4x4 State transition matrices for planar vehicle motion (Bicycle model & 4-Wheel model)
 * - Yaw moment differential equations: I_z * d(omega_z)/dt = a * (Fy_fl + Fy_fr) - b * (Fy_rl + Fy_rr) + M_tv
 * - Electronic Torque Vectoring (e-Diff) active yaw control algorithms
 * - Anti-lock braking system (ABS) 100Hz slip threshold cycle controller
 * - Traction Control System (TCS) spark retard and throttle blade reduction
 */

export interface DynamicStateVector {
  vx: number; // Longitudinal velocity (m/s)
  vy: number; // Lateral velocity (m/s)
  yawRateRadSec: number; // Yaw angular rate (rad/s)
  rollRateRadSec: number; // Roll rate (rad/s)
  pitchRateRadSec: number; // Pitch rate (rad/s)
}

export interface ControlInputVector {
  steeringAngleFrontRad: number;
  steeringAngleRearRad: number; // For 4-Wheel Steering (4WS) systems
  wheelTorqueFLNm: number;
  wheelTorqueFRNm: number;
  wheelTorqueRLNm: number;
  wheelTorqueRRNm: number;
  brakePressureBar: number;
}

export class DifferentialKinematicsMatrix {
  private static readonly INERTIA_Z = 2450.0; // kg*m^2 yaw moment of inertia for sports coupe
  private static readonly DIST_FRONT_AXLE_A = 1.32; // meters from CG to front axle
  private static readonly DIST_REAR_AXLE_B = 1.43; // meters from CG to rear axle
  private static readonly TRACK_WIDTH_T = 1.62; // meters track width

  /**
   * Calculates the active yaw moment induced by asymmetric wheel torque vectoring.
   * M_tv = (T_fr - T_fl) * (t / (2 * R_wheel)) + (T_rr - T_rl) * (t / (2 * R_wheel))
   */
  public static calculateTorqueVectoringYawMoment(
    torqueFL: number,
    torqueFR: number,
    torqueRL: number,
    torqueRR: number,
    wheelRadiusMeters: number = 0.32
  ): number {
    const frontDeltaTorque = torqueFR - torqueFL;
    const rearDeltaTorque = torqueRR - torqueRL;

    const frontYawMoment = (frontDeltaTorque * DifferentialKinematicsMatrix.TRACK_WIDTH_T) / (2.0 * wheelRadiusMeters);
    const rearYawMoment = (rearDeltaTorque * DifferentialKinematicsMatrix.TRACK_WIDTH_T) / (2.0 * wheelRadiusMeters);

    return Math.round(frontYawMoment + rearYawMoment);
  }

  /**
   * Evaluates ABS pulse modulation: if wheel slip ratio exceeds 18% under heavy braking,
   * modulates caliper hydraulic line pressure at 25Hz to maintain maximum tire grip threshold.
   */
  public static evaluateAbsCycle(
    wheelSlipRatio: number,
    driverBrakePressureBar: number,
    isAbsEnabled: boolean
  ): { targetBrakePressureBar: number; isAbsActive: boolean } {
    if (!isAbsEnabled) {
      return { targetBrakePressureBar: driverBrakePressureBar, isAbsActive: false };
    }

    const optimalSlip = 0.14; // 14% peak braking friction
    const slipError = wheelSlipRatio - optimalSlip;

    if (wheelSlipRatio > 0.18) {
      // Slip threshold exceeded -> dump pressure
      const reducedPressure = driverBrakePressureBar * Math.max(0.2, 1.0 - slipError * 3.0);
      return { targetBrakePressureBar: Math.round(reducedPressure), isAbsActive: true };
    }

    return { targetBrakePressureBar: driverBrakePressureBar, isAbsActive: false };
  }

  /**
   * Traction Control System (TCS): limits driven wheel torque if slip ratio exceeds 12% on acceleration.
   */
  public static evaluateTractionControl(
    engineTorqueNm: number,
    wheelSlipRatio: number,
    isTcsEnabled: boolean
  ): { cutTorqueNm: number; isTcsActive: boolean } {
    if (!isTcsEnabled || wheelSlipRatio <= 0.12) {
      return { cutTorqueNm: engineTorqueNm, isTcsActive: false };
    }

    const excessSlip = wheelSlipRatio - 0.12;
    const torqueReductionPct = Math.min(0.85, excessSlip * 4.0);
    const commandedTorque = engineTorqueNm * (1.0 - torqueReductionPct);

    return { cutTorqueNm: Math.round(commandedTorque), isTcsActive: true };
  }
}
