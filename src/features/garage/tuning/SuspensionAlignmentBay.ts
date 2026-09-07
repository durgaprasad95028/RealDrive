/**
 * SuspensionAlignmentBay — 4-Wheel Laser Alignment & Chassis Kinematics Geometry Workshop
 */

export interface SuspensionAlignmentConfig {
  frontCamberDeg: number; // e.g. -0.5 to -4.5 degrees
  rearCamberDeg: number; // e.g. -0.5 to -3.5 degrees
  frontCasterDeg: number; // e.g. +3.0 to +9.5 degrees
  frontToeMm: number; // -3.0 (toe-out) to +3.0 (toe-in)
  rearToeMm: number; // -1.0 to +4.0 (toe-in)
  rideHeightFrontMm: number; // -50mm (slammed) to +60mm (lifted)
  rideHeightRearMm: number;
  springRateFrontNmm: number; // e.g. 35 N/mm (comfort) to 160 N/mm (race)
  springRateRearNmm: number;
  antiRollBarStiffnessFrontNm: number; // e.g. 1500 to 8000 Nm/rad
  antiRollBarStiffnessRearNm: number;
  damperBumpCompressionFront: number; // 1 to 24 clicks
  damperBumpCompressionRear: number;
  damperReboundExtensionFront: number; // 1 to 24 clicks
  damperReboundExtensionRear: number;
}

export interface ChassisHandlingEvaluation {
  maxLateralG: number; // e.g. 0.95G to 1.65G
  turnInResponsiveness: number; // 0 (sluggish) to 100 (razor sharp)
  highSpeedStability: number; // 0 (twitchy) to 100 (rock solid)
  handlingBalance: 'HEAVY_UNDERSTEER' | 'MILD_UNDERSTEER' | 'NEUTRAL_BALANCED' | 'MILD_OVERSTEER' | 'SNAP_OVERSTEER';
  bodyRollAngleAt1GDeg: number; // degrees of body lean
  tireWearMultiplier: number; // 1.0 (even wear) to 2.8 (heavy inner camber wear)
  curbWeightBalanceCrossPercent: number; // target ~50.0%
}

export class SuspensionAlignmentBay {
  /**
   * Default factory OEM street alignment preset
   */
  public static readonly STREET_OEM_PRESET: SuspensionAlignmentConfig = {
    frontCamberDeg: -0.8,
    rearCamberDeg: -1.2,
    frontCasterDeg: 5.5,
    frontToeMm: 0.5,
    rearToeMm: 1.2,
    rideHeightFrontMm: 0,
    rideHeightRearMm: 0,
    springRateFrontNmm: 45,
    springRateRearNmm: 40,
    antiRollBarStiffnessFrontNm: 2800,
    antiRollBarStiffnessRearNm: 2200,
    damperBumpCompressionFront: 8,
    damperBumpCompressionRear: 8,
    damperReboundExtensionFront: 10,
    damperReboundExtensionRear: 10,
  };

  /**
   * Track / Time Attack race alignment preset
   */
  public static readonly TRACK_ATTACK_PRESET: SuspensionAlignmentConfig = {
    frontCamberDeg: -3.2,
    rearCamberDeg: -2.4,
    frontCasterDeg: 7.8,
    frontToeMm: -1.0, // slight toe-out for immediate turn-in bite
    rearToeMm: 2.0, // toe-in for corner-exit power stability
    rideHeightFrontMm: -35,
    rideHeightRearMm: -30,
    springRateFrontNmm: 110,
    springRateRearNmm: 95,
    antiRollBarStiffnessFrontNm: 5200,
    antiRollBarStiffnessRearNm: 4400,
    damperBumpCompressionFront: 16,
    damperBumpCompressionRear: 14,
    damperReboundExtensionFront: 18,
    damperReboundExtensionRear: 16,
  };

