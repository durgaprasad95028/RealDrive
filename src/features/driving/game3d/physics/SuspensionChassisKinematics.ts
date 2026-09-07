export interface SuspensionCornerConfig {
  springRateNPerM: number; // e.g. 55000 N/m
  bumpDamperNPerMS: number; // Compression damping
  reboundDamperNPerMS: number; // Rebound damping
  bumpStopTravelM: number; // Max travel before bump stop
  staticCamberDeg: number; // Static camber
  camberGainPerMeter: number; // Camber change per meter of compression
  antiRollBarStiffnessNPerM: number;
}

export interface SuspensionState {
  wheelIndex: number;
  suspensionTravelM: number; // 0 = fully extended, negative = compressed
  suspensionVelocityMS: number;
  springForceN: number;
  damperForceN: number;
  antiRollBarForceN: number;
  totalVerticalLoadN: number; // Normal force Fz
  dynamicCamberRad: number;
  isBottomedOut: boolean;
}

export interface ChassisKinematicsState {
  rollAngleRad: number;
  pitchAngleRad: number;
  rollVelocityRadS: number;
  pitchVelocityRadS: number;
  longitudinalAccelG: number;
  lateralAccelG: number;
  verticalAccelG: number;
  cornerLoadsN: [number, number, number, number]; // FL, FR, RL, RR
  suspensionCorners: [SuspensionState, SuspensionState, SuspensionState, SuspensionState];
}

export class SuspensionChassisKinematics {
  private frontConfig: SuspensionCornerConfig;
  private rearConfig: SuspensionCornerConfig;
  private vehicleMassKg: number;
  private centerOfGravityHeightM: number;
  private wheelbaseM: number;
  private trackWidthM: number;
  private weightDistributionFrontPct: number;

  private state: ChassisKinematicsState;

  constructor(
    massKg = 1450,
    frontWeightPct = 0.52,
    wheelbaseM = 2.75,
    trackWidthM = 1.62,
    cgHeightM = 0.48
  ) {
    this.vehicleMassKg = massKg;
    this.weightDistributionFrontPct = frontWeightPct;
    this.wheelbaseM = wheelbaseM;
    this.trackWidthM = trackWidthM;
    this.centerOfGravityHeightM = cgHeightM;

    // High performance sports suspension setup
    this.frontConfig = {
      springRateNPerM: 52000,
      bumpDamperNPerMS: 3800,
      reboundDamperNPerMS: 5400,
      bumpStopTravelM: 0.12,
      staticCamberDeg: -1.8,
      camberGainPerMeter: 12.0,
      antiRollBarStiffnessNPerM: 18000,
    };

    this.rearConfig = {
      springRateNPerM: 58000,
      bumpDamperNPerMS: 4100,
      reboundDamperNPerMS: 5800,
      bumpStopTravelM: 0.13,
      staticCamberDeg: -1.4,
      camberGainPerMeter: 9.5,
      antiRollBarStiffnessNPerM: 14000,
    };

    const staticFrontLoad = (this.vehicleMassKg * 9.81 * this.weightDistributionFrontPct) / 2;
    const staticRearLoad = (this.vehicleMassKg * 9.81 * (1.0 - this.weightDistributionFrontPct)) / 2;

    const dummyCorner = (idx: number, load: number): SuspensionState => ({
      wheelIndex: idx,
      suspensionTravelM: 0,
      suspensionVelocityMS: 0,
      springForceN: load,
      damperForceN: 0,
      antiRollBarForceN: 0,
      totalVerticalLoadN: load,
      dynamicCamberRad: ((idx < 2 ? this.frontConfig.staticCamberDeg : this.rearConfig.staticCamberDeg) * Math.PI) / 180,
      isBottomedOut: false,
    });

    this.state = {
      rollAngleRad: 0,
      pitchAngleRad: 0,
      rollVelocityRadS: 0,
      pitchVelocityRadS: 0,
      longitudinalAccelG: 0,
      lateralAccelG: 0,
      verticalAccelG: 1.0,
      cornerLoadsN: [staticFrontLoad, staticFrontLoad, staticRearLoad, staticRearLoad],
      suspensionCorners: [
        dummyCorner(0, staticFrontLoad),
        dummyCorner(1, staticFrontLoad),
        dummyCorner(2, staticRearLoad),
        dummyCorner(3, staticRearLoad),
      ],
    };
  }

