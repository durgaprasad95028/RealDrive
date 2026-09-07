/**
 * ============================================================================
 * REALDRIVE FRONTEND HOOK - DEALERSHIP SHOWROOM & FINANCING
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';

export interface ShowroomCarItem {
  readonly vehicleId: string;
  readonly brand: string;
  readonly name: string;
  readonly category: string;
  readonly baseMSRPUSD: number;
  readonly horsepowerHp: number;
  readonly torqueNm: number;
  readonly zeroTo100Sec: number;
  readonly topSpeedKph: number;
}

export function useDealershipInventory() {
  const [vehicles, setVehicles] = useState<ShowroomCarItem[]>([]);
  const [selectedCar, setSelectedCar] = useState<ShowroomCarItem | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<string>('trim_base');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [financingQuote, setFinancingQuote] = useState<{
    monthlyPaymentUSD: number;
    totalInterestCostUSD: number;
    totalLoanRepaymentUSD: number;
  } | null>(null);

  useEffect(() => {
    // Standard mock list
    const mockList: ShowroomCarItem[] = [
      { vehicleId: 'veh_hypercar_01', brand: 'APEX MOTORS', name: 'Apex LMH Stradale', category: 'hypercar', baseMSRPUSD: 2450000, horsepowerHp: 1100, torqueNm: 1250, zeroTo100Sec: 2.1, topSpeedKph: 395 },
      { vehicleId: 'veh_gt3_02', brand: 'VELOCE CORSE', name: 'Veloce GT3 Competition', category: 'supercar', baseMSRPUSD: 485000, horsepowerHp: 650, torqueNm: 720, zeroTo100Sec: 2.8, topSpeedKph: 330 },
      { vehicleId: 'veh_jdm_03', brand: 'MIDNIGHT TOKYO', name: 'Horizon Spirit Twin-Turbo', category: 'sports_coupe', baseMSRPUSD: 125000, horsepowerHp: 480, torqueNm: 560, zeroTo100Sec: 3.6, topSpeedKph: 295 }
    ];
    setVehicles(mockList);
    setSelectedCar(mockList[0]);
  }, []);

  const calculateLoan = useCallback((priceUSD: number, downPaymentUSD: number, months: number = 48) => {
    const principal = Math.max(0, priceUSD - downPaymentUSD);
    const apr = 5.9;
    const r = (apr / 100) / 12;
    const factor = Math.pow(1 + r, months);
    const monthly = principal > 0 ? (principal * (r * factor)) / (factor - 1) : 0;
    const totalRepaid = monthly * months;

    setFinancingQuote({
      monthlyPaymentUSD: Math.round(monthly),
      totalInterestCostUSD: Math.round(totalRepaid - principal),
      totalLoanRepaymentUSD: Math.round(totalRepaid + downPaymentUSD)
    });
  }, []);

  return {
    vehicles,
    selectedCar,
    selectedTrim,
    selectedColor,
    financingQuote,
    setSelectedCar,
    setSelectedTrim,
    setSelectedColor,
    calculateLoan
  };
}
