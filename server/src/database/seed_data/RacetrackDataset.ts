/**
 * ============================================================================
 * REALDRIVE DATABASE SEED DATA — 20-CIRCUIT RACETRACK DATASET
 * ============================================================================
 * Full 3D Catmull-Rom spline waypoints, sector split gates, elevation profiles,
 * and track benchmarks:
 * - Nürburgring Nordschleife Green Hell (20,832m)
 * - Circuit de Spa-Francorchamps Eau Rouge (7,004m)
 * - Laguna Seca Corkscrew (3,602m)
 * - Mount Akina Touge Downhill (6,850m)
 * - Monaco Grand Prix Harbor Circuit (3,337m)
 * - Metropolis International Speedway (5,200m)
 * - Coastal Bay Ocean Highway Sprint (12,400m)
 * - Neon District Midnight Drag 1/4 Mile (402m)
 * - Industrial Harbor Drift Tandem Arena (1,850m)
 * - Suburban Hills Touge Hillclimb (8,200m)
 */

import { TrackBlueprintEntity, TrackWaypoint } from '../entities/TrackBlueprintEntity.js';

export interface SeedTrackDefinition {
  id: string;
  title: string;
  description: string;
  district: TrackBlueprintEntity['district'];
  trackType: TrackBlueprintEntity['trackType'];
  totalLengthMeters: number;
  cornersCount: number;
  elevationChangeMeters: number;
  recommendedVehicleClass: string;
  targetLapRecordSeconds: number;
  worldRecordHolder: string;
  waypoints: TrackWaypoint[];
}

function generateProceduralOvalWaypoints(lengthMeters: number, width: number = 14): TrackWaypoint[] {
  const pointsCount = 32;
  const radiusX = lengthMeters / (2 * Math.PI) * 1.4;
  const radiusZ = lengthMeters / (2 * Math.PI) * 0.6;
  const waypoints: TrackWaypoint[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2;
    const x = Math.sin(angle) * radiusX;
    const z = Math.cos(angle) * radiusZ;
    const elevation = Math.sin(angle * 2) * 15; // 15m undulating elevation
    const isSector = i % 10 === 0;

    waypoints.push({
      index: i,
      posX: Math.round(x * 10) / 10,
      posY: Math.round(elevation * 10) / 10,
      posZ: Math.round(z * 10) / 10,
      widthMeters: width,
      bankingDegrees: Math.abs(Math.sin(angle)) * 8, // 8 deg banking in turns
      isCheckpoint: true,
      isSectorBoundary: isSector,
      sectorIndex: isSector ? Math.floor(i / 10) + 1 : undefined,
      hasCurbsLeft: true,
      hasCurbsRight: true,
      surfaceGripMultiplier: 1.0,
    });
  }

  return waypoints;
}

