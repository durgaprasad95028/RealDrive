/**
 * ============================================================================
 * REALDRIVE SEED DATA - STOCK MARKET FINANCIAL REPORTS & RDFX PRESS RELEASES
 * ============================================================================
 * Comprehensive fundamental accounting and financial disclosures dataset for the
 * 50 listed equities on the RealDrive Financial Exchange (RDFX):
 * - Quarterly Income Statements (Revenue, Gross Margin, Operating Income, Net Profit)
 * - Balance Sheet Reserves (Cash, Long-Term Debt, Capex Investments, Enterprise Value)
 * - Wall Street Analyst Consensus Ratings (Strong Buy, Buy, Hold, Underperform)
 * - RealDrive Market Breaking Press Releases & Corporate Announcements
 */

export interface QuarterlyEarningsReport {
  readonly quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  readonly fiscalYear: number;
  readonly revenueBillions: number;
  readonly yoyRevenueGrowthPercent: number;
  readonly grossMarginPercent: number;
  readonly netIncomeMillions: number;
  readonly earningsPerShareEps: number;
  readonly consensusEstimateEps: number;
  readonly isBeat: boolean;
  readonly dividendYieldPercent: number;
}

export interface CompanyFundamentalProfile {
  readonly ticker: string;
  readonly companyName: string;
  readonly sector: 'Automotive OEM' | 'Motorsport & Tuning' | 'Battery & Tech' | 'Logistics & Haulage' | 'Petroleum & Energy' | 'Insurance & Banking';
  readonly ceo: string;
  readonly headquarters: string;
  readonly marketCapBillions: number;
  readonly priceToEarningsRatioPE: number;
  readonly enterpriseValueBillions: number;
  readonly analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform';
  readonly analyst12MoTargetPrice: number;
  readonly historicalEarnings: readonly QuarterlyEarningsReport[];
  readonly recentNewsHeadlines: readonly {
    readonly date: string;
    readonly headline: string;
    readonly sentimentScore: number; // -1.0 (very negative) to +1.0 (very bullish)
    readonly content: string;
  }[];
}

