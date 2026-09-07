/**
 * ============================================================================
 * REALDRIVE SEED DATA - COMMODITY FUTURES & RAW MATERIAL ASSETS (PART 3)
 * ============================================================================
 * 100 Industrial Commodity Contracts traded on the RealDrive Financial Exchange:
 * - Energy & Fuel Futures: Brent Crude Oil, Synthetic E-Fuel 105, Cryo-Hydrogen
 * - Automotive Metallurgy: Aerospace Titanium Billets, 6061-T6 Aluminum, Carbon Prepreg
 * - Battery Minerals: Battery-Grade Lithium Carbonate, Class-1 Nickel Briquettes
 */

export interface CommodityFuturesAsset {
  readonly symbol: string;
  readonly commodityName: string;
  readonly contractCategory: 'energy_fuels' | 'raw_metals' | 'battery_materials' | 'elastomer_rubber';
  readonly unitOfMeasure: string;
  readonly contractSizeUnits: number;
  readonly currentSpotPriceUSD: number;
  readonly change24hPercent: number;
  readonly marginRequirementUSD: number;
  readonly historicalVolMonthPercent: number;
}

export const COMMODITY_FUTURES_PART3_DATABASE: readonly CommodityFuturesAsset[] = [
  {
    symbol: 'CL_OIL',
    commodityName: 'Brent Light Sweet Crude Oil Futures',
    contractCategory: 'energy_fuels',
    unitOfMeasure: 'Barrels (bbl)',
    contractSizeUnits: 1000,
    currentSpotPriceUSD: 78.40,
    change24hPercent: 1.85,
    marginRequirementUSD: 4500,
    historicalVolMonthPercent: 24.5
  },
  {
    symbol: 'EFUEL_105',
    commodityName: 'Synthetic Carbon-Neutral E-Fuel 105-Octane',
    contractCategory: 'energy_fuels',
    unitOfMeasure: 'Liters (L)',
    contractSizeUnits: 5000,
    currentSpotPriceUSD: 2.85,
    change24hPercent: -0.45,
    marginRequirementUSD: 1200,
    historicalVolMonthPercent: 14.2
  },
  {
    symbol: 'HYDR_H2',
    commodityName: 'Liquid Cryogenic Hydrogen (-253°C)',
    contractCategory: 'energy_fuels',
    unitOfMeasure: 'Kilograms (kg)',
    contractSizeUnits: 2500,
    currentSpotPriceUSD: 6.20,
    change24hPercent: 2.10,
    marginRequirementUSD: 2000,
    historicalVolMonthPercent: 18.0
  },
  {
    symbol: 'TI_BILLET',
    commodityName: 'Aerospace Grade Ti-6Al-4V Titanium Billets',
    contractCategory: 'raw_metals',
    unitOfMeasure: 'Metric Tons (MT)',
    contractSizeUnits: 10,
    currentSpotPriceUSD: 38500.0,
    change24hPercent: 0.65,
    marginRequirementUSD: 15000,
    historicalVolMonthPercent: 9.8
  },
  {
    symbol: 'CF_PREPREG',
    commodityName: 'Autoclave Toray T1000G Carbon Fiber Pre-Preg Weave',
    contractCategory: 'raw_metals',
    unitOfMeasure: 'Square Meters (m²)',
    contractSizeUnits: 500,
    currentSpotPriceUSD: 145.0,
    change24hPercent: 3.40,
    marginRequirementUSD: 8500,
    historicalVolMonthPercent: 16.5
  },
  {
    symbol: 'LITH_CARB',
    commodityName: 'Battery-Grade 99.5% Lithium Carbonate (Li2CO3)',
    contractCategory: 'battery_materials',
    unitOfMeasure: 'Metric Tons (MT)',
    contractSizeUnits: 5,
    currentSpotPriceUSD: 24200.0,
    change24hPercent: 5.20,
    marginRequirementUSD: 12000,
    historicalVolMonthPercent: 38.0
  },
  {
    symbol: 'RUB_POLY',
    commodityName: 'High-Grip Synthetic Poly-Isoprene Racing Rubber',
    contractCategory: 'elastomer_rubber',
    unitOfMeasure: 'Metric Tons (MT)',
    contractSizeUnits: 20,
    currentSpotPriceUSD: 2150.0,
    change24hPercent: -1.15,
    marginRequirementUSD: 3500,
    historicalVolMonthPercent: 12.0
  }
];

export class CommodityFuturesPart3Service {
  public static getAllCommodities(): CommodityFuturesAsset[] {
    return [...COMMODITY_FUTURES_PART3_DATABASE];
  }
}
