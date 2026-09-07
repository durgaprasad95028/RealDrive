export type DrivetrainLayout = 'FWD' | 'RWD' | 'AWD_SYMMETRICAL' | 'AWD_REAR_BIASED' | 'EV_DIRECT_AWD';
export type TransmissionType = 'MANUAL_6SPEED' | 'DUAL_CLUTCH_7SPEED' | 'AUTOMATIC_8SPEED' | 'SINGLE_SPEED_EV';
export type DifferentialType = 'OPEN' | 'LIMITED_SLIP_1_5WAY' | 'LIMITED_SLIP_2WAY' | 'TORQUE_VECTORING_E_DIFF' | 'SPOOL_WELDED';

export interface TransmissionSpecification {
  layout: DrivetrainLayout;
  type: TransmissionType;
  differentialType: DifferentialType;
  gearRatios: number[]; // Index 0: Reverse, Index 1: 1st, 2: 2nd, etc.
  finalDriveRatio: number;
  shiftDurationSec: number;
  clutchCapacityNm: number;
  lsdLockingPercentPower: number; // 0% to 100%
  lsdLockingPercentCoast: number;
  awdFrontBiasPct: number; // e.g. 0.4 for 40% front, 60% rear
}

export interface DrivetrainState {
  currentGear: number; // -1 = Reverse, 0 = Neutral, 1 = 1st, 2 = 2nd...
  targetGear: number;
  isShifting: boolean;
  shiftTimer: number;
  clutchEngagementPct: number; // 0 = disengaged, 1 = fully locked
  clutchSlipSpeedRadS: number;
  driveshaftRpm: number;
  wheelTorquesNm: [number, number, number, number]; // FL, FR, RL, RR
  drivetrainEfficiency: number;
}

export class TransmissionDrivetrain {
  private spec: TransmissionSpecification;
  private state: DrivetrainState;

  constructor(layout: DrivetrainLayout = 'RWD', transType: TransmissionType = 'DUAL_CLUTCH_7SPEED') {
    this.spec = this.buildSpec(layout, transType);
    this.state = {
      currentGear: 1,
      targetGear: 1,
      isShifting: false,
      shiftTimer: 0,
      clutchEngagementPct: 1.0,
      clutchSlipSpeedRadS: 0,
      driveshaftRpm: 0,
      wheelTorquesNm: [0, 0, 0, 0],
      drivetrainEfficiency: 0.88,
    };
  }

  private buildSpec(layout: DrivetrainLayout, transType: TransmissionType): TransmissionSpecification {
    let gearRatios = [3.40, 3.82, 2.36, 1.68, 1.31, 1.00, 0.79]; // 6-speed baseline
    let shiftDuration = 0.25;
    let finalDrive = 3.73;

    if (transType === 'DUAL_CLUTCH_7SPEED') {
      gearRatios = [3.55, 3.92, 2.65, 1.95, 1.48, 1.18, 0.94, 0.76]; // 7-speed DCT
      shiftDuration = 0.08;
      finalDrive = 3.90;
    } else if (transType === 'AUTOMATIC_8SPEED') {
      gearRatios = [3.60, 4.71, 3.14, 2.10, 1.67, 1.28, 1.00, 0.84, 0.67]; // 8-speed ZF
      shiftDuration = 0.18;
      finalDrive = 3.42;
    } else if (transType === 'SINGLE_SPEED_EV') {
      gearRatios = [9.73, 9.73];
      shiftDuration = 0.0;
      finalDrive = 1.0;
    }

    const frontBias = layout === 'FWD' ? 1.0 : layout === 'RWD' ? 0.0 : layout === 'AWD_SYMMETRICAL' ? 0.5 : 0.35;

    return {
      layout,
      type: transType,
      differentialType: 'LIMITED_SLIP_1_5WAY',
      gearRatios,
      finalDriveRatio: finalDrive,
      shiftDurationSec: shiftDuration,
      clutchCapacityNm: 850,
      lsdLockingPercentPower: 0.65,
      lsdLockingPercentCoast: 0.35,
      awdFrontBiasPct: frontBias,
    };
  }

  /**
   * Shifts up to next gear.
   */
  public shiftUp(): boolean {
    const maxG = this.spec.gearRatios.length - 1;
    if (this.state.currentGear < maxG && !this.state.isShifting) {
      this.initiateShift(this.state.currentGear + 1);
      return true;
    }
    return false;
  }

