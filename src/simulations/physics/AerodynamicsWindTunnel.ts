/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — AERODYNAMICS & VIRTUAL WIND TUNNEL MODEL
 * ============================================================================
 * High-speed aerodynamic fluid dynamics:
 * - Quadratic air resistance drag force: F_d = 0.5 * rho * C_d * A * v^2
 * - Venturi ground-effect underbody downforce & active DRS wing actuation
 * - Slipstream drafting cone (reduces drag by up to 35% when within 25m of lead car)
 */

export interface AeroOutput {
  dragForceN: number;
  frontDownforceN: number;
  rearDownforceN: number;
  totalDownforceN: number;
  aeroBalanceFrontPct: number;
  slipstreamDragReductionPct: number;
  isDrsOpen: boolean;
}

export class AerodynamicsWindTunnel {
  private static readonly AIR_DENSITY = 1.225; // kg/m^3

  public static calculateAero(
    speedMs: number,
    isDrsOpen: boolean,
    distanceToLeadCarMeters?: number,
    specs: {
      dragCoeff: number;
      frontalAreaM2: number;
      frontDownforceCoeff: number;
      rearDownforceCoeff: number;
      rearWingAngleDeg: number;
    } = {
      dragCoeff: 0.35,
      frontalAreaM2: 2.2,
      frontDownforceCoeff: 0.30,
      rearDownforceCoeff: 0.65,
      rearWingAngleDeg: 12,
    }
  ): AeroOutput {
    const dynamicPressure = 0.5 * AerodynamicsWindTunnel.AIR_DENSITY * speedMs * speedMs;

    // Wing angle adds to drag and rear downforce
    const wingAngleRad = (specs.rearWingAngleDeg * Math.PI) / 180.0;
    let effectiveCd = specs.dragCoeff + Math.sin(wingAngleRad) * 0.12;
    let effectiveClRear = specs.rearDownforceCoeff + Math.sin(wingAngleRad) * 0.45;

    // DRS opening reduces rear wing drag by 25% and downforce by 40%
    if (isDrsOpen) {
      effectiveCd *= 0.75;
      effectiveClRear *= 0.60;
    }

    // Slipstream drafting benefit
    let draftReductionPct = 0;
    if (distanceToLeadCarMeters !== undefined && distanceToLeadCarMeters < 35.0) {
      const distanceFactor = Math.max(0, (35.0 - distanceToLeadCarMeters) / 35.0);
      draftReductionPct = Math.round(distanceFactor * 35.0); // max 35% reduction
      effectiveCd *= (1.0 - draftReductionPct / 100.0);
    }

    const dragForce = dynamicPressure * effectiveCd * specs.frontalAreaM2;
    const frontDownforce = dynamicPressure * specs.frontDownforceCoeff * specs.frontalAreaM2;
    const rearDownforce = dynamicPressure * effectiveClRear * specs.frontalAreaM2;
    const totalDownforce = frontDownforce + rearDownforce;

    const aeroBalanceFrontPct = totalDownforce > 0 ? (frontDownforce / totalDownforce) * 100.0 : 50.0;

    return {
      dragForceN: Math.round(dragForce),
      frontDownforceN: Math.round(frontDownforce),
      rearDownforceN: Math.round(rearDownforce),
      totalDownforceN: Math.round(totalDownforce),
      aeroBalanceFrontPct: Math.round(aeroBalanceFrontPct * 10) / 10,
      slipstreamDragReductionPct: draftReductionPct,
      isDrsOpen,
    };
  }
}
