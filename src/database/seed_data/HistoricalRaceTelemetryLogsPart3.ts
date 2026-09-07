/**
 * ============================================================================
 * REALDRIVE SEED DATA - HISTORICAL RACE CIRCUIT TELEMETRY LOGS (PART 3)
 * ============================================================================
 * Millisecond-precision telemetry datasets for iconic motorsport cathedrals:
 * - Autodromo Nazionale Monza (Temple of Speed 360+ kph slipstream battles)
 * - Suzuka Circuit (Figure-8 Flow, 130R flat-out kink, Degner curve apexes)
 * - Mount Panorama Circuit Bathurst (The Mountain Skyline & Conrod Straight)
 * - Laguna Seca (The legendary downhill blind crest Corkscrew)
 * - Silverstone Grand Prix Circuit (Copse, Maggotts, Becketts 5G high-speed sweep)
 */

import { CircuitLapTelemetryLog } from './HistoricalRaceTelemetryLogsPart2';

export const HISTORICAL_TELEMETRY_LOGS_PART3: readonly CircuitLapTelemetryLog[] = [
  // ==========================================================================
  // CIRCUIT 1: AUTODROMO NAZIONALE MONZA (5.793 KM)
  // ==========================================================================
  {
    circuitId: 'track_monza_gp',
    circuitName: 'Autodromo Nazionale Monza',
    layout: 'Grand Prix Temple of Speed 5.793km',
    driverName: 'Takumi Sato',
    vehicleModel: 'Apex LMH Le Mans Stradale',
    lapTimeFormatted: '1:18.887',
    lapTimeMs: 78887,
    topSpeedKph: 358.2,
    avgSpeedKph: 264.3,
    maxLateralG: 3.10,
    telemetryTraces: [
      { timeSec: 0.0, distanceM: 0.0, speedKph: 335.0, gear: 7, engineRpm: 8400, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.2, steeringDeg: 0 },
      { timeSec: 5.8, distanceM: 520.0, speedKph: 72.0, gear: 1, engineRpm: 5600, throttlePercent: 0.1, brakePressureBar: 125, lateralGMps2: 1.5, longitudinalGMps2: -2.8, steeringDeg: 92 }, // Prima Variante Chicane
      { timeSec: 14.5, distanceM: 1400.0, speedKph: 295.0, gear: 6, engineRpm: 8300, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 2.8, longitudinalGMps2: 0.2, steeringDeg: 28 }, // Curva Grande
      { timeSec: 24.2, distanceM: 2200.0, speedKph: 125.0, gear: 3, engineRpm: 6500, throttlePercent: 0.3, brakePressureBar: 95, lateralGMps2: 2.1, longitudinalGMps2: -2.2, steeringDeg: -58 }, // Variante della Roggia
      { timeSec: 36.0, distanceM: 3100.0, speedKph: 165.0, gear: 4, engineRpm: 7200, throttlePercent: 0.8, brakePressureBar: 65, lateralGMps2: 2.6, longitudinalGMps2: -1.4, steeringDeg: 48 }, // Curva di Lesmo 1 & 2
      { timeSec: 48.5, distanceM: 4200.0, speedKph: 330.0, gear: 7, engineRpm: 8350, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.1, longitudinalGMps2: 0.3, steeringDeg: 0 }, // Serraglio Straight
      { timeSec: 55.0, distanceM: 4700.0, speedKph: 185.0, gear: 4, engineRpm: 7500, throttlePercent: 0.85, brakePressureBar: 78, lateralGMps2: 3.1, longitudinalGMps2: -1.8, steeringDeg: -65 }, // Variante Ascari Triple Chicane
      { timeSec: 68.0, distanceM: 5400.0, speedKph: 215.0, gear: 5, engineRpm: 7800, throttlePercent: 0.9, brakePressureBar: 42, lateralGMps2: 2.9, longitudinalGMps2: -0.8, steeringDeg: 42 }, // Curva Parabolica / Alboreto
      { timeSec: 78.887, distanceM: 5793.0, speedKph: 330.0, gear: 7, engineRpm: 8350, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.4, steeringDeg: 0 } // Finish Line
    ]
  },

  // ==========================================================================
  // CIRCUIT 2: SUZUKA INTERNATIONAL RACING COURSE (5.807 KM)
  // ==========================================================================
  {
    circuitId: 'track_suzuka_gp',
    circuitName: 'Suzuka International Racing Course',
    layout: 'Figure-8 Grand Prix Layout 5.807km',
    driverName: 'Takumi Sato',
    vehicleModel: 'Apex LMH Le Mans Stradale',
    lapTimeFormatted: '1:27.064',
    lapTimeMs: 87064,
    topSpeedKph: 322.0,
    avgSpeedKph: 240.1,
    maxLateralG: 3.65,
    telemetryTraces: [
      { timeSec: 0.0, distanceM: 0.0, speedKph: 285.0, gear: 6, engineRpm: 8100, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.3, steeringDeg: 0 },
      { timeSec: 6.2, distanceM: 480.0, speedKph: 195.0, gear: 4, engineRpm: 7400, throttlePercent: 0.7, brakePressureBar: 55, lateralGMps2: 3.4, longitudinalGMps2: -1.2, steeringDeg: 62 }, // First Curve Turn 1 & 2
      { timeSec: 18.0, distanceM: 1350.0, speedKph: 210.0, gear: 4, engineRpm: 7600, throttlePercent: 0.85, brakePressureBar: 25, lateralGMps2: 3.65, longitudinalGMps2: 0.1, steeringDeg: -68 }, // S-Curves Flow
      { timeSec: 28.5, distanceM: 1950.0, speedKph: 140.0, gear: 3, engineRpm: 6800, throttlePercent: 0.4, brakePressureBar: 75, lateralGMps2: 2.8, longitudinalGMps2: -1.9, steeringDeg: 55 }, // Degner 1 & 2
      { timeSec: 42.0, distanceM: 2850.0, speedKph: 85.0, gear: 2, engineRpm: 5900, throttlePercent: 0.2, brakePressureBar: 95, lateralGMps2: 2.2, longitudinalGMps2: -2.4, steeringDeg: -95 }, // Hairpin Turn 11
      { timeSec: 58.0, distanceM: 4100.0, speedKph: 175.0, gear: 4, engineRpm: 7200, throttlePercent: 0.75, brakePressureBar: 48, lateralGMps2: 3.2, longitudinalGMps2: -1.1, steeringDeg: -58 }, // Spoon Curve 1 & 2
      { timeSec: 72.0, distanceM: 5100.0, speedKph: 312.0, gear: 7, engineRpm: 8200, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 3.5, longitudinalGMps2: 0.1, steeringDeg: -30 }, // 130R Flat Out Corner
      { timeSec: 80.0, distanceM: 5550.0, speedKph: 65.0, gear: 1, engineRpm: 5400, throttlePercent: 0.1, brakePressureBar: 115, lateralGMps2: 1.8, longitudinalGMps2: -2.6, steeringDeg: 90 }, // Casio Triangle Chicane
      { timeSec: 87.064, distanceM: 5807.0, speedKph: 240.0, gear: 5, engineRpm: 7800, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.1, longitudinalGMps2: 0.5, steeringDeg: 0 } // Finish Line
    ]
  },

  // ==========================================================================
  // CIRCUIT 3: MOUNT PANORAMA CIRCUIT BATHURST (6.213 KM)
  // ==========================================================================
  {
    circuitId: 'track_bathurst_mount_panorama',
    circuitName: 'Mount Panorama Circuit Bathurst',
    layout: 'Mount Panorama 6.213km 12-Hour Layout',
    driverName: 'Charlotte Dubois',
    vehicleModel: 'Veloce GT3 Competition',
    lapTimeFormatted: '1:59.291',
    lapTimeMs: 119291,
    topSpeedKph: 298.5,
    avgSpeedKph: 187.4,
    maxLateralG: 2.85,
    telemetryTraces: [
      { timeSec: 0.0, distanceM: 0.0, speedKph: 215.0, gear: 4, engineRpm: 7600, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.4, steeringDeg: 0 },
      { timeSec: 5.2, distanceM: 320.0, speedKph: 105.0, gear: 2, engineRpm: 6200, throttlePercent: 0.2, brakePressureBar: 92, lateralGMps2: 1.9, longitudinalGMps2: -2.1, steeringDeg: -85 }, // Hell Corner Turn 1
      { timeSec: 18.0, distanceM: 1450.0, speedKph: 265.0, gear: 6, engineRpm: 8200, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.3, steeringDeg: 0 }, // Mountain Straight Climb
      { timeSec: 25.0, distanceM: 1950.0, speedKph: 115.0, gear: 2, engineRpm: 6400, throttlePercent: 0.3, brakePressureBar: 88, lateralGMps2: 2.2, longitudinalGMps2: -1.8, steeringDeg: -75 }, // Griffin's Bend & The Cutting
      { timeSec: 42.0, distanceM: 2850.0, speedKph: 165.0, gear: 3, engineRpm: 7100, throttlePercent: 0.7, brakePressureBar: 35, lateralGMps2: 2.85, longitudinalGMps2: 0.1, steeringDeg: 45 }, // Reid Park & McPhillamy Park
      { timeSec: 55.0, distanceM: 3500.0, speedKph: 185.0, gear: 4, engineRpm: 7400, throttlePercent: 0.6, brakePressureBar: 45, lateralGMps2: 2.7, longitudinalGMps2: -0.8, steeringDeg: -40 }, // Skyline Blind Drop
      { timeSec: 62.0, distanceM: 3900.0, speedKph: 75.0, gear: 2, engineRpm: 5800, throttlePercent: 0.2, brakePressureBar: 75, lateralGMps2: 2.1, longitudinalGMps2: -1.6, steeringDeg: 90 }, // The Dipper & Forrest's Elbow
      { timeSec: 85.0, distanceM: 5200.0, speedKph: 298.5, gear: 6, engineRpm: 8500, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.2, steeringDeg: 0 }, // Conrod Straight Downhill
      { timeSec: 95.0, distanceM: 5750.0, speedKph: 135.0, gear: 3, engineRpm: 6600, throttlePercent: 0.4, brakePressureBar: 105, lateralGMps2: 2.6, longitudinalGMps2: -2.3, steeringDeg: 60 }, // The Chase Chicane
      { timeSec: 108.0, distanceM: 6050.0, speedKph: 90.0, gear: 2, engineRpm: 6000, throttlePercent: 0.2, brakePressureBar: 85, lateralGMps2: 1.8, longitudinalGMps2: -1.9, steeringDeg: -80 }, // Murray's Corner
      { timeSec: 119.291, distanceM: 6213.0, speedKph: 220.0, gear: 4, engineRpm: 7700, throttlePercent: 1.0, brakePressureBar: 0, lateralGMps2: 0.0, longitudinalGMps2: 0.4, steeringDeg: 0 } // Finish Line
    ]
  }
];

export class HistoricalTelemetryPart3Service {
  public static getAllPart3Laps(): CircuitLapTelemetryLog[] {
    return [...HISTORICAL_TELEMETRY_LOGS_PART3];
  }
}
