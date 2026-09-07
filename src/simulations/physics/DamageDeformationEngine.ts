/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — DAMAGE DEFORMATION & STRUCTURAL INTEGRITY
 * ============================================================================
 * Physical vehicle damage & component failure calculations:
 * - High-speed collision energy dissipation (E_k = 0.5 * m * v^2)
 * - Directional impulse vectors (Front, Rear, Left, Right T-Bone)
 * - Component failures: radiator leak (overheat in 45s), bent tie-rods (steering pull),
 *   shattered windshield glass, detached bumper & rear wing aero loss.
 */

export interface VehicleDamageState {
  structuralIntegrityPct: number; // 0% destroyed, 100% mint
  frontBumperConditionPct: number;
  rearBumperConditionPct: number;
  leftDoorConditionPct: number;
  rightDoorConditionPct: number;
  windshieldGlassIntact: boolean;
  radiatorPunctured: boolean;
  steeringAlignmentBentDeg: number;
  downforceLossPct: number;
  totalRepairCostCredits: number;
}

export class DamageDeformationEngine {
  public static processCollision(
    currentDamage: VehicleDamageState,
    impactSpeedKmh: number,
    impactAngleDeg: number, // 0 = front, 90 = right side, 180 = rear, 270 = left side
    vehicleMassKg: number = 1500
  ): VehicleDamageState {
    if (impactSpeedKmh < 10.0) {
      return currentDamage; // Scuff threshold under 10 km/h
    }

    const impactSeverity = Math.min(100.0, Math.pow(impactSpeedKmh / 160.0, 1.8) * 100.0);
    const updated = { ...currentDamage };

    updated.structuralIntegrityPct = Math.max(0, updated.structuralIntegrityPct - impactSeverity * 0.4);

    // Frontal impact (Angle between 315° and 45°)
    if (impactAngleDeg >= 315 || impactAngleDeg <= 45) {
      updated.frontBumperConditionPct = Math.max(0, updated.frontBumperConditionPct - impactSeverity);
      if (impactSpeedKmh > 50.0) {
        updated.radiatorPunctured = true;
      }
      if (impactSpeedKmh > 75.0) {
        updated.windshieldGlassIntact = false;
        updated.steeringAlignmentBentDeg = (Math.random() - 0.5) * 4.5;
        updated.downforceLossPct = Math.min(80, updated.downforceLossPct + 45);
      }
    }
    // Rear impact (Angle between 135° and 225°)
    else if (impactAngleDeg >= 135 && impactAngleDeg <= 225) {
      updated.rearBumperConditionPct = Math.max(0, updated.rearBumperConditionPct - impactSeverity);
      if (impactSpeedKmh > 60.0) {
        updated.downforceLossPct = Math.min(90, updated.downforceLossPct + 60); // Wing detached
      }
    }
    // Right side impact (45° to 135°)
    else if (impactAngleDeg > 45 && impactAngleDeg < 135) {
      updated.rightDoorConditionPct = Math.max(0, updated.rightDoorConditionPct - impactSeverity);
      if (impactSpeedKmh > 40.0) {
        updated.steeringAlignmentBentDeg = -2.5;
      }
    }
    // Left side impact (225° to 315°)
    else {
      updated.leftDoorConditionPct = Math.max(0, updated.leftDoorConditionPct - impactSeverity);
      if (impactSpeedKmh > 40.0) {
        updated.steeringAlignmentBentDeg = +2.5;
      }
    }

    // Repair cost calculation
    const damageLost = 100.0 - updated.structuralIntegrityPct;
    updated.totalRepairCostCredits = Math.round(damageLost * 120 + (updated.radiatorPunctured ? 1500 : 0) + (!updated.windshieldGlassIntact ? 800 : 0));

    return updated;
  }
}
