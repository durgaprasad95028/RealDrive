export interface AerodynamicsSpecification {
  dragCoefficientCd: number; // e.g. 0.28 - 0.38
  frontalAreaM2: number; // e.g. 2.1 m^2
  frontLiftCoefficientCl: number; // Negative = downforce, e.g. -0.15
  rearLiftCoefficientCl: number; // Negative = downforce, e.g. -0.35
  airDensityKgM3: number; // 1.225 kg/m^3 at sea level
  hasActiveAeroWing: boolean;
  wingAngleOfAttackDeg: number;
}

export interface AerodynamicsState {
  dragForceN: number;
  frontDownforceN: number;
  rearDownforceN: number;
  totalDownforceN: number;
  slipstreamDraftingPct: number; // 0% = clean air, 40% = full draft
  crosswindSideForceN: number;
  crosswindYawTorqueNm: number;
}

export class AerodynamicsEngine {
  private spec: AerodynamicsSpecification;
  private state: AerodynamicsState;

  constructor(
    cd = 0.29,
    frontalArea = 2.15,
    frontCl = -0.12,
    rearCl = -0.32
  ) {
    this.spec = {
      dragCoefficientCd: cd,
      frontalAreaM2: frontalArea,
      frontLiftCoefficientCl: frontCl,
      rearLiftCoefficientCl: rearCl,
      airDensityKgM3: 1.225,
      hasActiveAeroWing: true,
      wingAngleOfAttackDeg: 8.0,
    };

    this.state = {
      dragForceN: 0,
      frontDownforceN: 0,
      rearDownforceN: 0,
      totalDownforceN: 0,
      slipstreamDraftingPct: 0,
      crosswindSideForceN: 0,
      crosswindYawTorqueNm: 0,
    };
  }

  /**
   * Updates aerodynamic forces given vehicle velocity and optional draft / crosswind inputs.
   */
  public update(
    forwardSpeedMS: number,
    distanceToCarAheadM: number | null = null,
    crosswindSpeedMS: number = 0
  ): AerodynamicsState {
    const v = Math.abs(forwardSpeedMS);
    const dynamicPressure = 0.5 * this.spec.airDensityKgM3 * (v ** 2);

    // 1. Slipstream Drafting Reduction
    let draftFactor = 1.0;
    this.state.slipstreamDraftingPct = 0;

    if (distanceToCarAheadM !== null && distanceToCarAheadM < 25.0 && distanceToCarAheadM > 1.5) {
      // Closer than 25m behind traffic: up to 35% drag reduction
      const proximity = 1.0 - (distanceToCarAheadM / 25.0);
      this.state.slipstreamDraftingPct = proximity * 0.35;
      draftFactor = 1.0 - this.state.slipstreamDraftingPct;
    }

    // 2. Aerodynamic Drag: F_drag = 0.5 * rho * Cd * A * v^2 * draftFactor
    this.state.dragForceN = dynamicPressure * this.spec.dragCoefficientCd * this.spec.frontalAreaM2 * draftFactor;

    // 3. Front Splitter Downforce: F_down_front = -0.5 * rho * Cl_f * A * v^2
    this.state.frontDownforceN = Math.abs(dynamicPressure * this.spec.frontLiftCoefficientCl * this.spec.frontalAreaM2);

    // 4. Rear Wing Downforce: F_down_rear = -0.5 * rho * Cl_r * A * v^2 * wingAngleFactor
    const wingFactor = 1.0 + (this.spec.wingAngleOfAttackDeg / 15.0) * 0.4;
    this.state.rearDownforceN = Math.abs(dynamicPressure * this.spec.rearLiftCoefficientCl * this.spec.frontalAreaM2 * wingFactor);

    this.state.totalDownforceN = this.state.frontDownforceN + this.state.rearDownforceN;

    // 5. Crosswind Disturbance
    if (Math.abs(crosswindSpeedMS) > 0.1) {
      const sideAreaM2 = 4.8; // Side profile area
      const crossPressure = 0.5 * this.spec.airDensityKgM3 * (crosswindSpeedMS ** 2);
      this.state.crosswindSideForceN = crossPressure * 0.75 * sideAreaM2 * Math.sign(crosswindSpeedMS);
      this.state.crosswindYawTorqueNm = this.state.crosswindSideForceN * 0.35; // Center of pressure offset
    } else {
      this.state.crosswindSideForceN = 0;
      this.state.crosswindYawTorqueNm = 0;
    }

    return { ...this.state };
  }

  public getState(): AerodynamicsState {
    return { ...this.state };
  }

  public setWingAngle(angleDeg: number) {
    this.spec.wingAngleOfAttackDeg = Math.max(0, Math.min(25, angleDeg));
  }
}
