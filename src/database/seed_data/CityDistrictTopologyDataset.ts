/**
 * ============================================================================
 * REALDRIVE DATABASE SEED DATA — 7-DISTRICT CITY ROAD NETWORK & TOPOLOGY
 * ============================================================================
 * Urban 3D map spatial nodes, road segment geometries, speed radar enforcement
 * locations, and points of interest across RealDrive Metropolis:
 * 1. Downtown Metropolis (Skyscrapers, Central Bank, Luxury Car Showrooms)
 * 2. Coastal Highway (Ocean Boulevard, Seaside Mansions, Drift Overlooks)
 * 3. Industrial Harbor (Container Yards, Crane Terminals, Underground Drag Strip)
 * 4. Neon District (Nightclub Strip, Cyberpunk Alleys, Midnight Street Races)
 * 5. Suburban Hills (Winding Mountain Passes, Modern Villas, Scenic Viewpoints)
 * 6. Airport Runway (Long Drag Straightaways, Flight Hangars, Air Cargo Hubs)
 * 7. Mountain Pass (High Altitude Touge Hairpins, Tunnel Networks, Ski Chalets)
 */

export interface CityIntersectionNode {
  nodeId: string;
  district: string;
  name: string;
  worldCoords: { x: number; y: number; z: number };
  trafficLightControlled: boolean;
  greenPhaseDurationSeconds: number;
  speedLimitKmh: number;
  lanesCount: number;
  connectedEdgeNodeIds: string[];
}

export interface PointOfInterestPOI {
  poiId: string;
  name: string;
  district: string;
  category: 'DEALERSHIP' | 'WORKSHOP_GARAGE' | 'GAS_STATION' | 'BANK_BRANCH' | 'POLICE_STATION' | 'RACE_TRACK_PADDOCK' | 'REAL_ESTATE_MANSION';
  worldCoords: { x: number; y: number; z: number };
  interactableRadiusMeters: number;
  description: string;
}

