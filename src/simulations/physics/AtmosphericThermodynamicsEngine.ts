/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - ATMOSPHERIC THERMODYNAMICS & ALTITUDE ENGINE
 * ============================================================================
 * Advanced environmental physics solver calculating:
 * 1. Barometric Pressure & Air Density vs Elevation Altitude ($h = 0$ to $3,500m$).
 * 2. ISA Standard Atmosphere temperature lapse rate (-6.5°C per 1,000m).
 * 3. Relative Humidity & Water Vapor Partial Pressure on combustion oxygen.
 * 4. Solar Radiation (W/m^2) vs Cloud Cover & Asphalt surface temperature.
 * 5. Dynamic Rain accumulation, runoff drainage, and evaporative drying rates.
 */

export interface AtmosphericConditionsInput {
  readonly altitudeMeters: number;           // 0m (sea level) to 3,500m (alpine summit)
  readonly baseSeaLevelTempC: number;        // e.g. 25.0°C
  readonly baseSeaLevelPressureHPa: number;  // Standard: 1013.25 hPa
  readonly relativeHumidityPercent: number;  // 0% to 100%
  readonly cloudCoverPercent: number;        // 0% (clear sky) to 100% (overcast monsoon)
  readonly rainfallRateMmPerHour: number;    // 0 mm/h (dry) to 80 mm/h (monsoon)
  readonly windSpeedMps: number;
}

export interface AtmosphericStateOutput {
  readonly localAltitudeMeters: number;
  readonly ambientAirTemperatureC: number;
  readonly barometricPressureHPa: number;
  readonly dryAirDensityKgM3: number;
  readonly humidAirDensityKgM3: number;
  readonly oxygenMassFractionPercent: number;  // Standard: 20.95% at sea level, drops with humidity
  readonly engineAspirationDensityRatio: number;// 1.0 = Sea Level Standard (drops to ~0.72 at 3,000m)
  readonly trackSurfaceTemperatureC: number;
  readonly trackWaterFilmThicknessMm: number;
  readonly roadGripFrictionMultiplier: number;
  readonly aerodynamicDragDensityFactor: number;
}

export class AtmosphericThermodynamicsEngine {
  private static readonly SEA_LEVEL_PRESSURE_PA = 101325.0; // Pa
  private static readonly STANDARD_GRAVITY = 9.80665;       // m/s^2
  private static readonly MOLAR_MASS_DRY_AIR = 0.0289644;   // kg/mol
  private static readonly MOLAR_MASS_WATER_VAPOR = 0.018016;// kg/mol
  private static readonly UNIVERSAL_GAS_CONST = 8.31447;    // J / (mol * K)
  private static readonly TEMP_LAPSE_RATE = 0.0065;          // 6.5°C per 1,000m (K/m)

  /**
   * Saturation vapor pressure of water via Magnus-Tetens formula (in Pa)
   * $P_{sat}(T) = 610.78 \times \exp(\frac{17.27 \times T}{T + 237.3})$
   */
  public static calculateSaturationVaporPressurePa(tempC: number): number {
    return 610.78 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  }

