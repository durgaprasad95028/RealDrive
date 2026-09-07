/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — PACEJKA MAGIC FORMULA '02 TIRE MODEL
 * ============================================================================
 * High-fidelity tire force calculation:
 * - Longitudinal force (Fx) vs. Slip Ratio (kappa)
 * - Lateral force (Fy) vs. Slip Angle (alpha)
 * - Camber thrust force (F_gamma)
 * - Vertical normal load sensitivity (Fz non-linear de-cambering)
 * - Surface friction multiplier (dry asphalt, wet rain, gravel, ice)
 * - Thermal core & surface temperature grip bell curve (Optimal: 85°C - 105°C)
 */

export interface TirePacejkaCoefficients {
  B: number; // Stiffness factor
  C: number; // Shape factor
  D: number; // Peak value
  E: number; // Curvature factor
}

export interface TireState {
  normalLoadN: number; // Vertical load Fz in Newtons
  slipAngleRad: number; // Side slip angle alpha in radians
  slipRatioKappa: number; // Longitudinal slip ratio (-1.0 to +1.0)
  camberAngleRad: number; // Camber inclination gamma
  surfaceTempC: number; // Tire tread surface temp (ambient to 180°C)
  coreTempC: number; // Tire carcass internal temp
  pressurePsi: number; // Inflation pressure (20 to 45 psi)
  treadWearPct: number; // 0% (bald) to 100% (new)
  surfaceGripCoeff: number; // Surface friction (0.2 to 1.1)
}

export interface TireForcesResult {
  longitudinalForceN: number; // Fx
  lateralForceN: number; // Fy
  aligningTorqueNm: number; // Mz (self-aligning steering torque)
  camberThrustN: number;
  gripAvailablePct: number;
  heatGeneratedWatts: number;
}

export class PacejkaTireModel {
  /**
   * Magic Formula curve evaluation: y(x) = D * sin(C * arctan(B*x - E*(B*x - arctan(B*x))))
   */
  public static evaluateMagicFormula(x: number, coeffs: TirePacejkaCoefficients): number {
    const Bx = coeffs.B * x;
    const atanBx = Math.atan(Bx);
    const inner = Bx - coeffs.E * (Bx - atanBx);
    return coeffs.D * Math.sin(coeffs.C * Math.atan(inner));
  }

  /**
   * Calculates dynamic tire forces under combined longitudinal and lateral slip.
   */
  public static calculateTireForces(
    state: TireState,
    compoundType: 'STREET' | 'SPORT' | 'SEMI_SLICK' | 'RACE_SLICK' = 'SPORT'
  ): TireForcesResult {
    const Fz = Math.max(100, state.normalLoadN); // Minimum normal load 100N

    // Thermal grip multiplier (Bell curve around 95°C)
    const optTemp = compoundType === 'RACE_SLICK' ? 100.0 : 85.0;
    const tempDelta = Math.abs(state.surfaceTempC - optTemp);
    const thermalGripMultiplier = Math.max(0.60, 1.0 - Math.pow(tempDelta / 60.0, 2) * 0.40);

    // Wear grip degradation
    const wearMultiplier = 0.70 + (state.treadWearPct / 100.0) * 0.30;

    // Peak friction coefficient (mu) with load sensitivity: mu = mu0 / (1 + a * Fz)
    let baseMu = 1.15;
    if (compoundType === 'SEMI_SLICK') baseMu = 1.35;
    if (compoundType === 'RACE_SLICK') baseMu = 1.65;
    if (compoundType === 'STREET') baseMu = 0.95;

    const loadSensitivityFactor = 1.0 / (1.0 + (Fz / 8000.0) * 0.15);
    const effectiveMu = baseMu * state.surfaceGripCoeff * thermalGripMultiplier * wearMultiplier * loadSensitivityFactor;

    // Longitudinal Coefficients
    const longCoeffs: TirePacejkaCoefficients = {
      B: 10.0,
      C: 1.65,
      D: effectiveMu * Fz,
      E: -0.5,
    };

    // Lateral Coefficients
    const latCoeffs: TirePacejkaCoefficients = {
      B: 8.5,
      C: 1.30,
      D: effectiveMu * Fz,
      E: -0.8,
    };

    // Pure slip forces
    const pureFx = PacejkaTireModel.evaluateMagicFormula(state.slipRatioKappa, longCoeffs);
    const pureFy = PacejkaTireModel.evaluateMagicFormula(state.slipAngleRad, latCoeffs);

    // Camber thrust contribution: F_gamma = Fz * G_gamma * gamma
    const camberThrust = Fz * 0.015 * (state.camberAngleRad * (180.0 / Math.PI));

    // Friction ellipse combined slip interaction: (Fx/Fx_max)^2 + (Fy/Fy_max)^2 <= 1.0
    const maxFrictionForce = effectiveMu * Fz;
    const combinedHypot = Math.sqrt(pureFx * pureFx + pureFy * pureFy);

    let finalFx = pureFx;
    let finalFy = pureFy + camberThrust;

    if (combinedHypot > maxFrictionForce) {
      const scale = maxFrictionForce / combinedHypot;
      finalFx *= scale;
      finalFy *= scale;
    }

    // Self-aligning pneumatic trail torque: Mz = -Fy * pneumaticTrail
    const pneumaticTrailMeters = 0.035 * Math.exp(-Math.abs(state.slipAngleRad) * 4.0);
    const aligningTorque = -finalFy * pneumaticTrailMeters;

    // Frictional heat generation (Watts): P = |Fx * v_slip_x| + |Fy * v_slip_y|
    const slipSpeedMs = Math.sqrt(
      Math.pow(state.slipRatioKappa * 20.0, 2) +
      Math.pow(Math.tan(state.slipAngleRad) * 20.0, 2)
    );
    const heatWatts = Math.abs(combinedHypot * slipSpeedMs * 0.15);

    const gripAvailable = (1.0 - Math.min(1.0, combinedHypot / maxFrictionForce)) * 100.0;

    return {
      longitudinalForceN: Math.round(finalFx * 10) / 10,
      lateralForceN: Math.round(finalFy * 10) / 10,
      aligningTorqueNm: Math.round(aligningTorque * 100) / 100,
      camberThrustN: Math.round(camberThrust * 10) / 10,
      gripAvailablePct: Math.round(gripAvailable),
      heatGeneratedWatts: Math.round(heatWatts),
    };
  }
}
