/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - TIRE THERMAL DEGRADATION & TREAD DEFORMATION
 * ============================================================================
 * Multi-layer thermodynamic tire model simulating surface flash heat, tread bulk,
 * carcass core, internal nitrogen gas expansion, mechanical graining, blistering,
 * flat-spotting, hydroplaning water clearing dynamics, and Arrhenius grip curves.
 */

export type TireCompoundId = 
  | 'slick_soft_c5'
  | 'slick_medium_c3'
  | 'slick_hard_c1'
  | 'semi_slick_r_comp'
  | 'uhp_summer_street'
  | 'grand_touring_all_season'
  | 'intermediate_grooved'
  | 'monsoon_full_wet'
  | 'drift_hard_compound'
  | 'drag_slick_radial'
  | 'gravel_rally_reinforced'
  | 'snow_studded_winter';

export interface TireCompoundSpecification {
  readonly id: TireCompoundId;
  readonly displayName: string;
  readonly optimalTemperatureC: number;
  readonly operationalTempRangeC: [number, number]; // [min_operating, max_operating]
  readonly glassTransitionTempC: number;
  readonly peakFrictionCoefficientMu: number;
  readonly baseWearRatePerKm: number;
  readonly thermalConductivityWPerMK: number;
  readonly heatCapacityJPerKgK: number;
  readonly grainingSensitivity: number; // 0.0 to 1.0 (susceptibility to cold tearing)
  readonly blisteringSensitivity: number; // 0.0 to 1.0 (susceptibility to core overheating)
  readonly flatSpotResistance: number;
  readonly treadGrooveDepthNominalMm: number;
  readonly waterEvacuationLitersPerSecPerMm: number; // Wet clearing capacity
  readonly optimalHotPressureBar: number;
}

export interface WheelThermalState {
  readonly wheelIndex: number; // 0=FL, 1=FR, 2=RL, 3=RR
  surfaceFlashTempC: number;    // Immediate contact patch outer micro-layer (fast dynamic)
  treadBulkTempC: number;       // Bulk rubber layer (medium dynamic)
  carcassCoreTempC: number;     // Inner belt & cord layer (slow dynamic)
  internalGasTempC: number;     // Gas volume (nitrogen/air)
  internalPressureBar: number;  // Cold inflation + thermal rise
  wearTreadRemainingMm: number; // Current tread depth
  wearPercent: number;          // 0.0 (new) to 1.0 (cord showing / dead)
  grainingSeverityPercent: number; // Graining roughness surface degradation
  blisteringPercent: number;    // Blisters formed from core boiling
  flatSpotDepthMm: number;      // Flat spot wear asymmetry from lockups
  pickupRubberAccumulationGrams: number; // Off-line rubber marbles picked up
}

export interface ContactPatchPhysicsInputs {
  readonly normalLoadN: number;
  readonly slipAngleRad: number;
  readonly slipRatio: number;
  readonly slidingVelocityMps: number;
  readonly angularVelocityRadPerSec: number;
  readonly wheelRadiusM: number;
  readonly vehicleSpeedMps: number;
  readonly trackSurfaceTempC: number;
  readonly ambientAirTempC: number;
  readonly trackWaterFilmThicknessMm: number;
  readonly brakeRotorRadiantHeatJoules: number;
  readonly deltaTimeSec: number;
}

export interface TireStateOutput {
  readonly effectiveFrictionCoeffMu: number;
  readonly thermalGripFactor: number;
  readonly wearGripFactor: number;
  readonly surfaceConditionGripFactor: number;
  readonly aquaplaningSpeedThresholdKph: number;
  readonly isHydroplaning: boolean;
  readonly heatGenerationWatts: number;
  readonly heatDissipationWatts: number;
  readonly deltaWearMm: number;
  readonly structuralFailureRiskPercent: number;
}

// ============================================================================
// COMPOUND MASTER MATRIX SPECIFICATIONS
// ============================================================================

