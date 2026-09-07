/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - BRAKE ROTOR THERMODYNAMICS & HYDRAULIC ABS SOLVER
 * ============================================================================
 * Comprehensive thermodynamic brake simulation modeling ventilated rotor centrifugal
 * airflow cooling, Stefan-Boltzmann infrared radiant emission, hydraulic caliper
 * clamping dynamics, DOT 5.1 brake fluid boiling / vapor-lock, high-temperature
 * friction pad fade curves, and 50Hz ABS solenoid pressure pulsing.
 */

export type BrakeRotorMaterial = 
  | 'cast_iron_vented'
  | 'carbon_ceramic_matrix'
  | 'carbon_carbon_motorsport'
  | 'slotted_drilled_steel';

export type BrakePadCompound = 
  | 'oem_organic_ceramic'
  | 'semi_metallic_street'
  | 'sintered_carbon_metallic_track'
  | 'full_race_endurance_spec';

export interface BrakeRotorSpec {
  readonly material: BrakeRotorMaterial;
  readonly padCompound: BrakePadCompound;
  readonly diameterMm: number;
  readonly thicknessMm: number;
  readonly massKg: number;
  readonly specificHeatCapacityJPerKgK: number;
  readonly thermalConductivityWPerMK: number;
  readonly emissivity: number; // 0.85 for oxidized iron, 0.92 for carbon ceramic
  readonly effectiveCoolingVaneAreaM2: number;
  readonly maxOperatingTempC: number;
  readonly padGlazingTempC: number;
}

export interface BrakeHydraulicConfig {
  readonly masterCylinderPistonAreaMm2: number;
  readonly caliperPistonCount: number;
  readonly caliperPistonDiameterMm: number;
  readonly brakeBoosterRatio: number; // e.g. 4.5:1 vacuum assist
  readonly brakeBiasFrontPercent: number; // e.g. 62% front, 38% rear
  readonly brakeFluidDryBoilingPointC: number; // e.g. 325°C for Motul RBF 660
  readonly brakeFluidWetBoilingPointC: number; // e.g. 205°C
  readonly fluidWaterContaminationPercent: number;
}

export interface BrakeWheelState {
  readonly wheelIndex: number;
  rotorTempC: number;
  padTempC: number;
  caliperFluidTempC: number;
  hydraulicLinePressureBar: number;
  isAbsPulsing: boolean;
  absPulsePhase: number; // 0.0 to 1.0
  padWearPercent: number;
  rotorWearPercent: number;
  isBoilingVaporLocked: boolean;
  cumulativeEnergyAbsorbedJoules: number;
}

export interface BrakeInputParams {
  readonly pedalInputPercent: number; // 0.0 to 1.0
  readonly vehicleSpeedMps: number;
  readonly wheelAngularVelocityRadPerSec: number;
  readonly tireRollingRadiusM: number;
  readonly ambientAirTempC: number;
  readonly tireSlipRatio: number;
  readonly deltaTimeSec: number;
}

export interface BrakeTorqueOutput {
  readonly brakeTorqueNm: number;
  readonly clampingForceN: number;
  readonly instantaneousPadFrictionMu: number;
  readonly heatGeneratedJoules: number;
  readonly heatDissipatedJoules: number;
  readonly fadeGripLossFactor: number;
  readonly pedalFirmnessPercent: number; // Drops to 10% during vapor lock
  readonly isRotorGlowingOrange: boolean;
}

// ============================================================================
// MATERIAL & COMPOUND MASTER SPECIFICATIONS
// ============================================================================

export const BRAKE_SPECS_DATABASE: Record<BrakeRotorMaterial, BrakeRotorSpec> = {
  'cast_iron_vented': {
    material: 'cast_iron_vented',
    padCompound: 'semi_metallic_street',
    diameterMm: 350.0,
    thicknessMm: 32.0,
    massKg: 10.5,
    specificHeatCapacityJPerKgK: 460.0,
    thermalConductivityWPerMK: 48.0,
    emissivity: 0.82,
    effectiveCoolingVaneAreaM2: 0.28,
    maxOperatingTempC: 750.0,
    padGlazingTempC: 580.0
  },

  'carbon_ceramic_matrix': {
    material: 'carbon_ceramic_matrix',
    padCompound: 'sintered_carbon_metallic_track',
    diameterMm: 410.0,
    thicknessMm: 36.0,
    massKg: 5.8, // ~50% lighter than iron
    specificHeatCapacityJPerKgK: 1200.0,
    thermalConductivityWPerMK: 35.0,
    emissivity: 0.92,
    effectiveCoolingVaneAreaM2: 0.38,
    maxOperatingTempC: 1100.0,
    padGlazingTempC: 950.0
  },

  'carbon_carbon_motorsport': {
    material: 'carbon_carbon_motorsport',
    padCompound: 'full_race_endurance_spec',
    diameterMm: 380.0,
    thicknessMm: 34.0,
    massKg: 3.2,
    specificHeatCapacityJPerKgK: 1450.0,
    thermalConductivityWPerMK: 60.0,
    emissivity: 0.95,
    effectiveCoolingVaneAreaM2: 0.42,
    maxOperatingTempC: 1350.0,
    padGlazingTempC: 1200.0
  },

  'slotted_drilled_steel': {
    material: 'slotted_drilled_steel',
    padCompound: 'semi_metallic_street',
    diameterMm: 370.0,
    thicknessMm: 34.0,
    massKg: 11.2,
    specificHeatCapacityJPerKgK: 490.0,
    thermalConductivityWPerMK: 50.0,
    emissivity: 0.85,
    effectiveCoolingVaneAreaM2: 0.32,
    maxOperatingTempC: 800.0,
    padGlazingTempC: 640.0
  }
};

