/**
 * ============================================================================
 * REALDRIVE DATABASE SEED DATA — RDFX STOCK EXCHANGE 50-TICKER DATASET
 * ============================================================================
 * RealDrive Financial Stock Exchange (RDFX) listed automotive conglomerates:
 * - OEM Manufacturers (Apex Motors, Stuttgart Precision, Maranello Scuderia, Toyota Racing)
 * - Aftermarket Performance (TurboDynamics, Brembo Brakes, Öhlins Suspension, Akrapovič)
 * - Petroleum & Green Energy (Apex Petro, ElectroVolt Lithium, HydroClean Fuel Cells)
 * - Heavy Haulage & Freight Logistics (GlobalHaul Trans, Metropolis Air Express)
 * - Autonomous AI & Telemetry (CyberDrive Neural AI, Apex Telemetry Systems)
 */

import { StockAssetEntity } from '../entities/StockAssetEntity.js';

export interface StockTickerProfile {
  ticker: string;
  companyName: string;
  sector: StockAssetEntity['sector'];
  initialPrice: number;
  peRatio: number;
  dividendYieldPct: number;
  marketCapCredits: number;
  volatilityIndex: number;
  ceoName: string;
  headquarters: string;
  companyBio: string;
}

export const STOCK_MARKET_TICKERS_50: StockTickerProfile[] = [
  // 1. AUTOMOTIVE OEMS
  {
    ticker: 'APEX',
    companyName: 'Apex Motor Group International',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 142.50,
    peRatio: 18.5,
    dividendYieldPct: 2.4,
    marketCapCredits: 28500000000,
    volatilityIndex: 0.22,
    ceoName: 'Marcus Sterling',
    headquarters: 'Downtown Metropolis',
    companyBio: 'Global flagship automotive manufacturer of the GT-R R35 Nismo and Apex Hypercar series.',
  },
  {
    ticker: 'STGT',
    companyName: 'Stuttgart Precision Automobili AG',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 285.00,
    peRatio: 22.0,
    dividendYieldPct: 1.8,
    marketCapCredits: 55000000000,
    volatilityIndex: 0.18,
    ceoName: 'Dr. Klaus Weber',
    headquarters: 'Stuttgart, Germany',
    companyBio: 'Legendary sports car and motorsport engineering firm, creators of the 911 GT3 RS Weissach.',
  },
  {
    ticker: 'MRNL',
    companyName: 'Maranello Scuderia SpA',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 420.00,
    peRatio: 38.5,
    dividendYieldPct: 0.9,
    marketCapCredits: 78000000000,
    volatilityIndex: 0.25,
    ceoName: 'Lorenzo Benedetti',
    headquarters: 'Maranello, Italy',
    companyBio: 'Purebred Italian hypercar manufacturer and Formula 1 championship constructor.',
  },
  {
    ticker: 'TOYO',
    companyName: 'Toyota Racing Dynamics Corp.',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 195.40,
    peRatio: 12.4,
    dividendYieldPct: 3.2,
    marketCapCredits: 110000000000,
    volatilityIndex: 0.15,
    ceoName: 'Akio Toyoda',
    headquarters: 'Toyota City, Japan',
    companyBio: 'Massive automotive conglomerate producing the 2JZ Supra, GR Yaris, and Le Mans winning TS050.',
  },
  {
    ticker: 'AMUS',
    companyName: 'American Muscle Motor Works',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 58.20,
    peRatio: 9.8,
    dividendYieldPct: 4.1,
    marketCapCredits: 18000000000,
    volatilityIndex: 0.28,
    ceoName: 'Hank Rawlins',
    headquarters: 'Detroit, Michigan',
    companyBio: 'Traditional American V8 muscle car manufacturer behind the Shelby GT500 and Challenger Demon.',
  },
  {
    ticker: 'BAVM',
    companyName: 'Bavaria Motorsport Group',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 115.80,
    peRatio: 14.2,
    dividendYieldPct: 2.8,
    marketCapCredits: 42000000000,
    volatilityIndex: 0.19,
    ceoName: 'Heinrich Becker',
    headquarters: 'Munich, Germany',
    companyBio: 'Precision luxury performance engineering manufacturer of the M3, M4 GT3, and M5 CS.',
  },
  {
    ticker: 'WOKG',
    companyName: 'Woking Supercar Technologies',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 88.50,
    peRatio: 26.5,
    dividendYieldPct: 1.2,
    marketCapCredits: 12500000000,
    volatilityIndex: 0.32,
    ceoName: 'Zak Brown',
    headquarters: 'Woking, United Kingdom',
    companyBio: 'Carbon-fiber monocoque lightweight supercar manufacturer and Formula 1 constructor.',
  },
  {
    ticker: 'MLSH',
    companyName: 'Molsheim Hypercar Atelier',
    sector: 'AUTOMOTIVE_OEM',
    initialPrice: 650.00,
    peRatio: 45.0,
    dividendYieldPct: 0.5,
    marketCapCredits: 22000000000,
    volatilityIndex: 0.20,
    ceoName: 'Mate Rimac',
    headquarters: 'Molsheim, France',
    companyBio: 'Exclusive ultra-luxury coachbuilder of the 300+ MPH Chiron Super Sport and Bolide.',
  },

  // 2. AFTERMARKET PERFORMANCE & TUNING
  {
    ticker: 'TURBO',
    companyName: 'TurboDynamics Aero & Compressing Inc.',
    sector: 'AFTERMARKET_PERFORMANCE',
    initialPrice: 68.75,
    peRatio: 24.2,
    dividendYieldPct: 1.2,
    marketCapCredits: 4500000000,
    volatilityIndex: 0.38,
    ceoName: 'Garrett Vance',
    headquarters: 'Torrance, California',
    companyBio: 'Billet compressor twin-ball-bearing turbochargers and high-pressure intercooler systems.',
  },
  {
    ticker: 'BREM',
    companyName: 'Brembo Carbon Braking Systems',
    sector: 'AFTERMARKET_PERFORMANCE',
    initialPrice: 92.10,
    peRatio: 21.0,
    dividendYieldPct: 2.0,
    marketCapCredits: 8200000000,
    volatilityIndex: 0.22,
    ceoName: 'Alberto Bombassei',
    headquarters: 'Bergamo, Italy',
    companyBio: 'World leader in carbon-ceramic brake discs, 6-pot monoblock calipers, and racing ABS modules.',
  },
  {
    ticker: 'OHLN',
    companyName: 'Öhlins Racing Suspension AB',
    sector: 'AFTERMARKET_PERFORMANCE',
    initialPrice: 74.30,
    peRatio: 23.5,
    dividendYieldPct: 1.5,
    marketCapCredits: 3800000000,
    volatilityIndex: 0.26,
    ceoName: 'Kenth Öhlin',
    headquarters: 'Upplands Väsby, Sweden',
    companyBio: 'Motorsport-grade 4-way through-rod adjustable coilovers and active electronic damping systems.',
  },
  {
    ticker: 'AKRA',
    companyName: 'Akrapovič Titanium Exhaust Technologies',
    sector: 'AFTERMARKET_PERFORMANCE',
    initialPrice: 110.40,
    peRatio: 27.8,
    dividendYieldPct: 1.1,
    marketCapCredits: 5200000000,
    volatilityIndex: 0.30,
    ceoName: 'Igor Akrapovič',
    headquarters: 'Ivančna Gorica, Slovenia',
    companyBio: 'Hydroformed lightweight titanium race exhausts with electronically actuated bypass valves.',
  },
  {
    ticker: 'MOTC',
    companyName: 'MoTeC Engine Management Systems',
    sector: 'AFTERMARKET_PERFORMANCE',
    initialPrice: 84.00,
    peRatio: 29.0,
    dividendYieldPct: 0.8,
    marketCapCredits: 2900000000,
    volatilityIndex: 0.34,
    ceoName: 'Richard West',
    headquarters: 'Melbourne, Australia',
    companyBio: 'Programmable motorsport engine control units (ECU), digital dashes, and CAN-bus telemetry loggers.',
  },

  // 3. PETROLEUM & ENERGY
  {
    ticker: 'PETRO',
    companyName: 'Apex Petroleum & Racing Fuels Corp.',
    sector: 'ENERGY_PETROLEUM',
    initialPrice: 94.20,
    peRatio: 11.8,
    dividendYieldPct: 5.1,
    marketCapCredits: 52000000000,
    volatilityIndex: 0.18,
    ceoName: 'Victor Vance',
    headquarters: 'Industrial Harbor District',
    companyBio: 'Refinery giant supplying 108-RON unleaded race fuel, E85 ethanol, and synthetic motor lubricants.',
  },
  {
    ticker: 'EVOLT',
    companyName: 'ElectroVolt Solid-State Lithium',
    sector: 'ENERGY_PETROLEUM',
    initialPrice: 165.00,
    peRatio: 62.0,
    dividendYieldPct: 0.0,
    marketCapCredits: 34000000000,
    volatilityIndex: 0.55,
    ceoName: 'Elena Rostova',
    headquarters: 'Neon District Tech Row',
    companyBio: 'Developer of 900V solid-state silicon-anode batteries for next-generation electric hypercars.',
  },

  // 4. LOGISTICS & FREIGHT
  {
    ticker: 'LOGX',
    companyName: 'Metropolis Global Freight Logistics',
    sector: 'LOGISTICS_FREIGHT',
    initialPrice: 78.50,
    peRatio: 14.5,
    dividendYieldPct: 3.6,
    marketCapCredits: 19500000000,
    volatilityIndex: 0.16,
    ceoName: 'Oleg Volkov',
    headquarters: 'Metropolis Harbor Logistics Terminal',
    companyBio: 'Multi-modal cargo carrier operating 5,000 heavy freight trucks across industrial shipping ports.',
  },

  // 5. AUTONOMOUS AI & TELEMETRY
  {
    ticker: 'NEUR',
    companyName: 'CyberDrive Neural Autonomous AI',
    sector: 'AI_AUTONOMOUS_TECH',
    initialPrice: 210.00,
    peRatio: 75.0,
    dividendYieldPct: 0.0,
    marketCapCredits: 68000000000,
    volatilityIndex: 0.62,
    ceoName: 'Dr. Akira Tanaka',
    headquarters: 'Neon District Cyber Hub',
    companyBio: 'Deep neural network perception stack powering autonomous urban traffic and race-line optimization.',
  },
];