export const TIRE_COMPOUNDS_REGISTRY: Record<TireCompoundId, TireCompoundSpecification> = {
  'slick_soft_c5': {
    id: 'slick_soft_c5',
    displayName: 'Qualifying Soft Slick (C5 Spec)',
    optimalTemperatureC: 105.0,
    operationalTempRangeC: [90.0, 120.0],
    glassTransitionTempC: -15.0,
    peakFrictionCoefficientMu: 1.85,
    baseWearRatePerKm: 0.045,
    thermalConductivityWPerMK: 0.24,
    heatCapacityJPerKgK: 1850,
    grainingSensitivity: 0.85,
    blisteringSensitivity: 0.90,
    flatSpotResistance: 0.35,
    treadGrooveDepthNominalMm: 3.5, // Slick baseline rubber thickness
    waterEvacuationLitersPerSecPerMm: 0.1,
    optimalHotPressureBar: 1.95
  },

  'slick_medium_c3': {
    id: 'slick_medium_c3',
    displayName: 'Competition Medium Slick (C3 Spec)',
    optimalTemperatureC: 98.0,
    operationalTempRangeC: [82.0, 115.0],
    glassTransitionTempC: -20.0,
    peakFrictionCoefficientMu: 1.68,
    baseWearRatePerKm: 0.022,
    thermalConductivityWPerMK: 0.26,
    heatCapacityJPerKgK: 1900,
    grainingSensitivity: 0.55,
    blisteringSensitivity: 0.60,
    flatSpotResistance: 0.55,
    treadGrooveDepthNominalMm: 4.0,
    waterEvacuationLitersPerSecPerMm: 0.1,
    optimalHotPressureBar: 2.05
  },

  'slick_hard_c1': {
    id: 'slick_hard_c1',
    displayName: 'Endurance Hard Slick (C1 Spec)',
    optimalTemperatureC: 92.0,
    operationalTempRangeC: [75.0, 110.0],
    glassTransitionTempC: -25.0,
    peakFrictionCoefficientMu: 1.52,
    baseWearRatePerKm: 0.010,
    thermalConductivityWPerMK: 0.28,
    heatCapacityJPerKgK: 1950,
    grainingSensitivity: 0.30,
    blisteringSensitivity: 0.35,
    flatSpotResistance: 0.75,
    treadGrooveDepthNominalMm: 4.5,
    waterEvacuationLitersPerSecPerMm: 0.1,
    optimalHotPressureBar: 2.15
  },

  'semi_slick_r_comp': {
    id: 'semi_slick_r_comp',
    displayName: 'Track Day Semi-Slick R-Compound',
    optimalTemperatureC: 85.0,
    operationalTempRangeC: [68.0, 105.0],
    glassTransitionTempC: -30.0,
    peakFrictionCoefficientMu: 1.40,
    baseWearRatePerKm: 0.008,
    thermalConductivityWPerMK: 0.25,
    heatCapacityJPerKgK: 1880,
    grainingSensitivity: 0.40,
    blisteringSensitivity: 0.45,
    flatSpotResistance: 0.65,
    treadGrooveDepthNominalMm: 5.5,
    waterEvacuationLitersPerSecPerMm: 4.8,
    optimalHotPressureBar: 2.25
  },

  'uhp_summer_street': {
    id: 'uhp_summer_street',
    displayName: 'Ultra-High Performance Summer Road',
    optimalTemperatureC: 65.0,
    operationalTempRangeC: [45.0, 88.0],
    glassTransitionTempC: -38.0,
    peakFrictionCoefficientMu: 1.18,
    baseWearRatePerKm: 0.003,
    thermalConductivityWPerMK: 0.22,
    heatCapacityJPerKgK: 1800,
    grainingSensitivity: 0.20,
    blisteringSensitivity: 0.25,
    flatSpotResistance: 0.85,
    treadGrooveDepthNominalMm: 8.0,
    waterEvacuationLitersPerSecPerMm: 12.5,
    optimalHotPressureBar: 2.40
  },

  'grand_touring_all_season': {
    id: 'grand_touring_all_season',
    displayName: 'Grand Touring Long-Life All-Season',
    optimalTemperatureC: 45.0,
    operationalTempRangeC: [-10.0, 75.0],
    glassTransitionTempC: -50.0,
    peakFrictionCoefficientMu: 0.98,
    baseWearRatePerKm: 0.001,
    thermalConductivityWPerMK: 0.20,
    heatCapacityJPerKgK: 1750,
    grainingSensitivity: 0.10,
    blisteringSensitivity: 0.15,
    flatSpotResistance: 0.95,
    treadGrooveDepthNominalMm: 8.5,
    waterEvacuationLitersPerSecPerMm: 16.0,
    optimalHotPressureBar: 2.50
  },

  'intermediate_grooved': {
    id: 'intermediate_grooved',
    displayName: 'Competition Intermediate Wet',
    optimalTemperatureC: 70.0,
    operationalTempRangeC: [50.0, 90.0],
    glassTransitionTempC: -35.0,
    peakFrictionCoefficientMu: 1.35,
    baseWearRatePerKm: 0.025,
    thermalConductivityWPerMK: 0.27,
    heatCapacityJPerKgK: 1920,
    grainingSensitivity: 0.65,
    blisteringSensitivity: 0.70,
    flatSpotResistance: 0.50,
    treadGrooveDepthNominalMm: 6.0,
    waterEvacuationLitersPerSecPerMm: 28.0,
    optimalHotPressureBar: 2.10
  },

  'monsoon_full_wet': {
    id: 'monsoon_full_wet',
    displayName: 'Extreme Monsoon Full Wet',
    optimalTemperatureC: 55.0,
    operationalTempRangeC: [35.0, 75.0],
    glassTransitionTempC: -45.0,
    peakFrictionCoefficientMu: 1.25,
    baseWearRatePerKm: 0.035,
    thermalConductivityWPerMK: 0.29,
    heatCapacityJPerKgK: 1980,
    grainingSensitivity: 0.75,
    blisteringSensitivity: 0.80,
    flatSpotResistance: 0.45,
    treadGrooveDepthNominalMm: 8.5,
    waterEvacuationLitersPerSecPerMm: 65.0,
    optimalHotPressureBar: 2.20
  },

  'drift_hard_compound': {
    id: 'drift_hard_compound',
    displayName: 'High-Smoke Poly-Rubber Drift Spec',
    optimalTemperatureC: 130.0,
    operationalTempRangeC: [90.0, 180.0],
    glassTransitionTempC: -10.0,
    peakFrictionCoefficientMu: 1.05,
    baseWearRatePerKm: 0.060,
    thermalConductivityWPerMK: 0.35,
    heatCapacityJPerKgK: 2100,
    grainingSensitivity: 0.15,
    blisteringSensitivity: 0.20,
    flatSpotResistance: 0.80,
    treadGrooveDepthNominalMm: 6.0,
    waterEvacuationLitersPerSecPerMm: 8.0,
    optimalHotPressureBar: 1.80
  },

  'drag_slick_radial': {
    id: 'drag_slick_radial',
    displayName: 'Wrinkle-Wall Drag Radial',
    optimalTemperatureC: 115.0,
    operationalTempRangeC: [95.0, 135.0],
    glassTransitionTempC: -5.0,
    peakFrictionCoefficientMu: 2.20,
    baseWearRatePerKm: 0.080,
    thermalConductivityWPerMK: 0.22,
    heatCapacityJPerKgK: 1800,
    grainingSensitivity: 0.90,
    blisteringSensitivity: 0.85,
    flatSpotResistance: 0.20,
    treadGrooveDepthNominalMm: 2.5,
    waterEvacuationLitersPerSecPerMm: 0.05,
    optimalHotPressureBar: 1.05
  },

  'gravel_rally_reinforced': {
    id: 'gravel_rally_reinforced',
    displayName: 'Kevlar-Reinforced Gravel Rally',
    optimalTemperatureC: 75.0,
    operationalTempRangeC: [40.0, 110.0],
    glassTransitionTempC: -40.0,
    peakFrictionCoefficientMu: 1.28,
    baseWearRatePerKm: 0.015,
    thermalConductivityWPerMK: 0.26,
    heatCapacityJPerKgK: 1900,
    grainingSensitivity: 0.35,
    blisteringSensitivity: 0.30,
    flatSpotResistance: 0.90,
    treadGrooveDepthNominalMm: 12.0,
    waterEvacuationLitersPerSecPerMm: 35.0,
    optimalHotPressureBar: 2.30
  },

  'snow_studded_winter': {
    id: 'snow_studded_winter',
    displayName: 'Nordic Tungsten Studded Ice & Snow',
    optimalTemperatureC: 10.0,
    operationalTempRangeC: [-35.0, 35.0],
    glassTransitionTempC: -65.0,
    peakFrictionCoefficientMu: 0.88,
    baseWearRatePerKm: 0.005,
    thermalConductivityWPerMK: 0.21,
    heatCapacityJPerKgK: 1720,
    grainingSensitivity: 0.25,
    blisteringSensitivity: 0.30,
    flatSpotResistance: 0.90,
    treadGrooveDepthNominalMm: 10.5,
    waterEvacuationLitersPerSecPerMm: 22.0,
    optimalHotPressureBar: 2.45
  }
};

