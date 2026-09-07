/**
 * ============================================================================
 * REALDRIVE TESTS — VEHICLE PHYSICS & DYNO TEST SUITE
 * ============================================================================
 * Unit tests for virtual dynamometer simulation, torque calculation,
 * RK4 physics integration, and aerodynamic downforce / drag effects.
 */

import { DynoSimulationService } from '../modules/vehicles/DynoSimulationService.js';
import { TuningWorkshopService } from '../modules/vehicles/TuningWorkshopService.js';
import { ServerPhysicsTick, VehiclePhysicsState, VehiclePhysicsInput } from '../simulations/ServerPhysicsTick.js';

export function runVehiclePhysicsTestSuite(): { passed: number; failed: number; tests: string[] } {
  const tests: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      tests.push(`[PASS] ${testName}`);
      passed++;
    } else {
      tests.push(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Virtual Dyno Simulation
  const dynoResult = DynoSimulationService.runDynoPull({
    displacementLiters: 3.8,
    cylinders: 6,
    idleRpm: 800,
    redlineRpm: 7500,
    baseTorqueNm: 600,
    ecuStage: 'STAGE_2',
    ignitionTimingDegrees: 4,
    fuelAirTargetRatio: 12.2,
    forcedInductionType: 'TWIN_TURBO',
    targetBoostBar: 1.8,
    intakeType: 'COLD_AIR_CARBON',
    exhaustType: 'STRAIGHT_PIPE_TITANIUM',
    drivetrain: 'AWD',
  }, 'test_car_1', 'GT-R Nismo');

  assert(dynoResult.maxEngineHp > 600, 'Dyno calculates realistic Stage 2 Twin-Turbo horsepower (> 600 HP)');
  assert(dynoResult.maxBoostBar === 1.8, 'Dyno reaches target 1.8 bar manifold boost pressure');
  assert(dynoResult.curve.length > 30, 'Dyno generates high-resolution RPM torque/power curve');

  // Test 2: Server Physics RK4 Step
  let state: VehiclePhysicsState = {
    posX: 0,
    posY: 0,
    posZ: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    yawRate: 0,
    speedKmh: 0,
    engineRpm: 900,
    gear: 1,
    lateralG: 0,
    longitudinalG: 0,
    wheelSlipFL: 0,
    wheelSlipFR: 0,
    wheelSlipRL: 0,
    wheelSlipRR: 0,
  };

  const input: VehiclePhysicsInput = {
    throttle: 1.0,
    brake: 0.0,
    clutch: 0.0,
    handbrake: false,
    steering: 0.0,
    gear: 1,
  };

  const specs = {
    massKg: 1500,
    dragCoefficient: 0.32,
    frontalAreaM2: 2.2,
    downforceCoefficient: 0.45,
    maxPowerHp: 500,
    maxTorqueNm: 650,
    redlineRpm: 7500,
    drivetrain: 'AWD' as const,
    gearRatios: [3.8, 2.4, 1.7, 1.3, 1.0, 0.8, 0.65],
    finalDriveRatio: 3.7,
    tireFrictionCoeff: 1.2,
  };

  // Step 60 frames (1 second of full throttle)
  for (let f = 0; f < 60; f++) {
    state = ServerPhysicsTick.step(state, input, 1 / 60, specs);
  }

  assert(state.speedKmh > 20, 'Vehicle accelerates from 0 km/h under full throttle in 1 second');
  assert(state.posZ > 0, 'Vehicle travels forward along world Z axis');
  assert(state.engineRpm > 2000, 'Engine RPM climbs under drivetrain load');

  return { passed, failed, tests };
}
