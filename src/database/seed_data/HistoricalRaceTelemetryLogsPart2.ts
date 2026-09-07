/**
 * ============================================================================
 * REALDRIVE SEED DATA - HISTORICAL RACE CIRCUIT TELEMETRY LOGS (PART 2)
 * ============================================================================
 * Millisecond-precision telemetry datasets recorded by championship drivers across
 * world-renowned motorsport circuits with throttle traces, braking pressures, G-G data.
 */

export interface TelemetryPointSample {
  readonly timeSec: number;
  readonly distanceM: number;
  readonly speedKph: number;
  readonly gear: number;
  readonly engineRpm: number;
  readonly throttlePercent: number;
  readonly brakePressureBar: number;
  readonly lateralGMps2: number;
  readonly longitudinalGMps2: number;
  readonly steeringDeg: number;
}

export interface CircuitLapTelemetryLog {
  readonly circuitId: string;
  readonly circuitName: string;
  readonly layout: string;
  readonly driverName: string;
  readonly vehicleModel: string;
  readonly lapTimeFormatted: string;
  readonly lapTimeMs: number;
  readonly topSpeedKph: number;
  readonly avgSpeedKph: number;
  readonly maxLateralG: number;
  readonly telemetryTraces: readonly TelemetryPointSample[];
}

