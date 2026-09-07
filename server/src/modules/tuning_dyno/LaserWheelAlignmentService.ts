/**
 * ============================================================================
 * REALDRIVE TUNING — 4-WHEEL LASER ALIGNMENT & GEOMETRY SERVICE
 * ============================================================================
 * Professional laser optical alignment calibration:
 * - Camber angle adjustment (Negative camber lateral cornering bite vs straight line braking grip)
 * - Caster angle sweep (Self-centering dynamic straight line stability and steering weight feedback)
 * - Toe-In / Toe-Out tracking (Turn-in agility vs high-speed straight tracking)
 * - Thrust line angle & Kingpin Inclination (KPI) scrub radius optimization
 */

export interface LaserAlignmentSetup {
  camberFrontLeftDeg: number;
  camberFrontRightDeg: number;
  camberRearLeftDeg: number;
  camberRearRightDeg: number;
  toeFrontTotalMm: number; // Positive = Toe-In, Negative = Toe-Out
  toeRearTotalMm: number;
  casterFrontDeg: number;
  kingpinInclinationDeg: number;
  thrustAngleDeg: number;
}

export interface AlignmentPerformanceImpact {
  turnInCrispnessRating: number; // 0 to 100
  highSpeedStabilityRating: number; // 0 to 100
  tireWearRateMultiplier: number; // 1.0 = normal, 2.5 = aggressive track wear
  maximumCorneringGForceDelta: number;
  straightLineBrakingDeltaPct: number;
}

export class LaserWheelAlignmentService {
  public static calculateAlignmentDynamics(setup: LaserAlignmentSetup): AlignmentPerformanceImpact {
    const avgFrontCamber = (setup.camberFrontLeftDeg + setup.camberFrontRightDeg) / 2.0;
    const avgRearCamber = (setup.camberRearLeftDeg + setup.camberRearRightDeg) / 2.0;

    // Negative camber increases cornering grip up to -3.5 deg
    let corneringGDelta = 0;
    if (avgFrontCamber < 0) {
      const camberMagnitude = Math.abs(avgFrontCamber);
      corneringGDelta = Math.min(0.35, camberMagnitude * 0.085);
    }

    // High negative camber reduces straight-line braking patch
    let brakingDelta = 0;
    if (Math.abs(avgFrontCamber) > 2.0) {
      brakingDelta = -(Math.abs(avgFrontCamber) - 2.0) * 3.5;
    }

    // Toe-out in front boosts turn-in crispness
    let turnInScore = 75;
    if (setup.toeFrontTotalMm < 0) {
      turnInScore += Math.min(20, Math.abs(setup.toeFrontTotalMm) * 6.0); // Toe out turns in fast
    } else {
      turnInScore -= Math.min(15, setup.toeFrontTotalMm * 4.0);
    }

    // High caster & toe-in rear increases high-speed stability
    let stabilityScore = 80;
    stabilityScore += (setup.casterFrontDeg - 5.0) * 3.0;
    if (setup.toeRearTotalMm > 0) {
      stabilityScore += Math.min(10, setup.toeRearTotalMm * 3.0);
    }

    // Tire wear multiplier
    let wearMultiplier = 1.0;
    wearMultiplier += (Math.abs(avgFrontCamber) / 3.0) * 0.8;
    wearMultiplier += (Math.abs(setup.toeFrontTotalMm) / 2.0) * 0.5;

    return {
      turnInCrispnessRating: Math.round(Math.min(100, Math.max(0, turnInScore))),
      highSpeedStabilityRating: Math.round(Math.min(100, Math.max(0, stabilityScore))),
      tireWearRateMultiplier: Number(wearMultiplier.toFixed(2)),
      maximumCorneringGForceDelta: Number(corneringGDelta.toFixed(3)),
      straightLineBrakingDeltaPct: Number(brakingDelta.toFixed(1)),
    };
  }
}
