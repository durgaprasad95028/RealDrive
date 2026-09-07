/**
 * ============================================================================
 * REALDRIVE SEED DATA - CITY DISTRICT TOPOLOGY MESH (PART 2)
 * ============================================================================
 * Detailed 3D road vector topology, intersections, and traffic flow geometry
 * for 15 additional metropolitan sub-districts and express connector corridors.
 */

export interface UrbanSubDistrict {
  readonly districtId: string;
  readonly displayName: string;
  readonly zoneCategory: 'metropolitan_core' | 'industrial_logistics' | 'residential_suburb' | 'coastal_highway' | 'mountain_touge' | 'desert_outback';
  readonly centerCoordinatesVec3: [number, number, number];
  readonly boundaryRadiusMeters: number;
  readonly baseSpeedLimitKph: number;
  readonly defaultSurfaceFrictionMu: number;
  readonly averageTrafficDensityScore: number; // 0.0 (empty) to 1.0 (gridlock)
  readonly landmarkPointsOfInterest: readonly {
    readonly poiId: string;
    readonly name: string;
    readonly category: 'gas_station' | 'tuning_garage' | 'dealership' | 'racetrack_paddock' | 'police_precinct';
    readonly positionVec3: [number, number, number];
  }[];
  readonly intersectionNodes: readonly {
    readonly intersectionId: string;
    readonly coordsVec3: [number, number, number];
    readonly type: '4_way_signal' | 'roundabout' | 'highway_cloverleaf' | 't_junction';
    readonly connectingRoadNames: readonly string[];
  }[];
}