export const HISTORICAL_TELEMETRY_LOGS_PART2: readonly CircuitLapTelemetryLog[] = [
  // ==========================================================================
  // CIRCUIT 1: NURBURGRING NORDSCHLEIFE (20.832 KM)
  // ==========================================================================
  {
    circuitId: 'track_nurburgring_nordschleife',
    circuitName: 'Nürburgring Nordschleife',
    layout: 'Full 20.832km VLN/24H Layout',
    driverName: 'Klaus Weber',
    vehicleModel: 'Apex LMH Le Mans Stradale',
    lapTimeFormatted: '5:14.220',
    lapTimeMs: 314220,
    topSpeedKph: 369.4,
    avgSpeedKph: 238.8,
    maxLateralG: 3.42,
    telemetryTraces: [
      { timeSec: 0.0, distanceM: 0.0, speedKph: 245.0, gear: 5, engineRpm: 8200, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.1, longitudinalGMps2: 0.4, steeringDeg: 0 },
      { timeSec: 10.5, distanceM: 780.0, speedKph: 295.0, gear: 6, engineRpm: 8400, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.2, longitudinalGMps2: 0.3, steeringDeg: 0 },
      { timeSec: 18.2, distanceM: 1420.0, speedKph: 140.0, gear: 3, engineRpm: 6800, throttlePercent: 0.2, brakePressureBar: 82, lateralGMps2: 1.8, longitudinalGMps2: -1.9, steeringDeg: 38 }, // Hatzenbach
      { timeSec: 35.8, distanceM: 2850.0, speedKph: 210.0, gear: 4, engineRpm: 7500, throttlePercent: 0.85, brakePressureBar: 0, lateralGMps2: 2.4, longitudinalGMps2: 0.2, steeringDeg: -45 }, // Flugplatz
      { timeSec: 58.4, distanceM: 4900.0, speedKph: 110.0, gear: 2, engineRpm: 6200, throttlePercent: 0.15, brakePressureBar: 95, lateralGMps2: 2.1, longitudinalGMps2: -2.2, steeringDeg: 68 }, // Wehrseifen
      { timeSec: 88.0, distanceM: 7800.0, speedKph: 260.0, gear: 5, engineRpm: 8100, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 2.8, longitudinalGMps2: 0.1, steeringDeg: -32 }, // Bergwerk Exit
      { timeSec: 125.0, distanceM: 11500.0, speedKph: 95.0, gear: 2, engineRpm: 5800, throttlePercent: 0.35, brakePressureBar: 45, lateralGMps2: 3.1, longitudinalGMps2: 0.2, steeringDeg: 78 }, // Karussell Concrete Banking
      { timeSec: 180.0, distanceM: 15800.0, speedKph: 285.0, gear: 6, engineRpm: 8300, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 1.5, longitudinalGMps2: 0.2, steeringDeg: 12 }, // Pflanzgarten
      { timeSec: 245.0, distanceM: 18500.0, speedKph: 369.4, gear: 7, engineRpm: 8500, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.1, steeringDeg: 0 }, // Döttinger Höhe Straight
      { timeSec: 314.22, distanceM: 20832.0, speedKph: 215.0, gear: 4, engineRpm: 7600, throttlePercent: 0.9, brakePressureBar: 0, lateralGMps2: 0.8, longitudinalGMps2: 0.4, steeringDeg: -15 } // Finish Line
    ]
  },

  // ==========================================================================
  // CIRCUIT 2: CIRCUIT DE SPA-FRANCORCHAMPS (7.004 KM)
  // ==========================================================================
  {
    circuitId: 'track_spa_francorchamps',
    circuitName: 'Circuit de Spa-Francorchamps',
    layout: 'Grand Prix Circuit 7.004km',
    driverName: 'Lucas Rossi',
    vehicleModel: 'Veloce GT3 Competition',
    lapTimeFormatted: '2:14.850',
    lapTimeMs: 134850,
    topSpeedKph: 288.5,
    avgSpeedKph: 186.9,
    maxLateralG: 2.95,
    telemetryTraces: [
      { timeSec: 0.0, distanceM: 0.0, speedKph: 230.0, gear: 5, engineRpm: 7800, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.3, steeringDeg: 0 },
      { timeSec: 8.5, distanceM: 420.0, speedKph: 68.0, gear: 1, engineRpm: 5400, throttlePercent: 0.1, brakePressureBar: 105, lateralGMps2: 1.8, longitudinalGMps2: -2.4, steeringDeg: 95 }, // La Source Hairpin
      { timeSec: 22.0, distanceM: 1450.0, speedKph: 265.0, gear: 6, engineRpm: 8200, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 2.9, longitudinalGMps2: 0.1, steeringDeg: -35 }, // Eau Rouge / Raidillon Crest
      { timeSec: 35.0, distanceM: 2450.0, speedKph: 288.5, gear: 6, engineRpm: 8500, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.1, steeringDeg: 0 }, // Kemmel Straight
      { timeSec: 42.0, distanceM: 2950.0, speedKph: 135.0, gear: 3, engineRpm: 6500, throttlePercent: 0.3, brakePressureBar: 92, lateralGMps2: 2.2, longitudinalGMps2: -2.1, steeringDeg: 55 }, // Les Combes
      { timeSec: 72.0, distanceM: 4600.0, speedKph: 215.0, gear: 5, engineRpm: 7600, throttlePercent: 0.95, brakePressureBar: 0, lateralGMps2: 2.8, longitudinalGMps2: 0.2, steeringDeg: -60 }, // Pouhon Double Left
      { timeSec: 108.0, distanceM: 6400.0, speedKph: 278.0, gear: 6, engineRpm: 8300, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 2.6, longitudinalGMps2: 0.1, steeringDeg: -25 }, // Blanchimont
      { timeSec: 120.0, distanceM: 6800.0, speedKph: 72.0, gear: 1, engineRpm: 5600, throttlePercent: 0.1, brakePressureBar: 110, lateralGMps2: 1.9, longitudinalGMps2: -2.5, steeringDeg: 88 }, // Bus Stop Chicane
      { timeSec: 134.85, distanceM: 7004.0, speedKph: 210.0, gear: 4, engineRpm: 7400, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.1, longitudinalGMps2: 0.5, steeringDeg: 0 } // Finish Line
    ]
  }
];

export class HistoricalTelemetryService {
  public static getAllCircuitLaps(): CircuitLapTelemetryLog[] {
    return [...HISTORICAL_TELEMETRY_LOGS_PART2];
  }

  public static getTelemetryByCircuitId(circuitId: string): CircuitLapTelemetryLog | undefined {
    return HISTORICAL_TELEMETRY_LOGS_PART2.find(c => c.circuitId === circuitId);
  }
}
