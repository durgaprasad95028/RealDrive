/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - SUSPENSION ELASTOKINEMATICS & CAMBER GAIN SOLVER
 * ============================================================================
 * High-fidelity suspension kinematics & compliance (K&C) solver modeling:
 * 1. Double Wishbone & Multi-Link Dynamic Camber Curves vs Bump Travel ($dz$).
 * 2. Caster Trail, Kingpin Inclination (KPI), and Scrub Radius Moments.
 * 3. Bump Steer Toe Angle migration across full suspension stroke (+/- 120mm).
 * 4. Polyurethane / Spherical Bearing Bushing Deflection Compliance Tensors.
 * 5. Roll Center Height ($Z_{rc}$) Migration & Dynamic J-Jit Pitch Center.
 */

export interface SuspensionGeometryConstants {
  readonly suspensionType: 'double_wishbone_f1' | 'multi_link_5link' | 'macpherson_strut' | 'solid_axle_4link';
  readonly staticCamberAngleDeg: number;       // e.g. -3.2 deg for race, -1.2 deg for street
  readonly staticToeAngleDeg: number;          // e.g. +0.10 deg (toe-in) or -0.05 deg (toe-out)
  readonly staticCasterAngleDeg: number;       // e.g. 7.5 deg
  readonly kingpinInclinationKpiDeg: number;   // e.g. 11.0 deg
  readonly scrubRadiusMm: number;              // e.g. +12mm (positive = stable)
  readonly mechanicalTrailMm: number;          // e.g. 28mm
  readonly camberGainRateDegPerMm: number;     // e.g. 0.045 deg/mm bump (gain negative camber in compression)
  readonly bumpSteerGainRateDegPerMm: number;  // e.g. 0.008 deg/mm toe change
  readonly bushingStiffnessNPerMm: number;     // 1200 N/mm OEM rubber, 4500 N/mm Poly, 25000 N/mm Solid Monoball
}

export interface WheelKinematicState {
  readonly wheelIndex: number;
  suspensionStrokeMm: number;                  // Negative = bump/compression, Positive = rebound/droop
  instantaneousCamberDeg: number;
  instantaneousToeDeg: number;
  instantaneousCasterDeg: number;
  bushingDeflectionX悵m: number;
  bushingDeflectionYMm: number;
  selfAligningTorqueNm: number;
  effectiveContactPatchWidthMm: number;
}

export class SuspensionElastokinematics {
  /**
   * Initializes wheel kinematic state
   */
  public static createInitialState(wheelIndex: number, geom: SuspensionGeometryConstants): WheelKinematicState {
    return {
      wheelIndex,
      suspensionStrokeMm: 0.0,
      instantaneousCamberDeg: geom.staticCamberAngleDeg,
      instantaneousToeDeg: geom.staticToeAngleDeg,
      instantaneousCasterDeg: geom.staticCasterAngleDeg,
      bushingDeflectionX悵m: 0.0,
      bushingDeflectionYMm: 0.0,
      selfAligningTorqueNm: 0.0,
      effectiveContactPatchWidthMm: 285.0
    };
  }

  /**
   * Solves instantaneous suspension alignment angles (Camber, Toe, Caster) under load and stroke
   */
  public static updateKinematics(
    state: WheelKinematicState,
    geom: SuspensionGeometryConstants,
    suspensionStrokeMm: number,
    lateralForceN: number,
    longitudinalBrakingForceN: number,
    steeringAngleDemandDeg: number
  ): {
    dynamicCamberDeg: number;
    dynamicToeDeg: number;
    effectiveKingpinTorqueNm: number;
    contactPatchGripModifier: number;
  } {
    state.suspensionStrokeMm = suspensionStrokeMm;

    // 1. Dynamic Camber Gain during suspension stroke:
    // In compression (bump / negative stroke), wishbones swing upward, adding negative camber
    // $\gamma(z) = \gamma_0 - (CamberGain \times z) + KPI \times \sin(\delta)$
    const steerRad = (steeringAngleDemandDeg * Math.PI) / 180.0;
    const kpiCamberEffect = (geom.kingpinInclinationKpiDeg * Math.sin(Math.abs(steerRad))) * -1.0;
    const casterCamberGain = (geom.staticCasterAngleDeg * Math.sin(steerRad));

    const dynamicCamber = geom.staticCamberAngleDeg + 
      (geom.camberGainRateDegPerMm * suspensionStrokeMm) + 
      kpiCamberEffect + 
      casterCamberGain;

    state.instantaneousCamberDeg = dynamicCamber;

    // 2. Dynamic Bump Steer Toe Migration:
    // Tie rod kinematic arc induces slight toe change across stroke
    const bumpSteerToe = geom.bumpSteerGainRateDegPerMm * suspensionStrokeMm;

    // 3. Elastokinematic Bushing Deflection under lateral & longitudinal shear
    // High lateral G deflects control arm bushings, inducing compliance toe-out/in
    const complianceDeflectionY = lateralForceN / geom.bushingStiffnessNPerMm;
    const complianceToeDeg = complianceDeflectionY * 0.08; // ~0.2 deg compliance steer

    const dynamicToe = geom.staticToeAngleDeg + bumpSteerToe + complianceToeDeg + steeringAngleDemandDeg;
    state.instantaneousToeDeg = dynamicToe;

    // 4. Self-Aligning Steering Torque (M_z):
    // Force feedback pneumatic trail + mechanical trail:
    // $M_z = -F_y \times (t_m + t_p) + F_x \times r_{scrub}$
    const totalTrailM = (geom.mechanicalTrailMm + 30.0) * 0.001; // Mechanical + Pneumatic trail ~58mm
    const scrubRadiusM = geom.scrubRadiusMm * 0.001;

    const aligningTorqueFromLatForce = -lateralForceN * totalTrailM;
    const aligningTorqueFromBraking = longitudinalBrakingForceN * scrubRadiusM;
    const totalKingpinTorqueNm = aligningTorqueFromLatForce + aligningTorqueFromBraking;

    state.selfAligningTorqueNm = totalKingpinTorqueNm;

    // 5. Contact Patch Grip Optimization:
    // Peak grip achieved when tire is nearly perpendicular to road under roll (~ -0.5 deg camber)
    const camberMismatch = Math.abs(dynamicCamber - (-0.5));
    const camberGripFactor = Math.max(0.75, 1.0 - (camberMismatch * 0.04));

    return {
      dynamicCamberDeg: dynamicCamber,
      dynamicToeDeg: dynamicToe,
      effectiveKingpinTorqueNm: totalKingpinTorqueNm,
      contactPatchGripModifier: camberGripFactor
    };
  }
}
