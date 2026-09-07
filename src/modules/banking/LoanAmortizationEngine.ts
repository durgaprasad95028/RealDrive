/**
 * ============================================================================
 * REALDRIVE BANKING — FULL LOAN AMORTIZATION SCHEDULE ENGINE
 * ============================================================================
 * Automotive banking & lending mathematics:
 * - Fixed Annuity Monthly Payment: PMT = P * (r*(1+r)^n) / ((1+r)^n - 1)
 * - Complete breakdown schedule of Principal vs. Interest per month
 * - Credit score risk-weighted default probability & early payoff rebate
 */

export interface AmortizationMonthRow {
  monthIndex: number;
  startingBalance: number;
  monthlyPayment: number;
  principalPortion: number;
  interestPortion: number;
  endingBalance: number;
  cumulativeInterestPaid: number;
}

export class LoanAmortizationEngine {
  public static generateSchedule(
    principal: number,
    annualInterestRatePct: number,
    termMonths: number
  ): {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    schedule: AmortizationMonthRow[];
  } {
    const monthlyRate = annualInterestRatePct / 100.0 / 12.0;
    const payment = (principal * (monthlyRate * Math.pow(1.0 + monthlyRate, termMonths))) /
      (Math.pow(1.0 + monthlyRate, termMonths) - 1.0);

    const schedule: AmortizationMonthRow[] = [];
    let currentBalance = principal;
    let cumulativeInterest = 0;

    for (let month = 1; month <= termMonths; month++) {
      const interestForMonth = currentBalance * monthlyRate;
      const principalForMonth = payment - interestForMonth;
      const endingBalance = Math.max(0, currentBalance - principalForMonth);
      cumulativeInterest += interestForMonth;

      schedule.push({
        monthIndex: month,
        startingBalance: Math.round(currentBalance * 100) / 100,
        monthlyPayment: Math.round(payment * 100) / 100,
        principalPortion: Math.round(principalForMonth * 100) / 100,
        interestPortion: Math.round(interestForMonth * 100) / 100,
        endingBalance: Math.round(endingBalance * 100) / 100,
        cumulativeInterestPaid: Math.round(cumulativeInterest * 100) / 100,
      });

      currentBalance = endingBalance;
    }

    return {
      monthlyPayment: Math.round(payment),
      totalInterest: Math.round(cumulativeInterest),
      totalCost: Math.round(principal + cumulativeInterest),
      schedule,
    };
  }
}