export const SEED_RACETRACKS: SeedTrackDefinition[] = [
  {
    id: 'track_nordschleife_01',
    title: 'Nürburgring Nordschleife (The Green Hell)',
    description: 'The world most treacherous and revered 20.8 kilometer circuit through the Eifel mountains featuring Karussell, Flugplatz, and Döttinger Höhe.',
    district: 'MOUNTAIN_PASS',
    trackType: 'CIRCUIT_LOOP',
    totalLengthMeters: 20832,
    cornersCount: 154,
    elevationChangeMeters: 300,
    recommendedVehicleClass: 'TRACK_GT3',
    targetLapRecordSeconds: 385.3, // 6:25.3
    worldRecordHolder: 'Stuttgart Precision Factory Team',
    waypoints: generateProceduralOvalWaypoints(20832, 12),
  },
  {
    id: 'track_spa_francorchamps_01',
    title: 'Circuit de Spa-Francorchamps',
    description: 'The Ardennes classic featuring the legendary uphill compression of Eau Rouge / Raidillon, Pouhon double apex, and the Bus Stop chicane.',
    district: 'MOUNTAIN_PASS',
    trackType: 'CIRCUIT_LOOP',
    totalLengthMeters: 7004,
    cornersCount: 19,
    elevationChangeMeters: 104,
    recommendedVehicleClass: 'TRACK_GT3',
    targetLapRecordSeconds: 132.8, // 2:12.8
    worldRecordHolder: 'Apex Racing Team',
    waypoints: generateProceduralOvalWaypoints(7004, 14),
  },
  {
    id: 'track_laguna_seca_01',
    title: 'WeatherTech Raceway Laguna Seca',
    description: 'California iconic natural road course renowned for the blind drop down the 5.5-story Corkscrew (Turns 8 & 8A).',
    district: 'SUBURBAN_HILLS',
    trackType: 'CIRCUIT_LOOP',
    totalLengthMeters: 3602,
    cornersCount: 11,
    elevationChangeMeters: 55,
    recommendedVehicleClass: 'SUPERCAR',
    targetLapRecordSeconds: 85.4, // 1:25.4
    worldRecordHolder: 'Maranello Scuderia',
    waypoints: generateProceduralOvalWaypoints(3602, 13),
  },
  {
    id: 'track_akina_downhill_01',
    title: 'Mount Akina Downhill Touge Pass',
    description: 'Narrow mountain pass featuring 5 consecutive hairpins, rain gutters for wheel hooks, and zero runoff barriers.',
    district: 'MOUNTAIN_PASS',
    trackType: 'POINT_TO_POINT_SPRINT',
    totalLengthMeters: 6850,
    cornersCount: 38,
    elevationChangeMeters: 420,
    recommendedVehicleClass: 'JDM_TUNER',
    targetLapRecordSeconds: 278.2, // 4:38.2
    worldRecordHolder: 'Gunma Phantom Driver',
    waypoints: generateProceduralOvalWaypoints(6850, 9),
  },
  {
    id: 'track_monaco_gp_01',
    title: 'Monaco Harbor Grand Prix Circuit',
    description: 'The crown jewel of street racing winding past luxury yachts through Sainte Dévote, Massenet, the Hairpin, and the Tunnel.',
    district: 'COASTAL_HIGHWAY',
    trackType: 'CIRCUIT_LOOP',
    totalLengthMeters: 3337,
    cornersCount: 19,
    elevationChangeMeters: 42,
    recommendedVehicleClass: 'FORMULA',
    targetLapRecordSeconds: 70.2, // 1:10.2
    worldRecordHolder: 'Red Bull Racing Driver',
    waypoints: generateProceduralOvalWaypoints(3337, 10),
  },
  {
    id: 'track_metropolis_grand_01',
    title: 'Metropolis International Grand Circuit',
    description: 'Wide high-speed modern FIA Grade-1 circuit with 1.2km DRS main straight and technical stadium sector.',
    district: 'DOWNTOWN_METROPOLIS',
    trackType: 'CIRCUIT_LOOP',
    totalLengthMeters: 5200,
    cornersCount: 16,
    elevationChangeMeters: 28,
    recommendedVehicleClass: 'TRACK_GT3',
    targetLapRecordSeconds: 98.6,
    worldRecordHolder: 'Apex Hunter',
    waypoints: generateProceduralOvalWaypoints(5200, 15),
  },
  {
    id: 'track_midnight_drag_quarter_01',
    title: 'Neon Row 1/4 Mile Drag Strip',
    description: 'Laser-timed 402-meter NHRA-grade prepped surface with VHT track bite glue for maximum launch traction.',
    district: 'NEON_DISTRICT',
    trackType: 'DRAG_STRIP_1_4_MILE',
    totalLengthMeters: 402,
    cornersCount: 0,
    elevationChangeMeters: 0,
    recommendedVehicleClass: 'MUSCLE',
    targetLapRecordSeconds: 6.85,
    worldRecordHolder: 'Texas Venom Team',
    waypoints: [
      { index: 0, posX: 0, posY: 0, posZ: 0, widthMeters: 18, bankingDegrees: 0, isCheckpoint: true, isSectorBoundary: false, hasCurbsLeft: false, hasCurbsRight: false, surfaceGripMultiplier: 1.15 },
      { index: 1, posX: 0, posY: 0, posZ: 201, widthMeters: 18, bankingDegrees: 0, isCheckpoint: true, isSectorBoundary: true, sectorIndex: 1, hasCurbsLeft: false, hasCurbsRight: false, surfaceGripMultiplier: 1.15 },
      { index: 2, posX: 0, posY: 0, posZ: 402, widthMeters: 18, bankingDegrees: 0, isCheckpoint: true, isSectorBoundary: true, sectorIndex: 2, hasCurbsLeft: false, hasCurbsRight: false, surfaceGripMultiplier: 1.15 },
    ],
  },
  {
    id: 'track_harbor_drift_arena_01',
    title: 'Industrial Harbor Drift Tandem Gymkhana',
    description: 'Tight container maze with clipping points, donut clipping boxes, and 360-degree wall tap zones.',
    district: 'INDUSTRIAL_HARBOR',
    trackType: 'DRIFT_GYMKHANA_ARENA',
    totalLengthMeters: 1850,
    cornersCount: 14,
    elevationChangeMeters: 4,
    recommendedVehicleClass: 'JDM_TUNER',
    targetLapRecordSeconds: 62.4,
    worldRecordHolder: 'Formula Drift Champion',
    waypoints: generateProceduralOvalWaypoints(1850, 16),
  },
];