  /**
   * Pro Drift slip angle alignment preset
   */
  public static readonly PRO_DRIFT_PRESET: SuspensionAlignmentConfig = {
    frontCamberDeg: -4.5, // maximum front tire contact patch at full lock
    rearCamberDeg: -0.5, // near zero rear camber for massive forward bite while spinning
    frontCasterDeg: 8.5, // strong self-steer return torque
    frontToeMm: -2.5, // aggressive toe-out
    rearToeMm: 0.0,
    rideHeightFrontMm: -30,
    rideHeightRearMm: -20,
    springRateFrontNmm: 85,
    springRateRearNmm: 65,
    antiRollBarStiffnessFrontNm: 4500,
    antiRollBarStiffnessRearNm: 1800,
    damperBumpCompressionFront: 14,
    damperBumpCompressionRear: 10,
    damperReboundExtensionFront: 16,
    damperReboundExtensionRear: 12,
  };

  /**
   * Evaluates comprehensive chassis handling dynamics from alignment and damper setup
   */
  public static evaluateHandling(
    baseWeightKg: number,
    baseLateralG: number,
    config: SuspensionAlignmentConfig
  ): ChassisHandlingEvaluation {
    // 1. Max Lateral Grip calculation
    // Camber sweet spot is ~ -2.8 to -3.5 on track
    const frontCamberBonus = Math.max(0, -config.frontCamberDeg * 0.08) - (config.frontCamberDeg < -4.0 ? 0.05 : 0);
    const rearCamberBonus = Math.max(0, -config.rearCamberDeg * 0.06);

    // Center of gravity height reduction from lower ride height
    const cogBonus = Math.max(0, -config.rideHeightFrontMm * 0.002);
    const maxLatG = Math.round((baseLateralG + frontCamberBonus + rearCamberBonus + cogBonus) * 100) / 100;

    // 2. Turn-in responsiveness
    // Toe-out front and high caster increase turn-in sharply
    const casterBonus = (config.frontCasterDeg - 5.0) * 4.5;
    const toeOutBonus = -config.frontToeMm * 6.0;
    const springRateBonus = (config.springRateFrontNmm - 40) * 0.3;
    const turnIn = Math.max(20, Math.min(100, Math.round(60 + casterBonus + toeOutBonus + springRateBonus)));

    // 3. High-speed stability
    // Rear toe-in and high caster stabilize high-speed highway tracking
    const rearToeBonus = config.rearToeMm * 8.0;
    const stability = Math.max(20, Math.min(100, Math.round(70 + rearToeBonus + casterBonus * 0.5 - toeOutBonus * 0.8)));

    // 4. Handling balance (Understeer / Oversteer)
    // Stiffer front sway bar / springs -> understeer. Stiffer rear sway bar / springs -> oversteer.
    const rollStiffnessRatio =
      (config.antiRollBarStiffnessFrontNm + config.springRateFrontNmm * 40) /
      (config.antiRollBarStiffnessRearNm + config.springRateRearNmm * 40);

    let balance: ChassisHandlingEvaluation['handlingBalance'] = 'NEUTRAL_BALANCED';
    if (rollStiffnessRatio > 1.45) balance = 'HEAVY_UNDERSTEER';
    else if (rollStiffnessRatio > 1.20) balance = 'MILD_UNDERSTEER';
    else if (rollStiffnessRatio < 0.90) balance = 'SNAP_OVERSTEER';
    else if (rollStiffnessRatio < 1.05) balance = 'MILD_OVERSTEER';

    // 5. Body roll angle at 1.0G
    const totalRollStiffness = (config.antiRollBarStiffnessFrontNm + config.antiRollBarStiffnessRearNm) / 1000;
    const bodyRoll = Math.max(1.0, Math.min(6.5, Math.round((28 / totalRollStiffness) * 10) / 10));

    // 6. Tire wear multiplier
    const camberWear = Math.abs(config.frontCamberDeg) * 0.25 + Math.abs(config.frontToeMm) * 0.3;
    const wearMultiplier = Math.round((1.0 + camberWear) * 10) / 10;

    return {
      maxLateralG: maxLatG,
      turnInResponsiveness: turnIn,
      highSpeedStability: stability,
      handlingBalance: balance,
      bodyRollAngleAt1GDeg: bodyRoll,
      tireWearMultiplier: wearMultiplier,
      curbWeightBalanceCrossPercent: 50.0,
    };
  }
}
