/**
 * ============================================================================
 * REALDRIVE FRONTEND HOOK - DYNO LAB & ECU TUNING STUDIO
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import { VehicleApiClient } from '../services/api/VehicleApiClient';

export interface DynoPlotPointDto {
  readonly rpm: number;
  readonly flywheelHorsepowerBhp: number;
  readonly wheelHorsepowerWhp: number;
  readonly flywheelTorqueNm: number;
  readonly wheelTorqueNm: number;
  readonly turboBoostPsi: number;
  readonly airFuelRatioAfr: number;
  readonly exhaustGasTempC: number;
  readonly volumetricEfficiencyPercent: number;
  readonly brakeMeanEffectivePressureBar: number;
}

export interface DynoRunResultDto {
  readonly peakHorsepowerBhp: number;
  readonly peakHorsepowerRpm: number;
  readonly peakTorqueNm: number;
  readonly peakTorqueRpm: number;
  readonly peakBoostPsi: number;
  readonly redlineRpm: number;
  readonly drivetrainLossPercent: number;
  readonly estimatedQuarterMileSec: number;
  readonly plotData: readonly DynoPlotPointDto[];
}

export function useDynoLab() {
  const [dynoResult, setDynoResult] = useState<DynoRunResultDto | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ecuSettings, setEcuSettings] = useState({
    boostTargetPsi: 18.0,
    targetAirFuelRatio: 12.2,
    ignitionAdvanceDeg: 24.0
  });

  const runDynoTest = useCallback(async (vehicleId: string) => {
    setIsRunning(true);
    try {
      // Simulate dyno pull
      await new Promise(r => setTimeout(r, 1200));

      const maxRpm = 8500;
      const boost = ecuSettings.boostTargetPsi;
      const baseHp = 550 + (boost - 10) * 22;
      const baseTorque = 620 + (boost - 10) * 28;

      const plotData: DynoPlotPointDto[] = [];
      for (let rpm = 1000; rpm <= maxRpm; rpm += 250) {
        const factor = Math.sin(((rpm - 1000) / (maxRpm - 1000)) * Math.PI);
        const hp = Math.round(baseHp * (0.3 + 0.7 * factor));
        const tq = Math.round(baseTorque * (0.45 + 0.55 * Math.sin(((rpm - 1000) / (maxRpm - 1000)) * (Math.PI * 0.85))));
        plotData.push({
          rpm,
          flywheelHorsepowerBhp: hp,
          wheelHorsepowerWhp: Math.round(hp * 0.85),
          flywheelTorqueNm: tq,
          wheelTorqueNm: Math.round(tq * 0.85),
          turboBoostPsi: Math.round(boost * 10) / 10,
          airFuelRatioAfr: ecuSettings.targetAirFuelRatio,
          exhaustGasTempC: 750,
          volumetricEfficiencyPercent: 98.5,
          brakeMeanEffectivePressureBar: 18.2
        });
      }

      setDynoResult({
        peakHorsepowerBhp: Math.round(baseHp),
        peakHorsepowerRpm: 7200,
        peakTorqueNm: Math.round(baseTorque),
        peakTorqueRpm: 4800,
        peakBoostPsi: boost,
        redlineRpm: maxRpm,
        drivetrainLossPercent: 15.0,
        estimatedQuarterMileSec: 9.85,
        plotData
      });

      // Also notify backend
      VehicleApiClient.runDynoTest(vehicleId).catch(() => {});
    } catch (e) {
      console.error('Dyno run failed', e);
    } finally {
      setIsRunning(false);
    }
  }, [ecuSettings]);

  const updateEcuParameter = useCallback((param: 'boostTargetPsi' | 'targetAirFuelRatio' | 'ignitionAdvanceDeg', value: number) => {
    setEcuSettings(prev => ({ ...prev, [param]: value }));
  }, []);

  return {
    dynoResult,
    isRunning,
    ecuSettings,
    updateEcuParameter,
    runDynoTest
  };
}