  /**
   * Computes complete atmospheric state for a given elevation and weather parameters
   */
  public static calculateAtmosphericState(
    input: AtmosphericConditionsInput,
    previousTrackWaterMm: number = 0.0,
    deltaTimeSec: number = 1.0
  ): AtmosphericStateOutput {
    // 1. Temperature Lapse Rate with Altitude: $T(h) = T_0 - L \times h$
    const ambientTempC = input.baseSeaLevelTempC - (this.TEMP_LAPSE_RATE * input.altitudeMeters);
    const ambientTempK = ambientTempC + 273.15;
    const baseTempK = input.baseSeaLevelTempC + 273.15;

    // 2. Barometric Formula for Pressure: $P(h) = P_0 \times (1 - \frac{L \times h}{T_0})^{\frac{g M}{R L}}$
    const exponent = (this.STANDARD_GRAVITY * this.MOLAR_MASS_DRY_AIR) / (this.UNIVERSAL_GAS_CONST * this.TEMP_LAPSE_RATE);
    const pressurePa = (input.baseSeaLevelPressureHPa * 100.0) * Math.pow(Math.max(0.1, 1.0 - (this.TEMP_LAPSE_RATE * input.altitudeMeters) / baseTempK), exponent);
    const pressureHPa = pressurePa / 100.0;

    // 3. Water Vapor Partial Pressure: $P_v = \phi \times P_{sat}(T)$
    const pSatPa = this.calculateSaturationVaporPressurePa(ambientTempC);
    const pVaporPa = (input.relativeHumidityPercent / 100.0) * pSatPa;
    const pDryAirPa = Math.max(100.0, pressurePa - pVaporPa);

    // 4. Density of Moist Air: $\rho = \frac{P_d M_d + P_v M_v}{R T}$
    const rhoDry = (pDryAirPa * this.MOLAR_MASS_DRY_AIR) / (this.UNIVERSAL_GAS_CONST * ambientTempK);
    const rhoVapor = (pVaporPa * this.MOLAR_MASS_WATER_VAPOR) / (this.UNIVERSAL_GAS_CONST * ambientTempK);
    const totalHumidAirDensity = rhoDry + rhoVapor;

    // Standard sea level reference density (1.225 kg/m^3)
    const seaLevelStandardDensity = 1.225;
    const engineAspirationDensityRatio = totalHumidAirDensity / seaLevelStandardDensity;
    const aerodynamicDragDensityFactor = totalHumidAirDensity / seaLevelStandardDensity;

    // 5. Oxygen Mass Fraction (Humid air displaces oxygen by volume)
    const oxygenFraction = 20.95 * (pDryAirPa / pressurePa);

    // 6. Track Surface Temperature Model
    // Solar irradiance: up to 1000 W/m^2 on clear sunny midday, absorbed by black bitumen
    const solarFactor = Math.max(0.0, 1.0 - (input.cloudCoverPercent / 100.0) * 0.85);
    const solarHeatingDeltaC = solarFactor * 18.0; // Track surface can be up to 18°C hotter than ambient air in direct sun!
    const rainCoolingDeltaC = (input.rainfallRateMmPerHour / 20.0) * 8.0;

    const trackSurfaceTempC = Math.max(0.0, ambientTempC + solarHeatingDeltaC - rainCoolingDeltaC);

    // 7. Dynamic Rain Accumulation & Evaporative Drainage
    // Inflow: Rainfall mm/h -> mm/sec
    const rainInflowMmPerSec = (input.rainfallRateMmPerHour / 3600.0);
    
    // Drainage: Sloped asphalt runoff (gravity drains water above 0.5mm)
    const drainageRateMmPerSec = previousTrackWaterMm > 0.3 ? (previousTrackWaterMm - 0.3) * 0.08 : 0.0;
    
    // Evaporation: Speed & wind dependent drying
    const windDryingMmPerSec = (0.002 * (1.0 + input.windSpeedMps * 0.2)) * Math.max(0.1, (trackSurfaceTempC / 25.0));

    const netWaterDeltaMm = (rainInflowMmPerSec - drainageRateMmPerSec - windDryingMmPerSec) * deltaTimeSec;
    const currentTrackWaterMm = Math.max(0.0, Math.min(8.0, previousTrackWaterMm + netWaterDeltaMm));

    // 8. Overall Road Grip Multiplier
    let gripMultiplier = 1.0;
    if (currentTrackWaterMm > 0.05) {
      // Wet track drops grip from 1.0 down to ~0.65 in heavy puddles
      gripMultiplier = Math.max(0.60, 1.0 - (currentTrackWaterMm * 0.065));
    }

    return {
      localAltitudeMeters: input.altitudeMeters,
      ambientAirTemperatureC: Math.round(ambientTempC * 10) / 10,
      barometricPressureHPa: Math.round(pressureHPa * 10) / 10,
      dryAirDensityKgM3: Math.round(rhoDry * 1000) / 1000,
      humidAirDensityKgM3: Math.round(totalHumidAirDensity * 1000) / 1000,
      oxygenMassFractionPercent: Math.round(oxygenFraction * 100) / 100,
      engineAspirationDensityRatio: Math.round(engineAspirationDensityRatio * 1000) / 1000,
      trackSurfaceTemperatureC: Math.round(trackSurfaceTempC * 10) / 10,
      trackWaterFilmThicknessMm: Math.round(currentTrackWaterMm * 100) / 100,
      roadGripFrictionMultiplier: Math.round(gripMultiplier * 100) / 100,
      aerodynamicDragDensityFactor: Math.round(aerodynamicDragDensityFactor * 1000) / 1000
    };
  }
}