// ============================================================================
// THERMODYNAMIC EQUATIONS & DEGRADATION SOLVER
// ============================================================================

export class TireThermalDegradationSolver {
  /**
   * Initializes a fresh wheel state
   */
  public static createInitialState(
    wheelIndex: number,
    compoundId: TireCompoundId,
    ambientTempC: number = 20.0,
    coldPressureBar: number = 2.0
  ): WheelThermalState {
    const spec = TIRE_COMPOUNDS_REGISTRY[compoundId];
    return {
      wheelIndex,
      surfaceFlashTempC: ambientTempC,
      treadBulkTempC: ambientTempC,
      carcassCoreTempC: ambientTempC,
      internalGasTempC: ambientTempC,
      internalPressureBar: coldPressureBar,
      wearTreadRemainingMm: spec.treadGrooveDepthNominalMm,
      wearPercent: 0.0,
      grainingSeverityPercent: 0.0,
      blisteringPercent: 0.0,
      flatSpotDepthMm: 0.0,
      pickupRubberAccumulationGrams: 0.0
    };
  }

  /**
   * Calculates the thermal grip multiplier using an asymmetric Gaussian / Arrhenius bell curve.
   */
  public static calculateThermalGripFactor(
    tempC: number,
    spec: TireCompoundSpecification
  ): number {
    const opt = spec.optimalTemperatureC;
    const deltaT = tempC - opt;

    if (deltaT < 0) {
      // Under-temperature side (stiffer, glassy rubber)
      const coldSigma = (opt - spec.operationalTempRangeC[0]) * 1.25;
      const factor = Math.exp(-0.5 * Math.pow(deltaT / coldSigma, 2));
      return Math.max(0.40, factor); // Minimum cold grip floor
    } else {
      // Over-temperature side (greasy, melting rubber matrix)
      const hotSigma = (spec.operationalTempRangeC[1] - opt) * 0.95;
      const factor = Math.exp(-0.5 * Math.pow(deltaT / hotSigma, 2));
      return Math.max(0.50, factor);
    }
  }

