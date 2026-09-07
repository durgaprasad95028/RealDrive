export type EngineAspiration = 'NATURALLY_ASPIRATED' | 'TURBOCHARGED' | 'SUPERCHARGED' | 'TURBO_DIESEL' | 'DUAL_MOTOR_EV';

export interface EngineSpecification {
  aspiration: EngineAspiration;
  cylinderCount: number;
  displacementLiters: number;
  idleRpm: number;
  redlineRpm: number;
  revLimiterRpm: number;
  maxTorqueNm: number;
  maxTorqueRpm: number;
  maxPowerHp: number;
  maxPowerRpm: number;
  inertiaKgM2: number;
  engineBrakingFactor: number;
  maxBoostBar: number;
  turboSpoolRate: number; // Rate per sec
}

export interface EngineTelemetryState {
  currentRpm: number;
  currentTorqueNm: number;
  currentPowerHp: number;
  throttleInputPct: number;
  boostPressureBar: number;
  wastegateOpen: boolean;
  bovVenting: boolean;
  coolantTempC: number;
  oilTempC: number;
  oilPressureBar: number;
  fuelConsumptionLPer100Km: number;
  isOverheating: boolean;
  isBlownHeadGasket: boolean;
  isRevLimiterActive: boolean;
  engineSoundPitch: number;
}

export class EngineCombustionModel {
  private spec: EngineSpecification;
  private state: EngineTelemetryState;
  private revLimiterTimer: number = 0;
  private bovTimer: number = 0;

  constructor(aspiration: EngineAspiration = 'TURBOCHARGED', maxPowerHp = 420, maxTorqueNm = 550) {
    this.spec = this.buildSpec(aspiration, maxPowerHp, maxTorqueNm);
    this.state = {
      currentRpm: this.spec.idleRpm,
      currentTorqueNm: 0,
      currentPowerHp: 0,
      throttleInputPct: 0,
      boostPressureBar: 0,
      wastegateOpen: false,
      bovVenting: false,
      coolantTempC: 85.0, // Normal operating temp
      oilTempC: 92.0,
      oilPressureBar: 3.5,
      fuelConsumptionLPer100Km: 8.5,
      isOverheating: false,
      isBlownHeadGasket: false,
      isRevLimiterActive: false,
      engineSoundPitch: 1.0,
    };
  }

  private buildSpec(aspiration: EngineAspiration, maxHp: number, maxTorque: number): EngineSpecification {
    switch (aspiration) {
      case 'NATURALLY_ASPIRATED':
        return {
          aspiration,
          cylinderCount: 6,
          displacementLiters: 3.5,
          idleRpm: 750,
          redlineRpm: 7200,
          revLimiterRpm: 7400,
          maxTorqueNm: maxTorque,
          maxTorqueRpm: 4800,
          maxPowerHp: maxHp,
          maxPowerRpm: 6800,
          inertiaKgM2: 0.18,
          engineBrakingFactor: 1.2,
          maxBoostBar: 0,
          turboSpoolRate: 0,
        };
      case 'TURBOCHARGED':
        return {
          aspiration,
          cylinderCount: 4,
          displacementLiters: 2.0,
          idleRpm: 800,
          redlineRpm: 6800,
          revLimiterRpm: 7000,
          maxTorqueNm: maxTorque,
          maxTorqueRpm: 3200,
          maxPowerHp: maxHp,
          maxPowerRpm: 6200,
          inertiaKgM2: 0.15,
          engineBrakingFactor: 0.9,
          maxBoostBar: 1.45,
          turboSpoolRate: 3.5,
        };
      case 'SUPERCHARGED':
        return {
          aspiration,
          cylinderCount: 8,
          displacementLiters: 5.0,
          idleRpm: 650,
          redlineRpm: 6500,
          revLimiterRpm: 6700,
          maxTorqueNm: maxTorque * 1.2,
          maxTorqueRpm: 3600,
          maxPowerHp: maxHp * 1.15,
          maxPowerRpm: 6000,
          inertiaKgM2: 0.25,
          engineBrakingFactor: 1.4,
          maxBoostBar: 0.85,
          turboSpoolRate: 15.0,
        };
      case 'TURBO_DIESEL':
        return {
          aspiration,
          cylinderCount: 6,
          displacementLiters: 6.7,
          idleRpm: 600,
          redlineRpm: 3800,
          revLimiterRpm: 4000,
          maxTorqueNm: maxTorque * 1.8,
          maxTorqueRpm: 1800,
          maxPowerHp: maxHp * 0.8,
          maxPowerRpm: 3200,
          inertiaKgM2: 0.45,
          engineBrakingFactor: 2.2,
          maxBoostBar: 2.2,
          turboSpoolRate: 2.0,
        };
      case 'DUAL_MOTOR_EV':
        return {
          aspiration,
          cylinderCount: 0,
          displacementLiters: 0,
          idleRpm: 0,
          redlineRpm: 18000,
          revLimiterRpm: 18500,
          maxTorqueNm: maxTorque * 1.5,
          maxTorqueRpm: 0, // Instant peak torque from 0 RPM
          maxPowerHp: maxHp * 1.3,
          maxPowerRpm: 9000,
          inertiaKgM2: 0.08,
          engineBrakingFactor: 2.5, // Strong regenerative braking
          maxBoostBar: 0,
          turboSpoolRate: 0,
        };
    }
  }

