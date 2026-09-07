/**
 * ============================================================================
 * REALDRIVE TEST SUITE - DEALERSHIP FINANCING & APPRAISAL TEST
 * ============================================================================
 */

import { ShowroomInventoryService } from '../modules/dealership/ShowroomInventoryService';

export function runDealershipFinancingTests(): boolean {
  let passed = true;
  console.log('[TEST SUITE] Running Dealership Financing & Appraisal Tests...');

  const showroom = ShowroomInventoryService.getInstance();

  // Test 1: Financing Calculation
  const plan = showroom.calculateFinancing(100000, 20000, 'good', 48);

  if (plan.monthlyPaymentUSD <= 0 || plan.principalLoanUSD !== 80000) {
    console.error(`FAIL: Financing plan invalid: ${JSON.stringify(plan)}`);
    passed = false;
  } else {
    console.log(`PASS: Financing computed $${plan.monthlyPaymentUSD}/mo on $80k principal over 48mo`);
  }

  // Test 2: Trade-in Appraisal
  const appraisal = showroom.appraiseTradeInVehicle('BNR34-0058421');
  if (appraisedTradeInValueUSD(appraisal) <= 0) {
    console.error('FAIL: Trade-in appraisal value non-positive');
    passed = false;
  } else {
    console.log(`PASS: Appraised Skyline GT-R for trade-in: $${appraisal.appraisedTradeInValueUSD}`);
  }

  return passed;
}

function appraisedTradeInValueUSD(obj: any): number {
  return obj.appraisedTradeInValueUSD || 0;
}