  /**
   * Shifts down to previous gear.
   */
  public shiftDown(): boolean {
    if (this.state.currentGear > -1 && !this.state.isShifting) {
      this.initiateShift(this.state.currentGear - 1);
      return true;
    }
    return false;
  }

  public setGear(gear: number) {
    if (gear >= -1 && gear < this.spec.gearRatios.length && !this.state.isShifting) {
      this.initiateShift(gear);
    }
  }

  private initiateShift(targetG: number) {
    this.state.targetGear = targetG;
    this.state.isShifting = true;
    this.state.shiftTimer = this.spec.shiftDurationSec;
    this.state.clutchEngagementPct = 0.0; // Disengage clutch for shift
  }

  /**
   * Updates transmission shifts and distributes torque to the 4 wheels through the differentials.
   */
  public update(
    engineTorqueNm: number,
    engineRpm: number,
    wheelAngularVelocities: [number, number, number, number],
    dtSec: number
  ): DrivetrainState {
    // 1. Shift Timer Processing
    if (this.state.isShifting) {
      this.state.shiftTimer -= dtSec;
      if (this.state.shiftTimer <= 0) {
        this.state.currentGear = this.state.targetGear;
        this.state.isShifting = false;
        this.state.clutchEngagementPct = 1.0; // Re-engage clutch
      }
    }

    // 2. Compute Total Gear Ratio
    let gearRatio = 0;
    if (this.state.currentGear === -1) {
      gearRatio = -this.spec.gearRatios[0]; // Reverse
    } else if (this.state.currentGear > 0) {
      gearRatio = this.spec.gearRatios[this.state.currentGear];
    }

    const totalRatio = gearRatio * this.spec.finalDriveRatio;

    // 3. Compute Driveshaft Torque from Engine
    const effectiveClutchTorque = Math.min(
      Math.abs(engineTorqueNm),
      this.spec.clutchCapacityNm
    ) * Math.sign(engineTorqueNm) * this.state.clutchEngagementPct;

    const outputDriveshaftTorque = effectiveClutchTorque * totalRatio * this.state.drivetrainEfficiency;

    // 4. Differential Torque Distribution across 4 wheels
    // [0: FL, 1: FR, 2: RL, 3: RR]
    const [wFL, wFR, wRL, wRR] = wheelAngularVelocities;

    const frontTorqueTotal = outputDriveshaftTorque * this.spec.awdFrontBiasPct;
    const rearTorqueTotal = outputDriveshaftTorque * (1.0 - this.spec.awdFrontBiasPct);

    // Apply Limited Slip Differential (LSD) across Left and Right wheels
    const isPowering = engineTorqueNm > 0;
    const lsdLock = isPowering ? this.spec.lsdLockingPercentPower : this.spec.lsdLockingPercentCoast;

    // Front Diff
    const frontSpeedDiff = wFL - wFR;
    const frontLsdTorqueTransfer = frontSpeedDiff * 25.0 * lsdLock;
    const torqueFL = (frontTorqueTotal / 2) - frontLsdTorqueTransfer;
    const torqueFR = (frontTorqueTotal / 2) + frontLsdTorqueTransfer;

    // Rear Diff
    const rearSpeedDiff = wRL - wRR;
    const rearLsdTorqueTransfer = rearSpeedDiff * 35.0 * lsdLock;
    const torqueRL = (rearTorqueTotal / 2) - rearLsdTorqueTransfer;
    const torqueRR = (rearTorqueTotal / 2) + rearLsdTorqueTransfer;

    this.state.wheelTorquesNm = [torqueFL, torqueFR, torqueRL, torqueRR];

    // 5. Driveshaft RPM
    const avgDrivenWheelSpeed = this.spec.layout === 'FWD'
      ? (wFL + wFR) / 2
      : this.spec.layout === 'RWD'
      ? (wRL + wRR) / 2
      : (wFL + wFR + wRL + wRR) / 4;

    this.state.driveshaftRpm = Math.abs(avgDrivenWheelSpeed * totalRatio * (60 / (2 * Math.PI)));

    return { ...this.state };
  }

  public getState(): DrivetrainState {
    return { ...this.state };
  }

  public getSpecification(): TransmissionSpecification {
    return { ...this.spec };
  }
}