  /**
   * Dynamic Hydroplaning Speed Threshold via NASA / Horne equation
   * V_h = 6.35 * sqrt(P_tire_psi) in knots -> converted to km/h
   * Corrected by tread groove depth & water film thickness
   */
  public static calculateAquaplaningThreshold(
    pressureBar: number,
    treadDepthMm: number,
    nominalTreadDepthMm: number,
    waterFilmThicknessMm: number,
    waterClearingSpec: number
  ): { speedThresholdKph: number; isHydroplaning: boolean } {
    if (waterFilmThicknessMm <= 0.2) {
      return { speedThresholdKph: 999.0, isHydroplaning: false };
    }

    const pressurePsi = pressureBar * 14.5038;
    const baseNasaKnots = 6.35 * Math.sqrt(Math.max(10.0, pressurePsi));
    const baseNasaKph = baseNasaKnots * 1.852;

    // Tread depth groove capacity ratio
    const treadRatio = Math.max(0.05, treadDepthMm / Math.max(1.0, nominalTreadDepthMm));
    const grooveClearanceFactor = Math.pow(treadRatio, 0.65) * (waterClearingSpec / 15.0);

    // Film thickness choking effect
    const waterChoking = 1.0 / Math.pow(Math.max(0.5, waterFilmThicknessMm), 0.35);

    const thresholdKph = baseNasaKph * grooveClearanceFactor * waterChoking;
    return {
      speedThresholdKph: Math.max(35.0, thresholdKph),
      isHydroplaning: false // Evaluated against actual speed in update loop
    };
  }

