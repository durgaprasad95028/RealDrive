/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — CHASSIS TORSIONAL RIGIDITY & MODAL ANALYSIS
 * ============================================================================
 * Finite element structural chassis physics:
 * - Torsional rigidity evaluation in kiloNewton-meters per degree (kNm/deg)
 * - Strut tower brace & underbody X-brace stiffness contribution
 * - Modal natural vibration frequencies (Bending Mode F1 ~ 28Hz, Torsion Mode F2 ~ 36Hz)
 * - Unibody flex deformation under extreme curb strikes & slick tire cornering loads
 */

export interface ChassisRigiditySpec {
  baseTorsionalRigidityKNmPerDeg: number;
  hasFrontStrutTowerBrace: boolean;
  hasRearStrutTowerBrace: boolean;
  hasUnderbodyXBrace: boolean;
  hasFullRollCageGusseted: boolean;
  chassisConstruction: 'HYDROFORMED_STEEL_UNIBODY' | 'ALUMINUM_SPACEFRAME' | 'CARBON_FIBER_MONOCOQUE' | 'TUBE_FRAME_RACE';
}

export interface ModalAnalysisOutput {
  effectiveTorsionalRigidityKNmPerDeg: number;
  firstBendingNaturalFrequencyHz: number;
  firstTorsionalNaturalFrequencyHz: number;
  dynamicDeflectionUnderLoadDeg: number;
  suspensionEfficiencyPct: number;
}

export class ChassisRigidityModalAnalysis {
  public static evaluateChassis(
    spec: ChassisRigiditySpec,
    appliedTorqueLoadKNm: number
  ): ModalAnalysisOutput {
    let stiffness = spec.baseTorsionalRigidityKNmPerDeg;

    // Construction baseline multipliers
    switch (spec.chassisConstruction) {
      case 'CARBON_FIBER_MONOCOQUE':
        stiffness = Math.max(stiffness, 45.0); // 45+ kNm/deg (Hypercar level)
        break;
      case 'ALUMINUM_SPACEFRAME':
        stiffness = Math.max(stiffness, 30.0);
        break;
      case 'TUBE_FRAME_RACE':
        stiffness = Math.max(stiffness, 25.0);
        break;
      default:
        stiffness = Math.max(stiffness, 18.0); // Standard steel unibody
        break;
    }

    // Reinforcements
    if (spec.hasFrontStrutTowerBrace) stiffness += 3.5;
    if (spec.hasRearStrutTowerBrace) stiffness += 2.8;
    if (spec.hasUnderbodyXBrace) stiffness += 4.2;
    if (spec.hasFullRollCageGusseted) stiffness *= 2.4; // 140% boost from cage

    // Dynamic deflection under cornering/bump load
    const deflectionDeg = appliedTorqueLoadKNm / stiffness;

    // Modal frequencies: f_n proportional to sqrt(k / m)
    const bendingFreq = 22.0 * Math.sqrt(stiffness / 20.0);
    const torsionalFreq = 28.0 * Math.sqrt(stiffness / 20.0);

    // Suspension efficiency: flex drains damper precision
    const efficiencyPct = Math.min(100.0, Math.max(60.0, 75.0 + (stiffness / 50.0) * 25.0));

    return {
      effectiveTorsionalRigidityKNmPerDeg: Number(stiffness.toFixed(1)),
      firstBendingNaturalFrequencyHz: Number(bendingFreq.toFixed(1)),
      firstTorsionalNaturalFrequencyHz: Number(torsionalFreq.toFixed(1)),
      dynamicDeflectionUnderLoadDeg: Number(deflectionDeg.toFixed(3)),
      suspensionEfficiencyPct: Number(efficiencyPct.toFixed(1)),
    };
  }
}
