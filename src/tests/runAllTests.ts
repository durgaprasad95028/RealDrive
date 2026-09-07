/**
 * ============================================================================
 * REALDRIVE TEST RUNNER - COMPLETE SERVER INTEGRATION SUITE
 * ============================================================================
 */

import { runAuthModuleTests } from './AuthModule.test';
import { runVehiclePhysicsTests } from './VehiclePhysics.test';
import { runMultiplayerSpatialGridTests } from './MultiplayerSpatialGrid.test';
import { runEconomyLedgerTests } from './EconomyLedger.test';
import { runPacejkaTireTests } from './PacejkaTireModel.test';
import { runTransmissionOptimizerTests } from './TransmissionOptimizer.test';
import { runDynoSimulationTests } from './DynoSimulationCurves.test';
import { runAntiCheatTests } from './AntiCheatValidation.test';
import { runDealershipFinancingTests } from './DealershipFinancing.test';

export async function runAllIntegrationTests(): Promise<boolean> {
  console.log('================================================================');
  console.log('STARTING REALDRIVE BACKEND & PHYSICS ENGINE VERIFICATION SUITE');
  console.log('================================================================');

  let allPassed = true;

  try {
    if (!runAuthModuleTests()) allPassed = false;
    if (!runVehiclePhysicsTests()) allPassed = false;
    if (!runMultiplayerSpatialGridTests()) allPassed = false;
    if (!runEconomyLedgerTests()) allPassed = false;
    if (!runPacejkaTireTests()) allPassed = false;
    if (!runTransmissionOptimizerTests()) allPassed = false;
    if (!runDynoSimulationTests()) allPassed = false;
    if (!runAntiCheatTests()) allPassed = false;
    if (!runDealershipFinancingTests()) allPassed = false;
  } catch (err) {
    console.error('Test execution exception:', err);
    allPassed = false;
  }

  console.log('================================================================');
  if (allPassed) {
    console.log('ALL REALDRIVE TESTS PASSED SUCCESSFULLY! (100% PASS RATE)');
  } else {
    console.error('SOME TESTS FAILED! CHECK OUTPUT ABOVE.');
  }
  console.log('================================================================');

  return allPassed;
}
