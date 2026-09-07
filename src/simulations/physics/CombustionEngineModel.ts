/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — THERMODYNAMIC COMBUSTION ENGINE MODEL
 * ============================================================================
 * Internal Combustion Engine (ICE) simulation:
 * - 4-stroke Otto cycle indicator work and pumping losses
 * - Turbocharger compressor spool lag & wastegate pressure regulation
 * - Thermal radiator cooling heat transfer equation (Q = m * c * dT)
 * - Oil viscosity lubrication breakdown under extreme temperature (>140°C)
 */

export interface EngineThermodynamicsState {
  rpm: number;
  throttle: number;
  manifoldPressureBar: number;
  coolantTempC: number;
  oilTempC: number;
  turboSpoolRpm: number;
  fuelMassFlowGps: number;
  indicatedTorqueNm: number;
  frictionTorqueNm: number;
  brakeTorqueNm: number;
  isOverheating: boolean;
  isOilDegraded: boolean;
}

export class CombustionEngineModel {
  public static updateEngine(
    state: EngineThermodynamicsState,
    dt: number,
    specs: {
      displacementLiters: number;
      cylinders: number;
      idleRpm: number;
      redlineRpm: number;
      maxBrakeTorqueNm: number;
      isTurbocharged: boolean;
      maxBoostBar: number;
    }
  ): EngineThermodynamicsState {
    const rpmFraction = state.rpm / specs.redlineRpm;

    // 1. Turbocharger Spool Dynamics
    let targetBoost = 0;
    if (specs.isTurbocharged && state.rpm > 2200) {
      const load = state.throttle;
      const targetSpool = load * (state.rpm / specs.redlineRpm) * 150000; // max 150,000 RPM turbo spool
      const spoolDelta = targetSpool - state.turboSpoolRpm;
      state.turboSpoolRpm += spoolDelta * Math.min(1.0, dt * 4.5); // Spool lag inertia

      targetBoost = specs.maxBoostBar * (state.turboSpoolRpm / 150000);
    }
    state.manifoldPressureBar = 1.0 + targetBoost;

    // 2. Combustion Torque Calculation
    const ve = Math.sin(rpmFraction * Math.PI * 0.9); // Volumetric efficiency
    const airMassPerRev = (specs.displacementLiters / 1000.0) * state.manifoldPressureBar * 1.225 * ve;
    const fuelMassPerRev = airMassPerRev / 12.5; // AFR target 12.5
    state.fuelMassFlowGps = (fuelMassPerRev * (state.rpm / 60.0) * (specs.cylinders / 2.0)) * 1000.0;

    const baseIndicatedTorque = specs.maxBrakeTorqueNm * 1.15 * state.throttle * ve * state.manifoldPressureBar;

    // Friction & pumping losses: T_fric = a + b*RPM + c*RPM^2
    const frictionTorque = 25.0 + (state.rpm / 1000.0) * 8.0 + Math.pow(state.rpm / 1000.0, 2) * 1.2;

    const brakeTorque = Math.max(0, baseIndicatedTorque - frictionTorque);

    // 3. Thermal Heat Transfer
    const heatGeneratedKw = (state.fuelMassFlowGps * 44.0) * 0.35; // 44 MJ/kg petrol energy, 35% thermal loss to coolant
    const vehicleSpeedAirflowKmh = (state.rpm / specs.redlineRpm) * 180.0; // Airflow cooling proxy
    const radiatorCoolingKw = 5.0 + (vehicleSpeedAirflowKmh * 0.45);

    const netCoolantHeatKw = (heatGeneratedKw * state.throttle) - radiatorCoolingKw;
    state.coolantTempC = Math.max(20.0, state.coolantTempC + (netCoolantHeatKw / 18.0) * dt);

    // Oil warms up slower and follows coolant
    const oilDelta = state.coolantTempC + (state.throttle * 25.0) - state.oilTempC;
    state.oilTempC += oilDelta * Math.min(1.0, dt * 0.08);

    const isOverheating = state.coolantTempC > 118.0;
    const isOilDegraded = state.oilTempC > 145.0;

    return {
      rpm: state.rpm,
      throttle: state.throttle,
      manifoldPressureBar: Number(state.manifoldPressureBar.toFixed(2)),
      coolantTempC: Number(state.coolantTempC.toFixed(1)),
      oilTempC: Number(state.oilTempC.toFixed(1)),
      turboSpoolRpm: Math.round(state.turboSpoolRpm),
      fuelMassFlowGps: Number(state.fuelMassFlowGps.toFixed(2)),
      indicatedTorqueNm: Math.round(baseIndicatedTorque),
      frictionTorqueNm: Math.round(frictionTorque),
      brakeTorqueNm: Math.round(brakeTorque),
      isOverheating,
      isOilDegraded,
    };
  }
}