  /**
   * Updates chassis roll, pitch, and computes 4-corner vertical load transfer (Fz).
   */
  public update(
    longitudinalAccelMS2: number,
    lateralAccelMS2: number,
    dtSec: number
  ): ChassisKinematicsState {
    this.state.longitudinalAccelG = longitudinalAccelMS2 / 9.81;
    this.state.lateralAccelG = lateralAccelMS2 / 9.81;

    const totalWeightN = this.vehicleMassKg * 9.81;
    const staticFrontCornerN = (totalWeightN * this.weightDistributionFrontPct) / 2;
    const staticRearCornerN = (totalWeightN * (1.0 - this.weightDistributionFrontPct)) / 2;

    // 1. Longitudinal Load Transfer (Braking Dive & Acceleration Squat)
    // Delta_Fz_long = (Mass * a_x * h_cg) / Wheelbase
    const deltaFzLongitudinal = (this.vehicleMassKg * longitudinalAccelMS2 * this.centerOfGravityHeightM) / this.wheelbaseM;

    // 2. Lateral Load Transfer (Cornering Body Roll)
    // Delta_Fz_lat = (Mass * a_y * h_cg) / TrackWidth
    const deltaFzLateral = (this.vehicleMassKg * lateralAccelMS2 * this.centerOfGravityHeightM) / this.trackWidthM;

    // Front / Rear roll stiffness distribution (e.g. 55% front, 45% rear)
    const frontRollStiffnessRatio = 0.55;
    const frontLatTransfer = (deltaFzLateral * frontRollStiffnessRatio) / 2;
    const rearLatTransfer = (deltaFzLateral * (1.0 - frontRollStiffnessRatio)) / 2;

    const longTransferPerSide = deltaFzLongitudinal / 2;

    // 3. Four Corner Dynamic Normal Loads (FL, FR, RL, RR)
    // FL: StaticFront - LongTransfer - FrontLatTransfer
    // FR: StaticFront - LongTransfer + FrontLatTransfer
    // RL: StaticRear + LongTransfer - RearLatTransfer
    // RR: StaticRear + LongTransfer + RearLatTransfer
    const flLoad = Math.max(50, staticFrontCornerN - longTransferPerSide - frontLatTransfer);
    const frLoad = Math.max(50, staticFrontCornerN - longTransferPerSide + frontLatTransfer);
    const rlLoad = Math.max(50, staticRearCornerN + longTransferPerSide - rearLatTransfer);
    const rrLoad = Math.max(50, staticRearCornerN + longTransferPerSide + rearLatTransfer);

    this.state.cornerLoadsN = [flLoad, frLoad, rlLoad, rrLoad];

    // 4. Update Suspension Displacements and Damper Forces
    this.updateCornerSuspension(0, flLoad, this.frontConfig, dtSec);
    this.updateCornerSuspension(1, frLoad, this.frontConfig, dtSec);
    this.updateCornerSuspension(2, rlLoad, this.rearConfig, dtSec);
    this.updateCornerSuspension(3, rrLoad, this.rearConfig, dtSec);

    // 5. Chassis Roll & Pitch Visual Angles
    const targetRoll = (-lateralAccelMS2 / (9.81 * 8.5)) * 0.085;
    const targetPitch = (longitudinalAccelMS2 / (9.81 * 10.0)) * 0.065;

    this.state.rollAngleRad += (targetRoll - this.state.rollAngleRad) * 12.0 * dtSec;
    this.state.pitchAngleRad += (targetPitch - this.state.pitchAngleRad) * 14.0 * dtSec;

    return { ...this.state };
  }

  private updateCornerSuspension(
    index: number,
    targetLoadN: number,
    cfg: SuspensionCornerConfig,
    dtSec: number
  ) {
    const corner = this.state.suspensionCorners[index];
    const prevTravel = corner.suspensionTravelM;

    // Spring displacement: delta_x = load / k
    const targetTravel = -targetLoadN / cfg.springRateNPerM;
    corner.suspensionTravelM += (targetTravel - corner.suspensionTravelM) * 15.0 * dtSec;

    // Velocity
    corner.suspensionVelocityMS = (corner.suspensionTravelM - prevTravel) / dtSec;

    // Damper force (Compression vs Rebound)
    const isCompressing = corner.suspensionVelocityMS < 0;
    const damperCoeff = isCompressing ? cfg.bumpDamperNPerMS : cfg.reboundDamperNPerMS;
    corner.damperForceN = -corner.suspensionVelocityMS * damperCoeff;

    corner.totalVerticalLoadN = targetLoadN;

    // Dynamic Camber gain with compression
    const staticCamberRad = (cfg.staticCamberDeg * Math.PI) / 180;
    const camberDeltaRad = (corner.suspensionTravelM * cfg.camberGainPerMeter * Math.PI) / 180;
    corner.dynamicCamberRad = staticCamberRad - camberDeltaRad;

    corner.isBottomedOut = Math.abs(corner.suspensionTravelM) >= cfg.bumpStopTravelM;
  }

  public getState(): ChassisKinematicsState {
    return { ...this.state };
  }
}
