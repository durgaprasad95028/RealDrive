/**
 * ============================================================================
 * REALDRIVE TEST SUITE - DYNO SIMULATION & ECU MAPPING TEST
 * ============================================================================
 */

import { DynoGraphGeneratorService } from '../modules/tuning_dyno/DynoGraphGeneratorService';

export function runDynoSimulationTests(): boolean {
  let passed = true;
  console.log('[TEST SUITE] Running Dynamometer & Engine Power Tests...');

  const dyno = DynoGraphGeneratorService.getInstance();
  const summary = dyno.runDynamometerPull(550, 650, 8500, 22.0, 12.0, 25.0, 14.0);

  if (summary.peakHorsepowerBhp < 550) {
    console.error(`FAIL: Boosted HP ${summary.peakHorsepowerBhp} should exceed baseline 550 HP`);
    passed = false;
  } else {
    console.log(`PASS: Dyno generated ${summary.peakHorsepowerBhp} BHP @ ${summary.peakHorsepowerRpm} RPM`);
  }

  if (summary.plotData.length < 20) {
    console.error('FAIL: Dyno plot points too sparse');
    passed = false;
  } else {
    console.log(`PASS: Generated ${summary.plotData.length} discrete RPM resolution points across powerband`);
  }

  return passed;
}