// ============================================================================
// BRAKE THERMODYNAMIC & ABS SOLVER
// ============================================================================

export class BrakingHeatDissipationSim {
  private static readonly STEFAN_BOLTZMANN_SIGMA = 5.670374e-8; // W / (m^2 * K^4)

  /**
   * Initializes initial thermal state for a brake assembly
   */
  public static createInitialState(wheelIndex: number, ambientTempC: number = 20.0): BrakeWheelState {
    return {
      wheelIndex,
      rotorTempC: ambientTempC,
      padTempC: ambientTempC,
      caliperFluidTempC: ambientTempC,
      hydraulicLinePressureBar: 0.0,
      isAbsPulsing: false,
      absPulsePhase: 0.0,
      padWearPercent: 0.0,
      rotorWearPercent: 0.0,
      isBoilingVaporLocked: false,
      cumulativeEnergyAbsorbedJoules: 0.0
    };
  }

  /**
   * Calculates instantaneous friction coefficient of the brake pad as a function of temperature.
   */
  public static calculatePadFrictionMu(
    compound: BrakePadCompound,
    temperatureC: number
  ): { mu: number; fadeFactor: number } {
    let baseMu = 0.42;
    let optimalTemp = 300.0;
    let fadeTemp = 600.0;
    let coldMu = 0.32;

    switch (compound) {
      case 'oem_organic_ceramic':
        baseMu = 0.38;
        optimalTemp = 200.0;
        fadeTemp = 450.0;
        coldMu = 0.36;
        break;
      case 'semi_metallic_street':
        baseMu = 0.44;
        optimalTemp = 320.0;
        fadeTemp = 620.0;
        coldMu = 0.35;
        break;
      case 'sintered_carbon_metallic_track':
        baseMu = 0.55;
        optimalTemp = 480.0;
        fadeTemp = 850.0;
        coldMu = 0.28; // Cold carbon bites poorly
        break;
      case 'full_race_endurance_spec':
        baseMu = 0.62;
        optimalTemp = 650.0;
        fadeTemp = 1100.0;
        coldMu = 0.22; // Extreme cold bite deficit
        break;
    }

    let mu = baseMu;
    let fadeFactor = 1.0;

    if (temperatureC < optimalTemp) {
      // Warm-up ramp
      const coldFraction = Math.max(0.0, temperatureC / optimalTemp);
      mu = coldMu + (baseMu - coldMu) * Math.sqrt(coldFraction);
    } else if (temperatureC > fadeTemp) {
      // Brake fade zone
      const overTemp = temperatureC - fadeTemp;
      fadeFactor = Math.max(0.15, Math.exp(-overTemp / 180.0));
      mu = baseMu * fadeFactor;
    }

    return { mu, fadeFactor };
  }

