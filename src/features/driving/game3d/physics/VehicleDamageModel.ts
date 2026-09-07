export type ImpactZone = 'FRONT_BUMPER' | 'REAR_BUMPER' | 'LEFT_FLANK' | 'RIGHT_FLANK' | 'UNDERBODY_OIL_PAN' | 'ROOF_ROLLOVER';

export interface ComponentDamageState {
  overallHealthPct: number; // 0% to 100%
  frontBumperHealth: number;
  rearBumperHealth: number;
  leftPanelsHealth: number;
  rightPanelsHealth: number;
  windshieldHealth: number; // Shattered glass at 0%
  radiatorHealth: number; // Causes coolant leak when low
  engineBlockHealth: number;
  transmissionHealth: number;
  suspensionAlignmentHealth: number; // Causes steering pull
  brakePadsHealth: number;
  hasCoolantLeak: boolean;
  hasBrakeFluidLeak: boolean;
  steeringDriftOffsetRad: number; // Deviation angle
}

export class VehicleDamageModel {
  private state: ComponentDamageState;

  constructor() {
    this.state = {
      overallHealthPct: 100,
      frontBumperHealth: 100,
      rearBumperHealth: 100,
      leftPanelsHealth: 100,
      rightPanelsHealth: 100,
      windshieldHealth: 100,
      radiatorHealth: 100,
      engineBlockHealth: 100,
      transmissionHealth: 100,
      suspensionAlignmentHealth: 100,
      brakePadsHealth: 100,
      hasCoolantLeak: false,
      hasBrakeFluidLeak: false,
      steeringDriftOffsetRad: 0,
    };
  }

  /**
   * Applies an impact collision pulse to the vehicle.
   */
  public applyCollisionImpact(
    impactSpeedKmh: number,
    zone: ImpactZone
  ): { damageTaken: number; criticalFailure: string | null } {
    const energyMagnitude = (impactSpeedKmh / 120) ** 1.8;
    const baseDamage = Math.min(65, Math.max(3, energyMagnitude * 28));

    let failureReason: string | null = null;

    switch (zone) {
      case 'FRONT_BUMPER':
        this.state.frontBumperHealth = Math.max(0, this.state.frontBumperHealth - baseDamage * 1.2);
        this.state.radiatorHealth = Math.max(0, this.state.radiatorHealth - baseDamage * 0.9);
        this.state.windshieldHealth = Math.max(0, this.state.windshieldHealth - baseDamage * 0.4);
        
        if (this.state.radiatorHealth < 35) {
          this.state.hasCoolantLeak = true;
          failureReason = 'Radiator Punctured — Coolant Leaking';
        }
        if (baseDamage > 25) {
          this.state.suspensionAlignmentHealth = Math.max(0, this.state.suspensionAlignmentHealth - 30);
          this.state.steeringDriftOffsetRad = (Math.random() - 0.5) * 0.05;
        }
        break;

      case 'REAR_BUMPER':
        this.state.rearBumperHealth = Math.max(0, this.state.rearBumperHealth - baseDamage * 1.3);
        break;

      case 'LEFT_FLANK':
        this.state.leftPanelsHealth = Math.max(0, this.state.leftPanelsHealth - baseDamage);
        this.state.suspensionAlignmentHealth = Math.max(0, this.state.suspensionAlignmentHealth - baseDamage * 0.6);
        this.state.steeringDriftOffsetRad = -0.035;
        break;

      case 'RIGHT_FLANK':
        this.state.rightPanelsHealth = Math.max(0, this.state.rightPanelsHealth - baseDamage);
        this.state.suspensionAlignmentHealth = Math.max(0, this.state.suspensionAlignmentHealth - baseDamage * 0.6);
        this.state.steeringDriftOffsetRad = 0.035;
        break;

      case 'UNDERBODY_OIL_PAN':
        this.state.engineBlockHealth = Math.max(0, this.state.engineBlockHealth - baseDamage * 1.4);
        failureReason = 'Oil Pan Cracked — Oil Pressure Warning';
        break;

      case 'ROOF_ROLLOVER':
        this.state.windshieldHealth = 0;
        this.state.overallHealthPct = Math.max(0, this.state.overallHealthPct - 50);
        failureReason = 'Vehicle Rollover Catastrophic Frame Damage';
        break;
    }

    // Recompute overall health
    this.recomputeOverallHealth();

    return {
      damageTaken: baseDamage,
      criticalFailure: failureReason,
    };
  }

  private recomputeOverallHealth() {
    const avg = (
      this.state.frontBumperHealth * 0.2 +
      this.state.rearBumperHealth * 0.15 +
      this.state.leftPanelsHealth * 0.1 +
      this.state.rightPanelsHealth * 0.1 +
      this.state.radiatorHealth * 0.15 +
      this.state.engineBlockHealth * 0.2 +
      this.state.suspensionAlignmentHealth * 0.1
    );
    this.state.overallHealthPct = Math.max(0, Math.min(100, Math.round(avg)));
  }

  public getState(): ComponentDamageState {
    return { ...this.state };
  }

  public repairFull() {
    this.state = {
      overallHealthPct: 100,
      frontBumperHealth: 100,
      rearBumperHealth: 100,
      leftPanelsHealth: 100,
      rightPanelsHealth: 100,
      windshieldHealth: 100,
      radiatorHealth: 100,
      engineBlockHealth: 100,
      transmissionHealth: 100,
      suspensionAlignmentHealth: 100,
      brakePadsHealth: 100,
      hasCoolantLeak: false,
      hasBrakeFluidLeak: false,
      steeringDriftOffsetRad: 0,
    };
  }
}
