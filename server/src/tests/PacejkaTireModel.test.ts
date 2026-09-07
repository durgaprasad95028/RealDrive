/**
 * ============================================================================
 * REALDRIVE TEST SUITE - PACEJKA '02 & TIRE THERMODYNAMICS TEST
 * ============================================================================
 */

import { PacejkaTireModel } from '../simulations/PacejkaTireModel';
import { TireThermalDegradationSolver } from '../simulations/physics/TireThermalDegradationMatrices';

export function runPacejkaTireTests(): boolean {
  let passed = true;
  console.log('[TEST SUITE] Running Pacejka Tire Dynamics & Thermodynamics Tests...');

  // 1. Test Base Pacejka Curve
  const normalLoadN = 4000;
  const slipAngleRad = 0.10; // ~5.7 degrees
  const lateralForceN = PacejkaTireModel.calculateLateralForce(slipAngleRad, normalLoadN, 1.0);

  if (lateralForceN <= 0 || lateralForceN > normalLoadN * 2.5) {
    console.error(`FAIL: Lateral force ${lateralForceN}N is out of physical bounds for ${normalLoadN}N load`);
    passed = false;
  } else {
    console.log(`PASS: Pacejka lateral force calculation: ${Math.round(lateralForceN)}N at 0.10 rad slip`);
  }

  // 2. Test Thermal Model State Initialization
  const wheelState = TireThermalDegradationSolver.createInitialState(0, 'slick_soft_c5', 25.0, 2.0);
  if (wheelState.surfaceFlashTempC !== 25.0 || wheelState.wearPercent !== 0) {
    console.error('FAIL: Initial wheel state incorrect');
    passed = false;
  } else {
    console.log('PASS: Tire state initialized cleanly at 25°C');
  }

  // 3. Test High Slip Heating Integration
  const output = TireThermalDegradationSolver.updateWheelState(wheelState, 'slick_soft_c5', {
    normalLoadN: 4500,
    slipAngleRad: 0.18,
    slipRatio: 0.12,
    slidingVelocityMps: 4.5,
    angularVelocityRadPerSec: 120.0,
    wheelRadiusM: 0.33,
    vehicleSpeedMps: 38.0,
    trackSurfaceTempC: 32.0,
    ambientAirTempC: 22.0,
    trackWaterFilmThicknessMm: 0.0,
    brakeRotorRadiantHeatJoules: 500,
    deltaTimeSec: 0.05
  });

  if (wheelState.surfaceFlashTempC <= 25.0) {
    console.error(`FAIL: Tire did not heat up during heavy slip! Temp = ${wheelState.surfaceFlashTempC}°C`);
    passed = false;
  } else {
    console.log(`PASS: Dynamic friction heating active. Flash Temp rose to ${Math.round(wheelState.surfaceFlashTempC * 10) / 10}°C`);
  }

  if (output.effectiveFrictionCoeffMu <= 0) {
    console.error('FAIL: Effective friction coefficient is non-positive');
    passed = false;
  } else {
    console.log(`PASS: Effective Mu evaluated to ${Math.round(output.effectiveFrictionCoeffMu * 100) / 100}`);
  }

  return passed;
}
