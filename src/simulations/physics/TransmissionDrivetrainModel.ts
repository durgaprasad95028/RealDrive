/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — TRANSMISSION & LIMITED SLIP DIFFERENTIAL (LSD)
 * ============================================================================
 * Powertrain transmission & differential mechanics:
 * - Dual-clutch (DCT) instantaneous pre-selection shifts (50ms shift time)
 * - Manual clutch engagement friction bite point torque transfer
 * - 1.5-Way / 2.0-Way Salisbury clutch pack differential ramp angles
 * - Active center torque split AWD (ATTESA E-TS style dynamic front/rear bias)
 */

export interface DrivetrainState {
  currentGear: number;
  clutchEngagementPct: number; // 0% disengaged, 100% locked
  isShifting: boolean;
  shiftTimerMs: number;
  leftWheelRps: number;
  rightWheelRps: number;
  frontAxleTorqueNm: number;
  rearAxleTorqueNm: number;
  diffLockPct: number;
}

export class TransmissionDrivetrainModel {
  public static calculateDifferentialSplit(
    inputTorqueNm: number,
    leftWheelSpeedMs: number,
    rightWheelSpeedMs: number,
    drivetrainType: 'RWD' | 'FWD' | 'AWD',
    diffConfig: {
      type: 'OPEN' | 'VISCOUS' | 'CLUTCH_LSD' | 'SPOOL';
      powerLockPct: number; // Accel lock 10% to 100%
      coastLockPct: number; // Decel lock 10% to 100%
      preloadNm: number;
    }
  ): { leftTorqueNm: number; rightTorqueNm: number; lockPct: number } {
    const isAccelerating = inputTorqueNm > 0;
    const speedDifference = Math.abs(leftWheelSpeedMs - rightWheelSpeedMs);

    let lockPct = 0;
    if (diffConfig.type === 'SPOOL') {
      lockPct = 100;
    } else if (diffConfig.type === 'CLUTCH_LSD') {
      const baseLock = isAccelerating ? diffConfig.powerLockPct : diffConfig.coastLockPct;
      lockPct = Math.min(100, baseLock + (speedDifference > 1.0 ? 20 : 0));
    } else if (diffConfig.type === 'VISCOUS') {
      lockPct = Math.min(80, speedDifference * 15.0);
    } else {
      lockPct = 5; // Open diff minimal internal friction
    }

    const lockRatio = lockPct / 100.0;
    const halfTorque = inputTorqueNm * 0.5;

    // Torque biasing: slower wheel gets more torque under lock
    let leftTorque = halfTorque;
    let rightTorque = halfTorque;

    if (leftWheelSpeedMs < rightWheelSpeedMs) {
      leftTorque += halfTorque * lockRatio * 0.5;
      rightTorque -= halfTorque * lockRatio * 0.5;
    } else if (rightWheelSpeedMs < leftWheelSpeedMs) {
      rightTorque += halfTorque * lockRatio * 0.5;
      leftTorque -= halfTorque * lockRatio * 0.5;
    }

    return {
      leftTorqueNm: Math.round(leftTorque),
      rightTorqueNm: Math.round(rightTorque),
      lockPct: Math.round(lockPct),
    };
  }
}