export const CITY_ROAD_NODES_DATASET: CityIntersectionNode[] = [
  // ============================================================================
  // 1. DOWNTOWN METROPOLIS (Nodes D01 - D25)
  // ============================================================================
  {
    nodeId: 'NODE_DT_01',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Metropolis Financial Grand Plaza',
    worldCoords: { x: 0, y: 0, z: 0 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 45,
    speedLimitKmh: 50,
    lanesCount: 6,
    connectedEdgeNodeIds: ['NODE_DT_02', 'NODE_DT_04', 'NODE_DT_08', 'NODE_COAST_01'],
  },
  {
    nodeId: 'NODE_DT_02',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Skyline Boulevard & 5th Avenue',
    worldCoords: { x: 250, y: 0, z: 0 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 40,
    speedLimitKmh: 60,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_01', 'NODE_DT_03', 'NODE_DT_05'],
  },
  {
    nodeId: 'NODE_DT_03',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Apex Supercar Showroom Row',
    worldCoords: { x: 500, y: 0, z: 0 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 60,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_02', 'NODE_AIRPORT_01', 'NODE_DT_06'],
  },
  {
    nodeId: 'NODE_DT_04',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Central Bank & Treasury Gateway',
    worldCoords: { x: 0, y: 0, z: 250 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 35,
    speedLimitKmh: 50,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_01', 'NODE_DT_05', 'NODE_DT_07', 'NODE_NEON_01'],
  },
  {
    nodeId: 'NODE_DT_05',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Metropolis Expressway Southbound Interchange',
    worldCoords: { x: 250, y: 0, z: 250 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 90,
    lanesCount: 6,
    connectedEdgeNodeIds: ['NODE_DT_02', 'NODE_DT_04', 'NODE_DT_06', 'NODE_HARBOR_01'],
  },
  {
    nodeId: 'NODE_DT_06',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'East River Suspension Bridge Approach',
    worldCoords: { x: 500, y: 0, z: 250 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 100,
    lanesCount: 8,
    connectedEdgeNodeIds: ['NODE_DT_03', 'NODE_DT_05', 'NODE_HILLS_01'],
  },
  {
    nodeId: 'NODE_DT_07',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Metropolis Police Headquarters Perimeter',
    worldCoords: { x: 0, y: 0, z: 500 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 30,
    speedLimitKmh: 50,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_04', 'NODE_DT_08', 'NODE_HARBOR_02'],
  },
  {
    nodeId: 'NODE_DT_08',
    district: 'DOWNTOWN_METROPOLIS',
    name: 'Apex Dyno Tuning Workshop Bay',
    worldCoords: { x: -250, y: 0, z: 0 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 50,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_01', 'NODE_DT_07', 'NODE_NEON_02'],
  },

  // ============================================================================
  // 2. COASTAL HIGHWAY (Nodes C01 - C15)
  // ============================================================================
  {
    nodeId: 'NODE_COAST_01',
    district: 'COASTAL_HIGHWAY',
    name: 'Ocean Boulevard Northbound Entrance',
    worldCoords: { x: 800, y: 5, z: -600 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 120,
    lanesCount: 6,
    connectedEdgeNodeIds: ['NODE_DT_01', 'NODE_COAST_02'],
  },
  {
    nodeId: 'NODE_COAST_02',
    district: 'COASTAL_HIGHWAY',
    name: 'Seaside Cliffside High-Speed Sweeper (Turn 1)',
    worldCoords: { x: 1200, y: 15, z: -800 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 120,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_COAST_01', 'NODE_COAST_03'],
  },
  {
    nodeId: 'NODE_COAST_03',
    district: 'COASTAL_HIGHWAY',
    name: 'Marina Yacht Club & Beachfront Promenade',
    worldCoords: { x: 1600, y: 2, z: -1000 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 50,
    speedLimitKmh: 70,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_COAST_02', 'NODE_COAST_04', 'NODE_AIRPORT_02'],
  },
  {
    nodeId: 'NODE_COAST_04',
    district: 'COASTAL_HIGHWAY',
    name: 'Lighthouse Point Coastal Lookout',
    worldCoords: { x: 2000, y: 25, z: -1200 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 100,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_COAST_03', 'NODE_MOUNTAIN_01'],
  },

  // ============================================================================
  // 3. INDUSTRIAL HARBOR (Nodes H01 - H15)
  // ============================================================================
  {
    nodeId: 'NODE_HARBOR_01',
    district: 'INDUSTRIAL_HARBOR',
    name: 'Container Terminal Gate #4',
    worldCoords: { x: -800, y: 0, z: 600 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 60,
    speedLimitKmh: 60,
    lanesCount: 6,
    connectedEdgeNodeIds: ['NODE_DT_05', 'NODE_HARBOR_02', 'NODE_HARBOR_03'],
  },
  {
    nodeId: 'NODE_HARBOR_02',
    district: 'INDUSTRIAL_HARBOR',
    name: 'Drydock Logistics Heavy Rail Crossing',
    worldCoords: { x: -1100, y: 0, z: 800 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 45,
    speedLimitKmh: 50,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_HARBOR_01', 'NODE_DT_07', 'NODE_HARBOR_04'],
  },
  {
    nodeId: 'NODE_HARBOR_03',
    district: 'INDUSTRIAL_HARBOR',
    name: 'Harbor Drift Tandem Arena Entrance',
    worldCoords: { x: -700, y: 0, z: 1000 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 80,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_HARBOR_01', 'NODE_HARBOR_04'],
  },
  {
    nodeId: 'NODE_HARBOR_04',
    district: 'INDUSTRIAL_HARBOR',
    name: 'Petroleum Refinery Pipeline Row',
    worldCoords: { x: -1000, y: 0, z: 1200 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 70,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_HARBOR_02', 'NODE_HARBOR_03', 'NODE_MOUNTAIN_02'],
  },

  // ============================================================================
  // 4. NEON DISTRICT (Nodes N01 - N15)
  // ============================================================================
  {
    nodeId: 'NODE_NEON_01',
    district: 'NEON_DISTRICT',
    name: 'Cyberpunk Strip Central Crossroads',
    worldCoords: { x: -600, y: 0, z: -700 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 35,
    speedLimitKmh: 50,
    lanesCount: 6,
    connectedEdgeNodeIds: ['NODE_DT_04', 'NODE_NEON_02', 'NODE_NEON_03'],
  },
  {
    nodeId: 'NODE_NEON_02',
    district: 'NEON_DISTRICT',
    name: 'Underground Nightclub Row & Midnight Meets',
    worldCoords: { x: -900, y: 0, z: -600 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 60,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_08', 'NODE_NEON_01', 'NODE_NEON_04'],
  },
  {
    nodeId: 'NODE_NEON_03',
    district: 'NEON_DISTRICT',
    name: 'Neon Drag 1/4 Mile Staging Area',
    worldCoords: { x: -500, y: 0, z: -1000 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 100,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_NEON_01', 'NODE_NEON_04'],
  },

  // ============================================================================
  // 5. SUBURBAN HILLS (Nodes S01 - S15)
  // ============================================================================
  {
    nodeId: 'NODE_HILLS_01',
    district: 'SUBURBAN_HILLS',
    name: 'Suburban Foothills Access Parkway',
    worldCoords: { x: 600, y: 40, z: 700 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 80,
    lanesCount: 4,
    connectedEdgeNodeIds: ['NODE_DT_06', 'NODE_HILLS_02'],
  },
  {
    nodeId: 'NODE_HILLS_02',
    district: 'SUBURBAN_HILLS',
    name: 'Billionaire Row Mansion Gates',
    worldCoords: { x: 900, y: 95, z: 900 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 60,
    lanesCount: 2,
    connectedEdgeNodeIds: ['NODE_HILLS_01', 'NODE_HILLS_03'],
  },

  // ============================================================================
  // 6. AIRPORT RUNWAY (Nodes A01 - A10)
  // ============================================================================
  {
    nodeId: 'NODE_AIRPORT_01',
    district: 'AIRPORT_RUNWAY',
    name: 'Metropolis International Airport Terminal Gate',
    worldCoords: { x: 1200, y: 0, z: 0 },
    trafficLightControlled: true,
    greenPhaseDurationSeconds: 45,
    speedLimitKmh: 70,
    lanesCount: 6,
    connectedEdgeNodeIds: ['NODE_DT_03', 'NODE_AIRPORT_02', 'NODE_AIRPORT_03'],
  },
  {
    nodeId: 'NODE_AIRPORT_02',
    district: 'AIRPORT_RUNWAY',
    name: 'Main Runway 09L High Speed Top-Speed Trap (3,000m)',
    worldCoords: { x: 2200, y: 0, z: 0 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 450,
    lanesCount: 8,
    connectedEdgeNodeIds: ['NODE_AIRPORT_01', 'NODE_COAST_03'],
  },

  // ============================================================================
  // 7. MOUNTAIN PASS (Nodes M01 - M10)
  // ============================================================================
  {
    nodeId: 'NODE_MOUNTAIN_01',
    district: 'MOUNTAIN_PASS',
    name: 'Mount Akina Base Camp Summit Road',
    worldCoords: { x: 0, y: 150, z: 1200 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 90,
    lanesCount: 2,
    connectedEdgeNodeIds: ['NODE_COAST_04', 'NODE_MOUNTAIN_02'],
  },
  {
    nodeId: 'NODE_MOUNTAIN_02',
    district: 'MOUNTAIN_PASS',
    name: 'Five Consecutive Hairpins Apex Summit (Elevation 750m)',
    worldCoords: { x: 300, y: 480, z: 1800 },
    trafficLightControlled: false,
    greenPhaseDurationSeconds: 0,
    speedLimitKmh: 80,
    lanesCount: 2,
    connectedEdgeNodeIds: ['NODE_MOUNTAIN_01', 'NODE_HARBOR_04'],
  },
];

export const CITY_POINTS_OF_INTEREST_POI: PointOfInterestPOI[] = [
  {
    poiId: 'poi_showroom_flagship_01',
    name: 'Apex Motor Group Showroom Flagship',
    district: 'DOWNTOWN_METROPOLIS',
    category: 'DEALERSHIP',
    worldCoords: { x: 480, y: 0, z: -20 },
    interactableRadiusMeters: 30,
    description: 'Premier dealership featuring the latest supercars, certified pre-owned stock, and factory warranties.',
  },
  {
    poiId: 'poi_dyno_workshop_01',
    name: 'Downtown Apex High-Performance Dyno Bay',
    district: 'DOWNTOWN_METROPOLIS',
    category: 'WORKSHOP_GARAGE',
    worldCoords: { x: -240, y: 0, z: 15 },
    interactableRadiusMeters: 25,
    description: 'State-of-the-art rolling road dynamometer, laser alignment rig, and MoTeC ECU flashing station.',
  },
  {
    poiId: 'poi_bank_central_01',
    name: 'First National Bank of Metropolis Treasury',
    district: 'DOWNTOWN_METROPOLIS',
    category: 'BANK_BRANCH',
    worldCoords: { x: 10, y: 0, z: 240 },
    interactableRadiusMeters: 20,
    description: 'Main banking headquarters for wire transfers, car loan approvals, and stock dividend payouts.',
  },
  {
    poiId: 'poi_gas_coastal_01',
    name: 'Apex Petroleum 108-RON Racing Fuel Depot',
    district: 'COASTAL_HIGHWAY',
    category: 'GAS_STATION',
    worldCoords: { x: 1180, y: 15, z: -780 },
    interactableRadiusMeters: 20,
    description: 'High-octane ethanol E85 and 108-RON unleaded racing fuel pumps.',
  },
  {
    poiId: 'poi_drift_arena_01',
    name: 'Industrial Harbor Drift Gymkhana Paddock',
    district: 'INDUSTRIAL_HARBOR',
    category: 'RACE_TRACK_PADDOCK',
    worldCoords: { x: -680, y: 0, z: 980 },
    interactableRadiusMeters: 40,
    description: 'Paddock area for Formula Drift tandem practice battles and tire changing stations.',
  },
];
