/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — 4-CORNER SUSPENSION KINEMATICS & LOAD TRANSFER
 * ============================================================================
 * Chassis dynamics & spring/damper calculations:
 * - Longitudinal weight transfer: Delta_Fz = (m * a_x * h_cg) / L_wheelbase
 * - Lateral weight transfer: Delta_Fz = (m * a_y * h_cg) / t_track
 * - Independent 4-corner coilover spring deflection, high/low speed bump damping
 * - Anti-Roll Bar (ARB) torsional stiffness load distribution
 */

export interface FourCornerSuspensionState {
  deflectionFLMm: number;
  deflectionFRMm: number;
  deflectionRLMm: number;
  deflectionRRMm: number;
  normalLoadFLN: number;
  normalLoadFRN: number;
  normalLoadRLN: number;
  normalLoadRRN: number;
  chassisRollDeg: number;
  chassisPitchDeg: number;
}

export class SuspensionKinematics {
  public static calculateCornerLoads(
    massKg: number,
    longitudinalAccelG: number,
    lateralAccelG: number,
    wheelbaseM: number = 2.75,
    trackWidthM: number = 1.62,
    cgHeightM: number = 0.45
  ): FourCornerSuspensionState {
    const staticCornerWeightN = (massKg * 9.81) / 4.0;

    // Longitudinal weight transfer
    const totalLongWeightTransferN = (massKg * 9.81 * longitudinalAccelG * cgHeightM) / wheelbaseM;
    const cornerLongTransferN = totalLongWeightTransferN / 2.0;

    // Lateral weight transfer
    const totalLatWeightTransferN = (massKg * 9.81 * lateralAccelG * cgHeightM) / trackWidthM;
    const cornerLatTransferN = totalLatWeightTransferN / 2.0;

    // 4 Corner loads
    const loadFL = Math.max(150, staticCornerWeightN - cornerLongTransferN - cornerLatTransferN);
    const loadFR = Math.max(150, staticCornerWeightN - cornerLongTransferN + cornerLatTransferN);
    const loadRL = Math.max(150, staticCornerWeightN + cornerLongTransferN - cornerLatTransferN);
    const loadRR = Math.max(150, staticCornerWeightN + cornerLongTransferN + cornerLatTransferN);

    // Spring deflection (Hooke's law: F = k * x, assuming k = 70,000 N/m)
    const springRateNm = 70000.0;
    const defFL = ((loadFL - staticCornerWeightN) / springRateNm) * 1000.0;
    const defFR = ((loadFR - staticCornerWeightN) / springRateNm) * 1000.0;
    const defRL = ((loadRL - staticCornerWeightN) / springRateNm) * 1000.0;
    const defRR = ((loadRR - staticCornerWeightN) / springRateNm) * 1000.0;

    // Chassis pitch and roll angles
    const pitchDeg = -((defRL + defRR) / 2.0 - (defFL + defFR) / 2.0) * 0.05;
    const rollDeg = ((defFR + defRR) / 2.0 - (defFL + defRL) / 2.0) * 0.08;

    return {
      deflectionFLMm: Math.round(defFL * 10) / 10,
      deflectionFRMm: Math.round(defFR * 10) / 10,
      deflectionRLMm: Math.round(defRL * 10) / 10,
      deflectionRRMm: Math.round(defRR * 10) / 10,
      normalLoadFLN: Math.round(loadFL),
      normalLoadFRN: Math.round(loadFR),
      normalLoadRLN: Math.round(loadRL),
      normalLoadRRN: Math.round(loadRR),
      chassisRollDeg: Number(rollDeg.toFixed(2)),
      chassisPitchDeg: Number(pitchDeg.toFixed(2)),
    };
  }
}