  /**
   * Execute 1-step brake physics update
   */
  public static updateBrakeStep(
    state: BrakeWheelState,
    rotorSpec: BrakeRotorSpec,
    hydraulicConfig: BrakeHydraulicConfig,
    inputs: BrakeInputParams,
    isFrontWheel: boolean
  ): BrakeTorqueOutput {
    const dt = Math.max(0.001, inputs.deltaTimeSec);
    const biasRatio = isFrontWheel ? (hydraulicConfig.brakeBiasFrontPercent / 50.0) : ((100.0 - hydraulicConfig.brakeBiasFrontPercent) / 50.0);

    // 1. Hydraulic Line Pressure calculation
    const maxMasterBar = 95.0; // Standard max human foot threshold with booster
    let targetPressureBar = inputs.pedalInputPercent * maxMasterBar * hydraulicConfig.brakeBoosterRatio * biasRatio;

    // Check for brake fluid boiling / vapor lock
    const effectiveBoilingPt = hydraulicConfig.brakeFluidDryBoilingPointC - 
      (hydraulicConfig.fluidWaterContaminationPercent * 25.0);
    
    if (state.caliperFluidTempC >= effectiveBoilingPt) {
      state.isBoilingVaporLocked = true;
      targetPressureBar *= 0.12; // 88% pressure loss due to vapor compressibility!
    } else {
      state.isBoilingVaporLocked = false;
    }

    // 2. ABS Solenoid Pressure Modulation (Pulse when slip ratio > -0.18)
    if (inputs.tireSlipRatio < -0.16 && inputs.vehicleSpeedMps > 3.0 && inputs.pedalInputPercent > 0.3) {
      state.isAbsPulsing = true;
      state.absPulsePhase += dt * 50.0; // 50 Hz pulse cycle
      const pulseModulation = 0.5 + 0.5 * Math.sin(state.absPulsePhase * 2.0 * Math.PI);
      targetPressureBar *= pulseModulation;
    } else {
      state.isAbsPulsing = false;
      state.absPulsePhase = 0;
    }

    state.hydraulicLinePressureBar = targetPressureBar;

    // 3. Caliper Clamping Force: F = P * Area_pistons
    const singlePistonAreaM2 = Math.PI * Math.pow((hydraulicConfig.caliperPistonDiameterMm * 0.001) / 2.0, 2);
    const totalPistonAreaM2 = singlePistonAreaM2 * hydraulicConfig.caliperPistonCount;
    const pressurePa = state.hydraulicLinePressureBar * 1e5;
    const clampingForceN = pressurePa * totalPistonAreaM2;

    // 4. Pad Friction & Brake Torque
    const { mu, fadeFactor } = this.calculatePadFrictionMu(rotorSpec.padCompound, state.rotorTempC);
    const effectiveRadiusM = (rotorSpec.diameterMm * 0.001 * 0.5) * 0.88; // Effective center of friction pad
    const brakeTorqueNm = clampingForceN * mu * effectiveRadiusM * 2.0; // Both sides of rotor

    // 5. Work Done & Heat Generation (Joules)
    const wheelAngularSpeed = Math.abs(inputs.wheelAngularVelocityRadPerSec);
    const mechanicalWorkPowerWatts = brakeTorqueNm * wheelAngularSpeed;
    const heatGenJoules = mechanicalWorkPowerWatts * dt;

    state.cumulativeEnergyAbsorbedJoules += heatGenJoules;

    // 6. Heat Dissipation
    // A. Convection through ventilated vanes (speed dependent)
    const airspeedMps = Math.max(2.0, inputs.vehicleSpeedMps);
    const hConvVanes = 15.0 + 8.5 * Math.pow(airspeedMps, 0.78);
    const tempDiffK = Math.max(0.0, state.rotorTempC - inputs.ambientAirTempC);
    const heatLossConvectionWatts = hConvVanes * rotorSpec.effectiveCoolingVaneAreaM2 * tempDiffK;

    // B. Radiation via Stefan-Boltzmann Law: Q = eps * sigma * A * (T_hot^4 - T_ambient^4)
    const tRotorKelvin = state.rotorTempC + 273.15;
    const tAmbientKelvin = inputs.ambientAirTempC + 273.15;
    const radiationWatts = rotorSpec.emissivity * this.STEFAN_BOLTZMANN_SIGMA * rotorSpec.effectiveCoolingVaneAreaM2 * 
      (Math.pow(tRotorKelvin, 4) - Math.pow(tAmbientKelvin, 4));

    const totalHeatDissipatedWatts = heatLossConvectionWatts + radiationWatts;
    const heatDissipatedJoules = totalHeatDissipatedWatts * dt;

    // 7. Temperature Integration
    const rotorHeatCapacity = rotorSpec.massKg * rotorSpec.specificHeatCapacityJPerKgK;
    const netHeatJoules = (heatGenJoules * 0.88) - heatDissipatedJoules; // 88% into rotor, 12% into pad
    const deltaTempC = netHeatJoules / rotorHeatCapacity;

    state.rotorTempC = Math.max(inputs.ambientAirTempC, state.rotorTempC + deltaTempC);

    // Heat transfer to pad & fluid
    const padHeatCapacity = 0.85 * 850.0;
    const padNetHeat = (heatGenJoules * 0.12) - (state.padTempC - inputs.ambientAirTempC) * 12.0 * dt;
    state.padTempC = Math.max(inputs.ambientAirTempC, state.padTempC + (padNetHeat / padHeatCapacity));

    // Fluid heating from caliper body
    const conductionToFluid = (state.padTempC - state.caliperFluidTempC) * 0.08 * dt;
    const coolingFluid = (state.caliperFluidTempC - inputs.ambientAirTempC) * 0.02 * dt;
    state.caliperFluidTempC = Math.max(inputs.ambientAirTempC, state.caliperFluidTempC + conductionToFluid - coolingFluid);

    // Visual glowing threshold (~600°C for cherry red, 850°C for bright orange)
    const isRotorGlowingOrange = state.rotorTempC >= 620.0;
    const pedalFirmnessPercent = state.isBoilingVaporLocked ? 12.0 : (state.isAbsPulsing ? 80.0 : 100.0);

    return {
      brakeTorqueNm,
      clampingForceN,
      instantaneousPadFrictionMu: mu,
      heatGeneratedJoules: heatGenJoules,
      heatDissipatedJoules,
      fadeGripLossFactor: fadeFactor,
      pedalFirmnessPercent,
      isRotorGlowingOrange
    };
  }
}
