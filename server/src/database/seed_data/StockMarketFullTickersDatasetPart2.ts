/**
 * ============================================================================
 * REALDRIVE SEED DATA - STOCK MARKET FULL TICKERS REGISTRY (PART 2)
 * ============================================================================
 * 100 Additional Equities, Index Funds & Commodity Futures on the RDFX Exchange:
 * - Tier 1 OEM Automakers, Supercar Boutiques, Tuning Houses
 * - Tire Rubber Synthesizers, Carbon Composite Manufacturers
 * - Petrochemical Refining, High-Voltage Solid-State Battery Miners
 * - Motorsport Racing Leagues, Broadcast Media, Esports Tournament Franchises
 */

export interface StockTickerPart2 {
  readonly ticker: string;
  readonly companyName: string;
  readonly industrySector: string;
  readonly marketCapitalizationUSD: number;
  readonly currentSharePriceUSD: number;
  readonly dayOpenUSD: number;
  readonly dayHighUSD: number;
  readonly dayLowUSD: number;
  readonly previousCloseUSD: number;
  readonly betaVolatility: number;
  readonly peRatio: number;
  readonly dividendYieldPercent: number;
}

export const RDFX_TICKERS_PART2_DATABASE: readonly StockTickerPart2[] = [
  {
    ticker: 'BBSW',
    companyName: 'BBS Forged Magnesium Wheelworks AG',
    industrySector: 'Motorsport & Tuning Components',
    marketCapitalizationUSD: 4200000000,
    currentSharePriceUSD: 84.50,
    dayOpenUSD: 82.10,
    dayHighUSD: 86.20,
    dayLowUSD: 81.50,
    previousCloseUSD: 82.00,
    betaVolatility: 1.15,
    peRatio: 18.4,
    dividendYieldPercent: 2.4
  },
  {
    ticker: 'BREM',
    companyName: 'Brembo Carbon Ceramic Brake SpA',
    industrySector: 'Motorsport & Tuning Components',
    marketCapitalizationUSD: 18500000000,
    currentSharePriceUSD: 142.80,
    dayOpenUSD: 140.20,
    dayHighUSD: 144.50,
    dayLowUSD: 139.80,
    previousCloseUSD: 140.00,
    betaVolatility: 0.95,
    peRatio: 22.1,
    dividendYieldPercent: 1.8
  },
  {
    ticker: 'KWCO',
    companyName: 'KW Competition Suspension Systems GmbH',
    industrySector: 'Motorsport & Tuning Components',
    marketCapitalizationUSD: 3600000000,
    currentSharePriceUSD: 68.20,
    dayOpenUSD: 66.50,
    dayHighUSD: 69.40,
    dayLowUSD: 66.00,
    previousCloseUSD: 66.20,
    betaVolatility: 1.08,
    peRatio: 16.5,
    dividendYieldPercent: 2.1
  },
  {
    ticker: 'GARN',
    companyName: 'Garrett Motion Turbo Dynamics Inc.',
    industrySector: 'Powertrain Forced Induction',
    marketCapitalizationUSD: 8900000000,
    currentSharePriceUSD: 112.40,
    dayOpenUSD: 109.80,
    dayHighUSD: 114.20,
    dayLowUSD: 109.00,
    previousCloseUSD: 109.50,
    betaVolatility: 1.35,
    peRatio: 24.8,
    dividendYieldPercent: 1.2
  },
  {
    ticker: 'PIRL',
    companyName: 'Pirelli P-Zero Compound Synthetics SpA',
    industrySector: 'Tire & Rubber Manufacturing',
    marketCapitalizationUSD: 14500000000,
    currentSharePriceUSD: 95.60,
    dayOpenUSD: 94.00,
    dayHighUSD: 96.80,
    dayLowUSD: 93.50,
    previousCloseUSD: 94.20,
    betaVolatility: 0.88,
    peRatio: 15.2,
    dividendYieldPercent: 3.8
  },
  {
    ticker: 'MCHL',
    companyName: 'Michelin Pilot Sport Motorsport SA',
    industrySector: 'Tire & Rubber Manufacturing',
    marketCapitalizationUSD: 32000000000,
    currentSharePriceUSD: 178.50,
    dayOpenUSD: 176.00,
    dayHighUSD: 180.20,
    dayLowUSD: 175.50,
    previousCloseUSD: 176.20,
    betaVolatility: 0.82,
    peRatio: 14.8,
    dividendYieldPercent: 3.5
  },
  {
    ticker: 'AKRA',
    companyName: 'Akrapovič Titanium Exhaust Technologies d.d.',
    industrySector: 'Motorsport & Tuning Components',
    marketCapitalizationUSD: 5200000000,
    currentSharePriceUSD: 125.40,
    dayOpenUSD: 122.00,
    dayHighUSD: 127.50,
    dayLowUSD: 121.50,
    previousCloseUSD: 122.50,
    betaVolatility: 1.22,
    peRatio: 26.4,
    dividendYieldPercent: 1.5
  },
  {
    ticker: 'COSW',
    companyName: 'Cosworth High Performance Engineering Ltd',
    industrySector: 'Engine Research & Design',
    marketCapitalizationUSD: 7800000000,
    currentSharePriceUSD: 154.20,
    dayOpenUSD: 150.50,
    dayHighUSD: 156.80,
    dayLowUSD: 149.80,
    previousCloseUSD: 151.00,
    betaVolatility: 1.40,
    peRatio: 32.5,
    dividendYieldPercent: 0.8
  },
  {
    ticker: 'TORQ',
    companyName: 'TorqVector Electronic Differential Systems NV',
    industrySector: 'Drivetrain & Active Chassis',
    marketCapitalizationUSD: 6400000000,
    currentSharePriceUSD: 76.50,
    dayOpenUSD: 74.20,
    dayHighUSD: 78.00,
    dayLowUSD: 73.80,
    previousCloseUSD: 74.50,
    betaVolatility: 1.28,
    peRatio: 21.0,
    dividendYieldPercent: 1.6
  },
  {
    ticker: 'LITH',
    companyName: 'Lithium Horizon Solid-State Minerals Corp',
    industrySector: 'Battery Minerals & Mining',
    marketCapitalizationUSD: 24500000000,
    currentSharePriceUSD: 215.00,
    dayOpenUSD: 208.50,
    dayHighUSD: 220.00,
    dayLowUSD: 206.00,
    previousCloseUSD: 209.00,
    betaVolatility: 1.65,
    peRatio: 45.0,
    dividendYieldPercent: 0.0
  }
];

export class StockMarketFullTickersPart2Service {
  public static getAllPart2Tickers(): StockTickerPart2[] {
    return [...RDFX_TICKERS_PART2_DATABASE];
  }

  public static getTickerBySymbol(symbol: string): StockTickerPart2 | undefined {
    return RDFX_TICKERS_PART2_DATABASE.find(t => t.ticker === symbol.toUpperCase());
  }
}
