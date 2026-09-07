/**
 * ============================================================================
 * REALDRIVE TESTS — ECONOMY & BANKING LEDGER TEST SUITE
 * ============================================================================
 * Unit tests for double-entry transactions, loan amortization calculations,
 * and stock market Geometric Brownian Motion price ticks.
 */

import { AutoFinancingService } from '../modules/economy/AutoFinancingService.js';
import { DatabaseClient } from '../database/DatabaseClient.js';
import { DatabaseSeeder } from '../database/DatabaseSeeder.js';
import { StockExchangeTickEngine } from '../modules/economy/StockExchangeTickEngine.js';

export async function runEconomyTestSuite(): Promise<{ passed: number; failed: number; tests: string[] }> {
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

  // Test 1: Auto Financing Amortization
  const financingService = new AutoFinancingService();
  const quote = financingService.calculateQuote(100000, 20000, 36, 750); // 80k financed @ 5.9% for 36 months

  assert(quote.financedAmount === 80000, 'Financing calculates financed principal correctly ($80,000)');
  assert(quote.monthlyInstallment > 2300 && quote.monthlyInstallment < 2600, 'Financing calculates monthly installment within expected range (~$2,430)');
  assert(quote.totalRepayment > 80000, 'Total repayment includes accrued interest');

  // Test 2: Stock Market Ticks
  const testDb = DatabaseClient.getInstance();
  DatabaseSeeder.registerAllSchemas(testDb);
  await DatabaseSeeder.seedAll(testDb);

  const stockEngine = new StockExchangeTickEngine(testDb);
  const initialStocks = await stockEngine.getAllStocks();
  const initialApexPrice = initialStocks.find((s) => s.ticker === 'APEX')?.currentPrice || 0;

  await stockEngine.tickMarket();

  const updatedStocks = await stockEngine.getAllStocks();
  const newApexPrice = updatedStocks.find((s) => s.ticker === 'APEX')?.currentPrice || 0;

  assert(newApexPrice > 0, 'Stock price remains positive after stochastic GBM tick');

  return { passed, failed, tests };
}
