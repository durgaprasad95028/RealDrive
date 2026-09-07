/**
 * FinancialBankingEngine — Banking, Vehicle Financing, Credit Scores, Stock Market & Auto Insurance
 */

export interface BankAccountProfile {
  checkingBalanceCredits: number;
  savingsBalanceCredits: number;
  savingsApyPercent: number; // e.g. 4.5% APY
  creditScore: number; // 300 to 850
  creditRatingTier: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT' | 'PRIME_VIP';
  activeLoans: AutoFinancingLoan[];
  insurancePolicy: AutoInsurancePolicy;
  stockPortfolio: StockHolding[];
  transactionHistory: FinancialTransaction[];
}

export interface AutoFinancingLoan {
  loanId: string;
  vehicleName: string;
  principalAmount: number;
  remainingBalance: number;
  interestRateApr: number; // e.g. 5.9% APR
  loanTermMonths: number;
  monthlyPaymentCredits: number;
  paymentsRemaining: number;
  isDelinquent: boolean;
  missedPaymentsCount: number;
}

export type InsurancePlanTier = 'NONE' | 'LIABILITY_ONLY' | 'COLLISION_STANDARD' | 'COMPREHENSIVE_VIP';

export interface AutoInsurancePolicy {
  planTier: InsurancePlanTier;
  dailyPremiumCredits: number;
  deductibleCredits: number;
  coversTrackRacing: boolean;
  coversTheft: boolean;
  coversModifications: boolean;
}

export interface StockMarketTicker {
  symbol: string;
  companyName: string;
  sector: 'AUTOMOTIVE_OEM' | 'LOGISTICS_FREIGHT' | 'EV_TECHNOLOGY' | 'ENERGY_PETROLEUM' | 'ADVANCED_MATERIALS';
  currentPrice: number;
  previousClosePrice: number;
  dayHighPrice: number;
  dayLowPrice: number;
  priceChangePercent: number;
  marketCapBillions: number;
  priceHistory: number[];
}

export interface StockHolding {
  symbol: string;
  sharesOwned: number;
  averagePurchasePrice: number;
}

export interface FinancialTransaction {
  id: string;
  timestamp: number;
  description: string;
  amountCredits: number; // positive for deposit, negative for withdrawal/expense
  category: 'CAREER_INCOME' | 'VEHICLE_PURCHASE' | 'TUNING_EXPENSE' | 'LOAN_PAYMENT' | 'INSURANCE' | 'INVESTMENT';
}

export class FinancialBankingEngine {
  public static readonly MARKET_TICKERS: StockMarketTicker[] = [
    {
      symbol: 'APEX',
      companyName: 'Apex Motor Corporation',
      sector: 'AUTOMOTIVE_OEM',
      currentPrice: 142.5,
      previousClosePrice: 139.8,
      dayHighPrice: 144.2,
      dayLowPrice: 138.9,
      priceChangePercent: 1.93,
      marketCapBillions: 85.4,
      priceHistory: [136, 137.5, 138, 139.8, 142.5],
    },
    {
      symbol: 'CYBR',
      companyName: 'CyberSurge EV Powertrains',
      sector: 'EV_TECHNOLOGY',
      currentPrice: 285.0,
      previousClosePrice: 278.4,
      dayHighPrice: 292.0,
      dayLowPrice: 275.5,
      priceChangePercent: 2.37,
      marketCapBillions: 112.0,
      priceHistory: [260, 268, 274, 278.4, 285.0],
    },
    {
      symbol: 'TITN',
      companyName: 'Titan Logistics Global Haul',
      sector: 'LOGISTICS_FREIGHT',
      currentPrice: 78.2,
      previousClosePrice: 79.1,
      dayHighPrice: 80.0,
      dayLowPrice: 77.8,
      priceChangePercent: -1.14,
      marketCapBillions: 34.2,
      priceHistory: [82, 81, 79.5, 79.1, 78.2],
    },
    {
      symbol: 'PETR',
      companyName: 'Apex Petrochemical Refining',
      sector: 'ENERGY_PETROLEUM',
      currentPrice: 94.6,
      previousClosePrice: 93.0,
      dayHighPrice: 95.8,
      dayLowPrice: 92.5,
      priceChangePercent: 1.72,
      marketCapBillions: 58.6,
      priceHistory: [90, 91.5, 92.2, 93.0, 94.6],
    },
  ];

  /**
   * Calculates monthly auto loan payments:
   * M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
   */
  public static calculateMonthlyLoanPayment(
    principal: number,
    annualInterestRatePercent: number,
    termMonths: number
  ): number {
    const r = annualInterestRatePercent / 100 / 12;
    const n = termMonths;
    if (r === 0) return Math.round(principal / n);
    const m = principal * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    return Math.round(m);
  }

  /**
   * Evaluates auto financing application based on credit score
   */
  public static applyForAutoLoan(
    vehicleName: string,
    vehiclePrice: number,
    downPayment: number,
    termMonths: number,
    creditScore: number
  ): { approved: boolean; loan?: AutoFinancingLoan; reason: string } {
    const loanAmount = vehiclePrice - downPayment;
    if (downPayment < vehiclePrice * 0.1) {
      return { approved: false, reason: 'Down payment must be at least 10% of vehicle purchase price.' };
    }

    let apr = 5.9; // Base APR
    if (creditScore < 580) {
      return { approved: false, reason: 'Credit score below minimum financing threshold (580 required).' };
    } else if (creditScore < 660) {
      apr = 12.5;
    } else if (creditScore < 740) {
      apr = 6.8;
    } else {
      apr = 3.9; // Prime rate
    }

    const monthly = this.calculateMonthlyLoanPayment(loanAmount, apr, termMonths);

    const loan: AutoFinancingLoan = {
      loanId: `loan_${Date.now()}`,
      vehicleName,
      principalAmount: loanAmount,
      remainingBalance: loanAmount,
      interestRateApr: apr,
      loanTermMonths: termMonths,
      monthlyPaymentCredits: monthly,
      paymentsRemaining: termMonths,
      isDelinquent: false,
      missedPaymentsCount: 0,
    };

    return {
      approved: true,
      loan,
      reason: `Financing approved at ${apr}% APR! Monthly payment: $${monthly.toLocaleString()}/mo for ${termMonths} months.`,
    };
  }

  /**
   * Updates market stock prices with random walk volatility
   */
  public static tickStockMarket(): void {
    for (const ticker of this.MARKET_TICKERS) {
      const deltaPercent = (Math.random() - 0.49) * 2.5; // slight upward drift
      const newPrice = Math.round(ticker.currentPrice * (1 + deltaPercent / 100) * 10) / 10;
      ticker.priceChangePercent = Math.round(((newPrice - ticker.previousClosePrice) / ticker.previousClosePrice) * 1000) / 10;
      ticker.currentPrice = newPrice;
      ticker.dayHighPrice = Math.max(ticker.dayHighPrice, newPrice);
      ticker.dayLowPrice = Math.min(ticker.dayLowPrice, newPrice);
      ticker.priceHistory.push(newPrice);
      if (ticker.priceHistory.length > 30) ticker.priceHistory.shift();
    }
  }
}
