/**
 * ============================================================================
 * REALDRIVE TEST SUITE - TRANSMISSION GEAR OPTIMIZER TEST
 * ============================================================================
 */

import { TransmissionGearRatioOptimizer, PowertrainSpec, GearboxConfig } from '../simulations/physics/TransmissionGearRatioOptimizer';

export function runTransmissionOptimizerTests(): boolean {
  let passed = true;
  console.log('[TEST SUITE] Running Transmission Gear Optimizer Tests...');

  const samplePowertrain: PowertrainSpec = {
    engineTorqueCurve: [
      { rpm: 1000, torqueNm: 250 },
      { rpm: 3000, torqueNm: 480 },
      { rpm: 5500, torqueNm: 620 },
      { rpm: 7200, torqueNm: 580 },
      { rpm: 8500, torqueNm: 460 }
    ],
    idleRpm: 900,
    redlineRpm: 8500,
    revLimiterRpm: 8700,
    flywheelInertiaKgM2: 0.12,
    finalDriveRatio: 3.44,
    tireRollingRadiusM: 0.33,
    vehicleCurbMassKg: 1450,
    totalRotatingInertiaDrivelineKgM2: 0.45,
    dragCoefficientCd: 0.31,
    frontalAreaM2: 2.1,
    rollingResistanceCrr: 0.012
  };

  const sampleGearbox: GearboxConfig = {
    type: 'dual_clutch_dct',
    gearCount: 6,
    gearRatios: [3.20, 3.82, 2.36, 1.68, 1.29, 1.03, 0.84],
    shiftTimeSec: 0.08,
    clutchEngagementDurationSec: 0.15,
    mechanicalEfficiency: 0.94,
    maxTorqueCapacityNm: 850
  };

  // 1. Test Shift Point Calculus
  const shifts = TransmissionGearRatioOptimizer.calculateOptimalShiftPoints(samplePowertrain, sampleGearbox);
  if (shifts.length !== 5) {
    console.error(`FAIL: Expected 5 upshift rules for 6-speed gearbox, got ${shifts.length}`);
    passed = false;
  } else {
    console.log(`PASS: Calculated ${shifts.length} shift crossover recommendations successfully`);
  }

  // 2. Test 0-100 kph Acceleration Simulation
  const results = TransmissionGearRatioOptimizer.simulateAccelerationRun(samplePowertrain, sampleGearbox);
  if (results.zeroTo100KphTimeSec <= 1.0 || results.zeroTo100KphTimeSec > 8.0) {
    console.error(`FAIL: Unreal 0-100 time: ${results.zeroTo100KphTimeSec}s`);
    passed = false;
  } else {
    console.log(`PASS: Simulated 0-100 km/h sprint in ${results.zeroTo100KphTimeSec.toFixed(2)}s, 1/4 mile in ${results.quarterMileTimeSec.toFixed(2)}s`);
  }

  return passed;
}