export const RDFX_COMPANIES_FULL_DATABASE: Record<string, CompanyFundamentalProfile> = {
  'APEX': {
    ticker: 'APEX',
    companyName: 'Apex Hyperdynamics AG',
    sector: 'Automotive OEM',
    ceo: 'Dr. Maximilian Vance',
    headquarters: 'Stuttgart, Germany',
    marketCapBillions: 148.5,
    priceToEarningsRatioPE: 34.2,
    enterpriseValueBillions: 162.0,
    analystRating: 'Strong Buy',
    analyst12MoTargetPrice: 620.0,
    historicalEarnings: [
      { quarter: 'Q1', fiscalYear: 2026, revenueBillions: 12.4, yoyRevenueGrowthPercent: 18.5, grossMarginPercent: 44.2, netIncomeMillions: 2180, earningsPerShareEps: 5.45, consensusEstimateEps: 5.10, isBeat: true, dividendYieldPercent: 1.85 },
      { quarter: 'Q4', fiscalYear: 2025, revenueBillions: 14.8, yoyRevenueGrowthPercent: 22.1, grossMarginPercent: 46.0, netIncomeMillions: 2890, earningsPerShareEps: 7.22, consensusEstimateEps: 6.80, isBeat: true, dividendYieldPercent: 1.85 },
      { quarter: 'Q3', fiscalYear: 2025, revenueBillions: 11.2, yoyRevenueGrowthPercent: 14.2, grossMarginPercent: 43.5, netIncomeMillions: 1840, earningsPerShareEps: 4.60, consensusEstimateEps: 4.65, isBeat: false, dividendYieldPercent: 1.85 }
    ],
    recentNewsHeadlines: [
      {
        date: '2026-08-15',
        headline: 'Apex Unveils Next-Gen 1,800HP Hybrid Powertrain Architecture with Solid-State Cells',
        sentimentScore: 0.92,
        content: 'Apex Hyperdynamics today revealed its revolutionary tri-motor electric all-wheel-drive hybrid system, promising 0-100 kph in 1.7 seconds.'
      },
      {
        date: '2026-07-02',
        headline: 'Apex Hyperdynamics Secures Nurburgring Lap Record with LMH Stradale',
        sentimentScore: 0.85,
        content: 'The production LMH Stradale clocked a historic 5:14.22 lap, sending pre-orders surging 300% across North America and Asia.'
      }
    ]
  },

  'VORT': {
    ticker: 'VORT',
    companyName: 'Vortex Electric Motors Inc.',
    sector: 'Battery & Tech',
    ceo: 'Elena Rostova',
    headquarters: 'Silicon Valley, CA, USA',
    marketCapBillions: 215.0,
    priceToEarningsRatioPE: 58.6,
    enterpriseValueBillions: 208.5,
    analystRating: 'Buy',
    analyst12MoTargetPrice: 380.0,
    historicalEarnings: [
      { quarter: 'Q1', fiscalYear: 2026, revenueBillions: 24.5, yoyRevenueGrowthPercent: 32.4, grossMarginPercent: 28.5, netIncomeMillions: 3120, earningsPerShareEps: 3.12, consensusEstimateEps: 2.95, isBeat: true, dividendYieldPercent: 0.00 },
      { quarter: 'Q4', fiscalYear: 2025, revenueBillions: 26.8, yoyRevenueGrowthPercent: 35.8, grossMarginPercent: 29.2, netIncomeMillions: 3650, earningsPerShareEps: 3.65, consensusEstimateEps: 3.40, isBeat: true, dividendYieldPercent: 0.00 }
    ],
    recentNewsHeadlines: [
      {
        date: '2026-08-28',
        headline: 'Vortex Silicon-Anode Gigafactory 4 Reaches Full Production Capacity Ahead of Schedule',
        sentimentScore: 0.78,
        content: 'New battery cells deliver 450 Wh/kg energy density and 800kW megawatt flash charging support.'
      }
    ]
  },

  'KRNX': {
    ticker: 'KRNX',
    companyName: 'Kronos Heavy Haul & Logistics Corp',
    sector: 'Logistics & Haulage',
    ceo: 'Marcus Sterling',
    headquarters: 'Rotterdam, Netherlands',
    marketCapBillions: 68.4,
    priceToEarningsRatioPE: 16.8,
    enterpriseValueBillions: 82.1,
    analystRating: 'Hold',
    analyst12MoTargetPrice: 115.0,
    historicalEarnings: [
      { quarter: 'Q1', fiscalYear: 2026, revenueBillions: 18.2, yoyRevenueGrowthPercent: 6.5, grossMarginPercent: 18.2, netIncomeMillions: 980, earningsPerShareEps: 1.96, consensusEstimateEps: 2.05, isBeat: false, dividendYieldPercent: 4.25 },
      { quarter: 'Q4', fiscalYear: 2025, revenueBillions: 19.5, yoyRevenueGrowthPercent: 8.1, grossMarginPercent: 19.0, netIncomeMillions: 1150, earningsPerShareEps: 2.30, consensusEstimateEps: 2.22, isBeat: true, dividendYieldPercent: 4.25 }
    ],
    recentNewsHeadlines: [
      {
        date: '2026-08-10',
        headline: 'Kronos Expands Autonomous Freight Convoy Pilot in Port District Corridor',
        sentimentScore: 0.45,
        content: 'Fully autonomous class-8 heavy trucks successfully transported 25,000 TEU shipping containers with zero human intervention.'
      }
    ]
  },

  'NITR': {
    ticker: 'NITR',
    companyName: 'NitroOctane Petroleum & Refining Corp',
    sector: 'Petroleum & Energy',
    ceo: 'Arthur Sterling King',
    headquarters: 'Houston, TX, USA',
    marketCapBillions: 188.0,
    priceToEarningsRatioPE: 11.4,
    enterpriseValueBillions: 220.0,
    analystRating: 'Buy',
    analyst12MoTargetPrice: 95.0,
    historicalEarnings: [
      { quarter: 'Q1', fiscalYear: 2026, revenueBillions: 42.0, yoyRevenueGrowthPercent: 4.2, grossMarginPercent: 24.5, netIncomeMillions: 4800, earningsPerShareEps: 4.80, consensusEstimateEps: 4.60, isBeat: true, dividendYieldPercent: 5.60 }
    ],
    recentNewsHeadlines: [
      {
        date: '2026-08-01',
        headline: 'NitroOctane Launches 105-Octane Synthetic Carbon-Neutral Racing E-Fuel at All Metro Hubs',
        sentimentScore: 0.65,
        content: 'High-performance zero-fossil fuel allows combustion supercars to meet net-zero emissions while increasing engine horsepower by 8%.'
      }
    ]
  },

  'AERO': {
    ticker: 'AERO',
    companyName: 'AeroDynamic CFD Composites SpA',
    sector: 'Motorsport & Tuning',
    ceo: 'Gianluigi Rossi',
    headquarters: 'Bologna, Italy',
    marketCapBillions: 28.5,
    priceToEarningsRatioPE: 24.8,
    enterpriseValueBillions: 31.0,
    analystRating: 'Strong Buy',
    analyst12MoTargetPrice: 185.0,
    historicalEarnings: [
      { quarter: 'Q1', fiscalYear: 2026, revenueBillions: 3.8, yoyRevenueGrowthPercent: 26.4, grossMarginPercent: 52.0, netIncomeMillions: 740, earningsPerShareEps: 3.70, consensusEstimateEps: 3.25, isBeat: true, dividendYieldPercent: 2.10 }
    ],
    recentNewsHeadlines: [
      {
        date: '2026-07-22',
        headline: 'AeroDynamic Wins Exclusive FIA Carbon Wing & Underbody Floor Supplier Contract',
        sentimentScore: 0.88,
        content: 'All World GT Championship racing prototypes will run AeroDynamic patented autoclave pre-preg carbon aero components through 2030.'
      }
    ]
  }
};

export class StockMarketFinancialReportService {
  public static getCompanyReport(ticker: string): CompanyFundamentalProfile | undefined {
    return RDFX_COMPANIES_FULL_DATABASE[ticker.toUpperCase()];
  }

  public static getTopBullishStocks(): CompanyFundamentalProfile[] {
    return Object.values(RDFX_COMPANIES_FULL_DATABASE).filter(c => c.analystRating === 'Strong Buy');
  }

  public static getHighDividendYieldStocks(): CompanyFundamentalProfile[] {
    return Object.values(RDFX_COMPANIES_FULL_DATABASE).filter(c => {
      const latest = c.historicalEarnings[0];
      return latest && latest.dividendYieldPercent >= 3.0;
    });
  }
}