export const SUB_DISTRICTS_PART2_DATABASE: readonly UrbanSubDistrict[] = [
  {
    districtId: 'dist_silicon_park',
    displayName: 'Silicon Horizon Tech Campus',
    zoneCategory: 'metropolitan_core',
    centerCoordinatesVec3: [350.0, 15.0, -850.0],
    boundaryRadiusMeters: 750.0,
    baseSpeedLimitKph: 50,
    defaultSurfaceFrictionMu: 1.02,
    averageTrafficDensityScore: 0.45,
    landmarkPointsOfInterest: [
      { poiId: 'poi_vortex_hq', name: 'Vortex Motors Global R&D Center', category: 'dealership', positionVec3: [320.0, 15.0, -820.0] },
      { poiId: 'poi_ev_supercharge_hub', name: '800kW Megawatt Charging Hub', category: 'gas_station', positionVec3: [380.0, 15.0, -890.0] }
    ],
    intersectionNodes: [
      { intersectionId: 'int_tech_blvd_1', coordsVec3: [350.0, 15.0, -850.0], type: '4_way_signal', connectingRoadNames: ['Silicon Parkway', 'Innovation Avenue'] },
      { intersectionId: 'int_tech_rnd_2', coordsVec3: [450.0, 14.0, -920.0], type: 'roundabout', connectingRoadNames: ['Innovation Avenue', 'Data Loop'] }
    ]
  },
  {
    districtId: 'dist_marina_promenade',
    displayName: 'Marina Yacht Basin & Coastal Promenade',
    zoneCategory: 'coastal_highway',
    centerCoordinatesVec3: [1650.0, 4.0, 450.0],
    boundaryRadiusMeters: 900.0,
    baseSpeedLimitKph: 60,
    defaultSurfaceFrictionMu: 0.98,
    averageTrafficDensityScore: 0.35,
    landmarkPointsOfInterest: [
      { poiId: 'poi_yacht_club', name: 'St. Tropez Luxury Yacht Club Paddock', category: 'racetrack_paddock', positionVec3: [1620.0, 4.0, 420.0] },
      { poiId: 'poi_marina_exotics', name: 'Boutique Exotic Hypercar Showroom', category: 'dealership', positionVec3: [1710.0, 4.0, 490.0] }
    ],
    intersectionNodes: [
      { intersectionId: 'int_marina_coastal', coordsVec3: [1650.0, 4.0, 450.0], type: 't_junction', connectingRoadNames: ['Ocean Way', 'Marina Boulevard'] }
    ]
  },
  {
    districtId: 'dist_historic_quarter',
    displayName: 'Old Town Cobblestone Historic Quarter',
    zoneCategory: 'metropolitan_core',
    centerCoordinatesVec3: [-450.0, 8.0, 350.0],
    boundaryRadiusMeters: 600.0,
    baseSpeedLimitKph: 40,
    defaultSurfaceFrictionMu: 0.85, // Lower wet friction on cobblestone
    averageTrafficDensityScore: 0.60,
    landmarkPointsOfInterest: [
      { poiId: 'poi_historic_piazza', name: 'Piazza del Cavallino Classic Garage', category: 'tuning_garage', positionVec3: [-420.0, 8.0, 320.0] }
    ],
    intersectionNodes: [
      { intersectionId: 'int_piazza_cross', coordsVec3: [-450.0, 8.0, 350.0], type: '4_way_signal', connectingRoadNames: ['Via Roma', 'Old Cathedral Way'] }
    ]
  },
  {
    districtId: 'dist_airport_gateway',
    displayName: 'Metropolitan International Cargo Gateway',
    zoneCategory: 'industrial_logistics',
    centerCoordinatesVec3: [1100.0, 1.5, 2100.0],
    boundaryRadiusMeters: 1200.0,
    baseSpeedLimitKph: 80,
    defaultSurfaceFrictionMu: 1.0,
    averageTrafficDensityScore: 0.50,
    landmarkPointsOfInterest: [
      { poiId: 'poi_air_cargo_depot', name: 'DHL Express Air Freight Terminal', category: 'tuning_garage', positionVec3: [1050.0, 1.5, 2050.0] },
      { poiId: 'poi_precinct_south', name: 'Highway Patrol Sector 4 Station', category: 'police_precinct', positionVec3: [1180.0, 1.5, 2150.0] }
    ],
    intersectionNodes: [
      { intersectionId: 'int_airport_interchange', coordsVec3: [1100.0, 1.5, 2100.0], type: 'highway_cloverleaf', connectingRoadNames: ['Interstate 95', 'Aviation Parkway'] }
    ]
  },
  {
    districtId: 'dist_canyon_crest',
    displayName: 'Sunset Canyon Alpine Ridge',
    zoneCategory: 'mountain_touge',
    centerCoordinatesVec3: [2100.0, 320.0, -1800.0],
    boundaryRadiusMeters: 1400.0,
    baseSpeedLimitKph: 90,
    defaultSurfaceFrictionMu: 1.08,
    averageTrafficDensityScore: 0.15, // Clear open mountain road
    landmarkPointsOfInterest: [
      { poiId: 'poi_ridge_overlook', name: 'Eagle Eye Summit Observatory', category: 'racetrack_paddock', positionVec3: [2120.0, 325.0, -1780.0] }
    ],
    intersectionNodes: [
      { intersectionId: 'int_ridge_split', coordsVec3: [2100.0, 320.0, -1800.0], type: 't_junction', connectingRoadNames: ['Canyon Crest Highway', 'Devil Descent Run'] }
    ]
  }
];

export class CityDistrictTopologyPart2Service {
  public static getAllSubDistricts(): UrbanSubDistrict[] {
    return [...SUB_DISTRICTS_PART2_DATABASE];
  }

  public static getSubDistrictById(id: string): UrbanSubDistrict | undefined {
    return SUB_DISTRICTS_PART2_DATABASE.find(d => d.districtId === id);
  }

  public static findDistrictByCoords(x: number, z: number): UrbanSubDistrict | undefined {
    return SUB_DISTRICTS_PART2_DATABASE.find(d => {
      const dx = d.centerCoordinatesVec3[0] - x;
      const dz = d.centerCoordinatesVec3[2] - z;
      return (dx * dx + dz * dz) <= (d.boundaryRadiusMeters * d.boundaryRadiusMeters);
    });
  }
}
