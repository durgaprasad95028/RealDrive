/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — DYNAMIC WEATHER & CIRCADIAN CYCLE ENGINE
 * ============================================================================
 * Authoritative environmental weather simulation:
 * - 24-hour diurnal day/night sunlight progression (sun altitude & azimuth)
 * - Rain precipitation road wetness & friction multiplier (0.65x wet, 1.0x dry)
 * - Fog particle density and volumetric illumination scattering
 */

export interface WeatherState {
  condition: 'CLEAR_SUNNY' | 'OVERCAST_CLOUDY' | 'LIGHT_RAIN' | 'HEAVY_THUNDERSTORM' | 'DENSE_FOG' | 'GOLDEN_HOUR_SUNSET';
  timeOfDayHours: number; // 0.0 to 24.0
  ambientTemperatureC: number;
  precipitationIntensity: number; // 0.0 to 1.0
  roadWetnessPct: number; // 0% to 100%
  tireGripMultiplier: number; // 0.65 to 1.05
  windSpeedKmh: number;
  windDirectionDeg: number;
  fogDensity: number;
  sunPosition: { x: number; y: number; z: number };
}

export class DynamicWeatherEngine {
  private state: WeatherState;
  private timeMultiplier: number = 60.0; // 1 real second = 1 game minute

  constructor() {
    this.state = {
      condition: 'CLEAR_SUNNY',
      timeOfDayHours: 14.5, // 2:30 PM
      ambientTemperatureC: 24.0,
      precipitationIntensity: 0.0,
      roadWetnessPct: 0.0,
      tireGripMultiplier: 1.0,
      windSpeedKmh: 12.0,
      windDirectionDeg: 45.0,
      fogDensity: 0.001,
      sunPosition: { x: 0.5, y: 0.8, z: 0.3 },
    };
  }

  public step(dt: number): WeatherState {
    // Advance time of day
    this.state.timeOfDayHours = (this.state.timeOfDayHours + (dt * this.timeMultiplier) / 3600.0) % 24.0;

    // Calculate solar angle
    const sunAngleRad = ((this.state.timeOfDayHours - 6.0) / 12.0) * Math.PI;
    this.state.sunPosition = {
      x: Math.cos(sunAngleRad),
      y: Math.sin(sunAngleRad),
      z: 0.3,
    };

    // Calculate road wetness & tire grip
    if (this.state.condition.includes('RAIN') || this.state.condition.includes('THUNDERSTORM')) {
      this.state.roadWetnessPct = Math.min(100.0, this.state.roadWetnessPct + dt * 2.0);
      this.state.tireGripMultiplier = Math.max(0.68, 1.0 - (this.state.roadWetnessPct / 100.0) * 0.32);
    } else {
      this.state.roadWetnessPct = Math.max(0.0, this.state.roadWetnessPct - dt * 0.5);
      this.state.tireGripMultiplier = Math.min(1.0, 0.68 + (1.0 - this.state.roadWetnessPct / 100.0) * 0.32);
    }

    return { ...this.state };
  }

  public setCondition(condition: WeatherState['condition']): void {
    this.state.condition = condition;
    if (condition === 'HEAVY_THUNDERSTORM') {
      this.state.precipitationIntensity = 1.0;
      this.state.fogDensity = 0.008;
      this.state.windSpeedKmh = 48.0;
    } else if (condition === 'LIGHT_RAIN') {
      this.state.precipitationIntensity = 0.4;
      this.state.fogDensity = 0.003;
      this.state.windSpeedKmh = 20.0;
    } else if (condition === 'DENSE_FOG') {
      this.state.precipitationIntensity = 0.0;
      this.state.fogDensity = 0.025;
      this.state.windSpeedKmh = 5.0;
    } else {
      this.state.precipitationIntensity = 0.0;
      this.state.fogDensity = 0.001;
      this.state.windSpeedKmh = 12.0;
    }
  }

  public getState(): WeatherState {
    return { ...this.state };
  }
}