  /**
   * Updates engine RPM, torque curve, turbocharger boost spool, and thermal cooling cycle.
   */
  public update(throttleInput: number, loadTorqueNm: number, vehicleSpeedKmh: number, dtSec: number): EngineTelemetryState {
    this.state.throttleInputPct = Math.max(0, Math.min(1, throttleInput));

    // 1. Turbocharger Boost Dynamics
    if (this.spec.aspiration === 'TURBOCHARGED' || this.spec.aspiration === 'TURBO_DIESEL') {
      const targetBoost = this.state.throttleInputPct * (this.state.currentRpm / this.spec.maxPowerRpm) * this.spec.maxBoostBar;
      
      if (this.state.throttleInputPct > 0.1) {
        // Spooling up with lag
        this.state.boostPressureBar += (targetBoost - this.state.boostPressureBar) * this.spec.turboSpoolRate * dtSec;
        this.state.wastegateOpen = this.state.boostPressureBar >= this.spec.maxBoostBar * 0.98;
      } else {
        // Throttle lifted: Blow-Off Valve (BOV) vent trigger
        if (this.state.boostPressureBar > 0.3) {
          this.state.bovVenting = true;
          this.bovTimer = 0.25;
        }
        this.state.boostPressureBar = Math.max(0, this.state.boostPressureBar - 4.5 * dtSec);
      }

      if (this.bovTimer > 0) {
        this.bovTimer -= dtSec;
        if (this.bovTimer <= 0) this.state.bovVenting = false;
      }
    } else if (this.spec.aspiration === 'SUPERCHARGED') {
      this.state.boostPressureBar = this.state.throttleInputPct * (this.state.currentRpm / this.spec.maxPowerRpm) * this.spec.maxBoostBar;
    }

    // 2. Base Combustion Torque Curve (Normalized Polynomial Curve)
    const rpmNorm = (this.state.currentRpm - this.spec.idleRpm) / (this.spec.redlineRpm - this.spec.idleRpm);
    let torqueFactor = 0;

    if (this.spec.aspiration === 'DUAL_MOTOR_EV') {
      // Electric flat torque drop off
      torqueFactor = Math.max(0.2, 1.0 - (this.state.currentRpm / this.spec.redlineRpm) * 0.6);
    } else {
      // Non-linear ICE torque bell curve
      torqueFactor = Math.sin(Math.max(0, Math.min(Math.PI, rpmNorm * Math.PI * 1.15)));
    }

    // Boost multiplier (1 + 0.65 per bar of boost)
    const boostTorqueMult = 1.0 + this.state.boostPressureBar * 0.65;
    const combustionTorque = this.spec.maxTorqueNm * torqueFactor * this.state.throttleInputPct * boostTorqueMult;

    // 3. Engine Braking & Friction Drag
    const engineFrictionTorque = (this.state.currentRpm / 1000) * 12 * this.spec.engineBrakingFactor;
    const netTorque = combustionTorque - engineFrictionTorque - loadTorqueNm;

    // 4. Rev Limiter Bouncing
    if (this.state.currentRpm >= this.spec.revLimiterRpm) {
      this.state.isRevLimiterActive = true;
      this.revLimiterTimer = 0.08; // Fuel cut pulse
    }

    if (this.revLimiterTimer > 0) {
      this.revLimiterTimer -= dtSec;
      this.state.currentTorqueNm = -engineFrictionTorque;
    } else {
      this.state.isRevLimiterActive = false;
      this.state.currentTorqueNm = Math.max(-100, netTorque);
    }

    // 5. Angular Acceleration (RPM Derivative)
    const angularAccelRadS2 = this.state.currentTorqueNm / this.spec.inertiaKgM2;
    const rpmDelta = (angularAccelRadS2 * (60 / (2 * Math.PI))) * dtSec;

    this.state.currentRpm = Math.max(
      this.spec.idleRpm,
      Math.min(this.spec.revLimiterRpm + 100, this.state.currentRpm + rpmDelta)
    );

    // 6. Horsepower Output: HP = (Torque * RPM) / 7127
    this.state.currentPowerHp = Math.max(0, (combustionTorque * this.state.currentRpm) / 7127);

    // 7. Thermal Cooling Simulation
    this.updateThermodynamics(vehicleSpeedKmh, combustionTorque, dtSec);

    // Sound Pitch Multiplier for Web Audio synthesizer
    this.state.engineSoundPitch = 0.5 + (this.state.currentRpm / this.spec.redlineRpm) * 2.0;

    return { ...this.state };
  }

  private updateThermodynamics(speedKmh: number, combustionTorque: number, dtSec: number) {
    // Heat produced by fuel combustion
    const heatGenerated = (combustionTorque / this.spec.maxTorqueNm) * (this.state.currentRpm / 3000) * 1.8 * dtSec;

    // Radiator airflow cooling based on vehicle velocity
    const airflowCooling = (1.0 + (speedKmh / 100) * 2.5) * 0.9 * dtSec;

    this.state.coolantTempC = Math.max(30, this.state.coolantTempC + heatGenerated - airflowCooling);
    this.state.oilTempC = THREE_LERP(this.state.oilTempC, this.state.coolantTempC + 8.0, 0.05 * dtSec);

    // Oil pressure rises with RPM, drops under high heat
    const oilViscosityLoss = Math.max(0.5, 1.0 - Math.max(0, (this.state.oilTempC - 100) / 100));
    this.state.oilPressureBar = (1.5 + (this.state.currentRpm / this.spec.redlineRpm) * 4.0) * oilViscosityLoss;

    // Overheating (> 115 C)
    if (this.state.coolantTempC > 118) {
      this.state.isOverheating = true;
      if (this.state.coolantTempC > 132) {
        this.state.isBlownHeadGasket = true; // Blown engine
      }
    } else {
      this.state.isOverheating = false;
    }
  }

  public getTelemetry(): EngineTelemetryState {
    return { ...this.state };
  }

  public getSpecification(): EngineSpecification {
    return { ...this.spec };
  }
}

function THREE_LERP(start: number, end: number, t: number): number {
  return start + (end - start) * Math.min(1, Math.max(0, t));
}