  /**
   * Executes a full thermodynamic physics integration step for one wheel
   */
  public static updateWheelState(
    state: WheelThermalState,
    compoundId: TireCompoundId,
    inputs: ContactPatchPhysicsInputs
  ): TireStateOutput {
    const spec = TIRE_COMPOUNDS_REGISTRY[compoundId];
    const dt = Math.max(0.001, inputs.deltaTimeSec);

    // 1. Friction Work & Heat Generation
    // Power (Watts) = Force_frictional * Sliding_velocity
    const normalLoad = Math.max(100.0, inputs.normalLoadN);
    const slipSpeed = Math.abs(inputs.slidingVelocityMps);
    
    // Base friction force
    const currentBaseMu = spec.peakFrictionCoefficientMu;
    const frictionalForceN = normalLoad * currentBaseMu * (slipSpeed / (slipSpeed + 2.5));
    const mechanicalHeatGenWatts = frictionalForceN * slipSpeed * 0.85; // 85% converted to heat

    // Carcass flex heat generation (hysteresis loss from rolling deflection)
    const rollingFreqHz = Math.abs(inputs.angularVelocityRadPerSec) / (2.0 * Math.PI);
    const flexHysteresisWatts = (normalLoad * 0.012) * (inputs.vehicleSpeedMps) * (spec.optimalHotPressureBar / Math.max(1.0, state.internalPressureBar));

    const totalHeatInputWatts = mechanicalHeatGenWatts + flexHysteresisWatts;

    // 2. Heat Conduction & Dissipation
    // Flash surface to bulk conduction
    const kRubber = spec.thermalConductivityWPerMK;
    const patchAreaM2 = 0.035 * (normalLoad / 4000.0); // ~150-250 cm^2
    const conductionFlashToBulk = (state.surfaceFlashTempC - state.treadBulkTempC) * 35.0; // Conduction coefficient
    
    // Bulk to carcass conduction
    const conductionBulkToCore = (state.treadBulkTempC - state.carcassCoreTempC) * 12.0;

    // Carcass to internal nitrogen gas
    const conductionCoreToGas = (state.carcassCoreTempC - state.internalGasTempC) * 4.5;

    // Surface convection to ambient air (wind speed dependent: q = h_conv * A * deltaT)
    const airSpeed = Math.max(5.0, inputs.vehicleSpeedMps);
    const hConvAir = 10.45 - airSpeed + 10.0 * Math.sqrt(airSpeed); // Jurges empirical formula
    const convectionSurfaceToAir = hConvAir * patchAreaM2 * (state.surfaceFlashTempC - inputs.ambientAirTempC);

    // Conduction surface to track road surface
    const conductionSurfaceToTrack = 80.0 * patchAreaM2 * (state.surfaceFlashTempC - inputs.trackSurfaceTempC);

    // Radiant heat absorbed from glowing brake rotors (up to 800°C)
    const brakeRadiationWatts = (inputs.brakeRotorRadiantHeatJoules / dt) * 0.18; // 18% absorbed by rim/bead

    // 3. Thermal State Differential Equations (Euler Integration)
    const mFlashKg = 0.35; // Mass of outer 1mm contact tread rubber
    const mBulkKg = 2.8;   // Mass of tread bulk
    const mCoreKg = 4.2;   // Mass of carcass belts & casing
    const mGasKg = 0.045;  // Nitrogen gas mass

    const cRubber = spec.heatCapacityJPerKgK;

    // dT_flash/dt
    const dTempFlash = ((mechanicalHeatGenWatts - conductionFlashToBulk - convectionSurfaceToAir - conductionSurfaceToTrack) / (mFlashKg * cRubber)) * dt;
    // dT_bulk/dt
    const dTempBulk = ((conductionFlashToBulk - conductionBulkToCore) / (mBulkKg * cRubber)) * dt;
    // dT_core/dt
    const dTempCore = ((conductionBulkToCore + flexHysteresisWatts + brakeRadiationWatts - conductionCoreToGas) / (mCoreKg * cRubber)) * dt;
    // dT_gas/dt
    const dTempGas = (conductionCoreToGas / (mGasKg * 1040)) * dt;

    state.surfaceFlashTempC = Math.max(-40.0, state.surfaceFlashTempC + dTempFlash);
    state.treadBulkTempC = Math.max(-40.0, state.treadBulkTempC + dTempBulk);
    state.carcassCoreTempC = Math.max(-40.0, state.carcassCoreTempC + dTempCore);
    state.internalGasTempC = Math.max(-40.0, state.internalGasTempC + dTempGas);

    // 4. Ideal Gas Pressure Calculation: P2 = P1 * (T2_Kelvin / T1_Kelvin)
    const tKelvin = state.internalGasTempC + 273.15;
    const tColdKelvin = inputs.ambientAirTempC + 273.15;
    const baseColdPressure = spec.optimalHotPressureBar * 0.85;
    state.internalPressureBar = baseColdPressure * (tKelvin / tColdKelvin);

    // 5. Graining and Blistering Physics
    // Graining happens when surface is cold (glassy) but high lateral sheer force tears rubber blocks
    if (state.surfaceFlashTempC < spec.operationalTempRangeC[0] && slipSpeed > 1.5) {
      const grainingRate = (spec.grainingSensitivity * (slipSpeed / 10.0) * (normalLoad / 5000.0)) * dt * 0.05;
      state.grainingSeverityPercent = Math.min(100.0, state.grainingSeverityPercent + grainingRate);
    } else if (state.surfaceFlashTempC >= spec.operationalTempRangeC[0] && state.grainingSeverityPercent > 0) {
      // Clean up / cure graining when in optimal operating window
      state.grainingSeverityPercent = Math.max(0.0, state.grainingSeverityPercent - 0.02 * dt);
    }

    // Blistering happens when carcass core exceeds boiling point of vulcanization oil (>135°C)
    if (state.carcassCoreTempC > 135.0) {
      const overTemp = state.carcassCoreTempC - 135.0;
      const blisterRate = spec.blisteringSensitivity * (overTemp / 20.0) * dt * 0.08;
      state.blisteringPercent = Math.min(100.0, state.blisteringPercent + blisterRate);
    }

    // 6. Mechanical Tread Wear Rate
    // Wear proportional to frictional work done + temperature penalty
    const tempWearPenalty = state.surfaceFlashTempC > spec.operationalTempRangeC[1] ? 
      1.0 + Math.pow((state.surfaceFlashTempC - spec.operationalTempRangeC[1]) / 25.0, 2) : 1.0;
    
    const slidingDistanceM = slipSpeed * dt;
    const wearMmDelta = (spec.baseWearRatePerKm / 1000.0) * slidingDistanceM * (normalLoad / 3500.0) * tempWearPenalty;
    
    state.wearTreadRemainingMm = Math.max(0.0, state.wearTreadRemainingMm - wearMmDelta);
    state.wearPercent = Math.min(1.0, 1.0 - (state.wearTreadRemainingMm / spec.treadGrooveDepthNominalMm));

    // 7. Grip Multipliers Evaluation
    const thermalGripFactor = this.calculateThermalGripFactor(state.treadBulkTempC, spec);
    
    // Wear grip degradation: fresh tire (1.0) -> worn slick cliff when wear > 90%
    let wearGripFactor = 1.0;
    if (state.wearPercent > 0.85) {
      wearGripFactor = 1.0 - Math.pow((state.wearPercent - 0.85) / 0.15, 2) * 0.45;
    } else {
      wearGripFactor = 1.0 - (state.wearPercent * 0.08); // Mild linear wear loss
    }

    // Surface condition loss from graining / blistering
    const grainingPenalty = 1.0 - (state.grainingSeverityPercent * 0.0025); // Up to -25% grip
    const blisterPenalty = 1.0 - (state.blisteringPercent * 0.0035);        // Up to -35% grip
    const surfaceConditionGripFactor = Math.max(0.40, grainingPenalty * blisterPenalty);

    // 8. Aquaplaning & Wet Loss
    const aquaInfo = this.calculateAquaplaningThreshold(
      state.internalPressureBar,
      state.wearTreadRemainingMm,
      spec.treadGrooveDepthNominalMm,
      inputs.trackWaterFilmThicknessMm,
      spec.waterEvacuationLitersPerSecPerMm
    );

    const vehicleSpeedKph = inputs.vehicleSpeedMps * 3.6;
    const isHydroplaning = inputs.trackWaterFilmThicknessMm > 0.3 && vehicleSpeedKph >= aquaInfo.speedThresholdKph;

    let wetFrictionMultiplier = 1.0;
    if (inputs.trackWaterFilmThicknessMm > 0.1) {
      if (isHydroplaning) {
        wetFrictionMultiplier = 0.05; // Gliding on water wedge!
      } else {
        const hydroplaningApproachRatio = vehicleSpeedKph / aquaInfo.speedThresholdKph;
        wetFrictionMultiplier = Math.max(0.20, 1.0 - (0.45 * Math.pow(hydroplaningApproachRatio, 2)));
      }
    }

    // Final Effective Friction Coefficient Mu
    const effectiveFrictionCoeffMu = spec.peakFrictionCoefficientMu * 
      thermalGripFactor * 
      wearGripFactor * 
      surfaceConditionGripFactor * 
      wetFrictionMultiplier;

    // Structural failure risk (delamination or puncture)
    const pressureOverstress = Math.max(0.0, (state.internalPressureBar - 3.4) * 30.0);
    const heatDelamination = Math.max(0.0, (state.carcassCoreTempC - 150.0) * 2.5);
    const wornCordPuncture = state.wearPercent >= 0.98 ? 85.0 : 0.0;
    const structuralFailureRiskPercent = Math.min(100.0, pressureOverstress + heatDelamination + wornCordPuncture);

    return {
      effectiveFrictionCoeffMu,
      thermalGripFactor,
      wearGripFactor,
      surfaceConditionGripFactor,
      aquaplaningSpeedThresholdKph: aquaInfo.speedThresholdKph,
      isHydroplaning,
      heatGenerationWatts: totalHeatInputWatts,
      heatDissipationWatts: convectionSurfaceToAir + conductionSurfaceToTrack,
      deltaWearMm: wearMmDelta,
      structuralFailureRiskPercent
    };
  }
}
