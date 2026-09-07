/**
 * ============================================================================
 * REALDRIVE TUNING — ADVANCED ECU 3D FUEL MAP & TIMING STUDIO
 * ============================================================================
 * Standalone Motorsport ECU 3D Calibration Matrix:
 * - 16x16 Volumetric Efficiency (VE) table (RPM 1000-9000 vs Throttle 0%-100%)
 * - 16x16 Ignition Timing Advance Angle table (-5° to +42° BTDC)
 * - Variable Valve Timing (VTEC / Dual-VANOS) high-cam crossover point (e.g. 5,800 RPM)
 * - Anti-Lag launch control 2-step rev limiters and rolling combustion cut
 */

export interface Ecu3DMatrix {
  rpmBins: number[]; // 16 intervals: [1000, 1500, 2000, ..., 8500, 9000]
  throttleBins: number[]; // 16 intervals: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 85, 90, 95, 98, 100]
  fuelVeMatrix: number[][]; // 16x16 percentage values (40% to 125%)
  ignitionTimingMatrix: number[][]; // 16x16 degrees advance (5° to 38°)
  vtecCrossoverRpm: number;
  launchControl2StepRpm: number;
  antiLagAggressionLevel: number; // 1 (mild burble) to 5 (flame shooter)
}

export class ECUStudioService {
  public static createDefaultEcuMap(): Ecu3DMatrix {
    const rpmBins = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500];
    const throttleBins = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 85, 90, 95, 98, 100];

    const fuelVeMatrix: number[][] = [];
    const ignitionTimingMatrix: number[][] = [];

    for (let r = 0; r < 16; r++) {
      const fuelRow: number[] = [];
      const timingRow: number[] = [];

      for (let t = 0; t < 16; t++) {
        // Higher load/rpm = higher fuel VE
        const rpmFactor = (r + 1) / 16.0;
        const loadFactor = (t + 1) / 16.0;

        const ve = 45.0 + (rpmFactor * 40.0) + (loadFactor * 35.0);
        // Timing decreases under high boost/load to prevent knock detonation
        const timing = 34.0 - (loadFactor * 18.0) + (rpmFactor * 8.0);

        fuelRow.push(Math.round(ve * 10) / 10);
        timingRow.push(Math.round(timing * 10) / 10);
      }

      fuelVeMatrix.push(fuelRow);
      ignitionTimingMatrix.push(timingRow);
    }

    return {
      rpmBins,
      throttleBins,
      fuelVeMatrix,
      ignitionTimingMatrix,
      vtecCrossoverRpm: 5800,
      launchControl2StepRpm: 4200,
      antiLagAggressionLevel: 3,
    };
  }

  public static interpolateCell(matrix: Ecu3DMatrix, rpm: number, throttlePct: number): { vePct: number; timingDeg: number } {
    const clampedRpm = Math.max(1000, Math.min(8500, rpm));
    const clampedThrottle = Math.max(0, Math.min(100, throttlePct));

    const rIdx = Math.min(14, Math.floor((clampedRpm - 1000) / 500));
    const tIdx = Math.min(14, Math.floor(clampedThrottle / 7));

    const ve = matrix.fuelVeMatrix[rIdx][tIdx];
    const timing = matrix.ignitionTimingMatrix[rIdx][tIdx];

    return { vePct: ve, timingDeg: timing };
  }
}
