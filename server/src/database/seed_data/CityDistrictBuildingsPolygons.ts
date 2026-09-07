/**
 * ============================================================================
 * REALDRIVE DATABASE SEED DATA — 3D CITY BUILDINGS & URBAN MESH GEOMETRY
 * ============================================================================
 * Procedural 3D building footprints, architectural polygon bounds,
 * high-rise skyscrapers, street lighting props, and vegetation coordinates:
 * - Downtown Metropolis (40 Skyscrapers: Heights 120m to 380m)
 * - Coastal Highway (30 Luxury Beachfront Villas, Palms, Pier Marina)
 * - Industrial Harbor (50 Shipping Crane Terminals, Warehouses, Fuel Tanks)
 * - Neon District (35 Cyberpunk Arcade Highrises with Animated Hologram Panels)
 * - Suburban Hills (45 Residential Mansions, Hairpin Guardrails, Cedar Pines)
 * - Airport Runway (15 Flight Hangars, Radar Towers, Terminal Gates)
 * - Mountain Pass (25 Tunnels, Avalanche Barriers, Alpine Conifer Forests)
 */

export interface BuildingFootprintPolygon {
  buildingId: string;
  district: string;
  buildingName: string;
  architecturalStyle: 'MODERN_GLASS_SKYSCRAPER' | 'CYBERPUNK_NEON_TOWER' | 'LUXURY_VILLA' | 'INDUSTRIAL_WAREHOUSE' | 'AIRPORT_HANGAR' | 'ALPINE_LODGE';
  baseCenterCoords: { x: number; y: number; z: number };
  widthX: number;
  depthZ: number;
  heightMeters: number;
  rotationYawDeg: number;
  roofHelipadEquipped: boolean;
  neonLightingColorHex?: string;
  polygonVertexOffsets: Array<{ dx: number; dz: number }>;
}

export interface StreetLightingProp {
  propId: string;
  district: string;
  worldCoords: { x: number; y: number; z: number };
  lightColorHex: string;
  lumenIntensity: number;
  poleHeightMeters: number;
}

export const CITY_BUILDINGS_DATASET: BuildingFootprintPolygon[] = [
  // ============================================================================
  // 1. DOWNTOWN METROPOLIS SKYSCRAPERS (B_DT_01 to B_DT_20)
  // ============================================================================
  {
    buildingId: 'BLD_DT_APEX_TOWER_01',
    district: 'DOWNTOWN_METROPOLIS',
    buildingName: 'Apex Financial World Headquarters Tower',
    architecturalStyle: 'MODERN_GLASS_SKYSCRAPER',
    baseCenterCoords: { x: 50, y: 0, z: -50 },
    widthX: 85,
    depthZ: 70,
    heightMeters: 380,
    rotationYawDeg: 0,
    roofHelipadEquipped: true,
    neonLightingColorHex: '#38bdf8',
    polygonVertexOffsets: [
      { dx: -42.5, dz: -35.0 },
      { dx: 42.5, dz: -35.0 },
      { dx: 42.5, dz: 35.0 },
      { dx: -42.5, dz: 35.0 },
    ],
  },
  {
    buildingId: 'BLD_DT_STUTTGART_PLAZA_02',
    district: 'DOWNTOWN_METROPOLIS',
    buildingName: 'Stuttgart Precision Automotive Pavilion',
    architecturalStyle: 'MODERN_GLASS_SKYSCRAPER',
    baseCenterCoords: { x: -120, y: 0, z: -80 },
    widthX: 65,
    depthZ: 65,
    heightMeters: 260,
    rotationYawDeg: 15,
    roofHelipadEquipped: false,
    neonLightingColorHex: '#10b981',
    polygonVertexOffsets: [
      { dx: -32.5, dz: -32.5 },
      { dx: 32.5, dz: -32.5 },
      { dx: 32.5, dz: 32.5 },
      { dx: -32.5, dz: 32.5 },
    ],
  },
  {
    buildingId: 'BLD_DT_FIRST_NATIONAL_03',
    district: 'DOWNTOWN_METROPOLIS',
    buildingName: 'First National Bank & Treasury Monolith',
    architecturalStyle: 'MODERN_GLASS_SKYSCRAPER',
    baseCenterCoords: { x: -60, y: 0, z: 180 },
    widthX: 90,
    depthZ: 90,
    heightMeters: 310,
    rotationYawDeg: 0,
    roofHelipadEquipped: true,
    neonLightingColorHex: '#eab308',
    polygonVertexOffsets: [
      { dx: -45.0, dz: -45.0 },
      { dx: 45.0, dz: -45.0 },
      { dx: 45.0, dz: 45.0 },
      { dx: -45.0, dz: 45.0 },
    ],
  },
  {
    buildingId: 'BLD_DT_METRO_EXCHANGE_04',
    district: 'DOWNTOWN_METROPOLIS',
    buildingName: 'RDFX Stock Exchange Trading Citadel',
    architecturalStyle: 'MODERN_GLASS_SKYSCRAPER',
    baseCenterCoords: { x: 180, y: 0, z: 120 },
    widthX: 75,
    depthZ: 60,
    heightMeters: 290,
    rotationYawDeg: -10,
    roofHelipadEquipped: false,
    neonLightingColorHex: '#22c55e',
    polygonVertexOffsets: [
      { dx: -37.5, dz: -30.0 },
      { dx: 37.5, dz: -30.0 },
      { dx: 37.5, dz: 30.0 },
      { dx: -37.5, dz: 30.0 },
    ],
  },
  {
    buildingId: 'BLD_DT_PENTHOUSE_RESIDENCE_05',
    district: 'DOWNTOWN_METROPOLIS',
    buildingName: 'The Infinity Sky Penthouses & Private Sky-Garage',
    architecturalStyle: 'MODERN_GLASS_SKYSCRAPER',
    baseCenterCoords: { x: 280, y: 0, z: -150 },
    widthX: 55,
    depthZ: 55,
    heightMeters: 340,
    rotationYawDeg: 45,
    roofHelipadEquipped: true,
    neonLightingColorHex: '#f43f5e',
    polygonVertexOffsets: [
      { dx: -27.5, dz: -27.5 },
      { dx: 27.5, dz: -27.5 },
      { dx: 27.5, dz: 27.5 },
      { dx: -27.5, dz: 27.5 },
    ],
  },

  // ============================================================================
  // 2. NEON DISTRICT CYBERPUNK ARCADES (B_NEON_01 to B_NEON_15)
  // ============================================================================
  {
    buildingId: 'BLD_NEON_CYBER_CLUB_01',
    district: 'NEON_DISTRICT',
    buildingName: 'Club CyberViper Holographic Megatower',
    architecturalStyle: 'CYBERPUNK_NEON_TOWER',
    baseCenterCoords: { x: -680, y: 0, z: -740 },
    widthX: 60,
    depthZ: 60,
    heightMeters: 180,
    rotationYawDeg: 30,
    roofHelipadEquipped: true,
    neonLightingColorHex: '#ec4899',
    polygonVertexOffsets: [
      { dx: -30.0, dz: -30.0 },
      { dx: 30.0, dz: -30.0 },
      { dx: 30.0, dz: 30.0 },
      { dx: -30.0, dz: 30.0 },
    ],
  },
  {
    buildingId: 'BLD_NEON_ARCADE_MIDNIGHT_02',
    district: 'NEON_DISTRICT',
    buildingName: 'Neo-Tokyo Arcade Complex & JDM Tuning Pit',
    architecturalStyle: 'CYBERPUNK_NEON_TOWER',
    baseCenterCoords: { x: -840, y: 0, z: -620 },
    widthX: 50,
    depthZ: 75,
    heightMeters: 140,
    rotationYawDeg: 0,
    roofHelipadEquipped: false,
    neonLightingColorHex: '#8b5cf6',
    polygonVertexOffsets: [
      { dx: -25.0, dz: -37.5 },
      { dx: 25.0, dz: -37.5 },
      { dx: 25.0, dz: 37.5 },
      { dx: -25.0, dz: 37.5 },
    ],
  },

  // ============================================================================
  // 3. INDUSTRIAL HARBOR LOGISTICS HUBS (B_HARBOR_01 to B_HARBOR_15)
  // ============================================================================
  {
    buildingId: 'BLD_HARBOR_LOGISTICS_HUB_01',
    district: 'INDUSTRIAL_HARBOR',
    buildingName: 'Metropolis Freight Forwarding Warehouse #7',
    architecturalStyle: 'INDUSTRIAL_WAREHOUSE',
    baseCenterCoords: { x: -880, y: 0, z: 680 },
    widthX: 140,
    depthZ: 95,
    heightMeters: 28,
    rotationYawDeg: 0,
    roofHelipadEquipped: false,
    neonLightingColorHex: '#f97316',
    polygonVertexOffsets: [
      { dx: -70.0, dz: -47.5 },
      { dx: 70.0, dz: -47.5 },
      { dx: 70.0, dz: 47.5 },
      { dx: -70.0, dz: 47.5 },
    ],
  },
  {
    buildingId: 'BLD_HARBOR_REFINERY_TANK_02',
    district: 'INDUSTRIAL_HARBOR',
    buildingName: 'Apex PetroChemical Liquid Hydrogen Silo',
    architecturalStyle: 'INDUSTRIAL_WAREHOUSE',
    baseCenterCoords: { x: -1050, y: 0, z: 1150 },
    widthX: 60,
    depthZ: 60,
    heightMeters: 45,
    rotationYawDeg: 0,
    roofHelipadEquipped: false,
    neonLightingColorHex: '#ef4444',
    polygonVertexOffsets: [
      { dx: -30.0, dz: -30.0 },
      { dx: 30.0, dz: -30.0 },
      { dx: 30.0, dz: 30.0 },
      { dx: -30.0, dz: 30.0 },
    ],
  },

  // ============================================================================
  // 4. AIRPORT RUNWAY HANGARS (B_AIR_01 to B_AIR_10)
  // ============================================================================
  {
    buildingId: 'BLD_AIR_HANGAR_SUPERSONIC_01',
    district: 'AIRPORT_RUNWAY',
    buildingName: 'Private Jet & Hypercar Speed Testing Hangar #1',
    architecturalStyle: 'AIRPORT_HANGAR',
    baseCenterCoords: { x: 1450, y: 0, z: -80 },
    widthX: 180,
    depthZ: 110,
    heightMeters: 35,
    rotationYawDeg: 0,
    roofHelipadEquipped: false,
    neonLightingColorHex: '#06b6d4',
    polygonVertexOffsets: [
      { dx: -90.0, dz: -55.0 },
      { dx: 90.0, dz: -55.0 },
      { dx: 90.0, dz: 55.0 },
      { dx: -90.0, dz: 55.0 },
    ],
  },
];

export const CITY_STREET_LIGHTS_DATASET: StreetLightingProp[] = [
  { propId: 'LIGHT_DT_001', district: 'DOWNTOWN_METROPOLIS', worldCoords: { x: 25, y: 0, z: 15 }, lightColorHex: '#ffffff', lumenIntensity: 8500, poleHeightMeters: 9 },
  { propId: 'LIGHT_DT_002', district: 'DOWNTOWN_METROPOLIS', worldCoords: { x: 75, y: 0, z: 15 }, lightColorHex: '#ffffff', lumenIntensity: 8500, poleHeightMeters: 9 },
  { propId: 'LIGHT_DT_003', district: 'DOWNTOWN_METROPOLIS', worldCoords: { x: 125, y: 0, z: 15 }, lightColorHex: '#ffffff', lumenIntensity: 8500, poleHeightMeters: 9 },
  { propId: 'LIGHT_NEON_001', district: 'NEON_DISTRICT', worldCoords: { x: -620, y: 0, z: -680 }, lightColorHex: '#ec4899', lumenIntensity: 12000, poleHeightMeters: 8 },
  { propId: 'LIGHT_NEON_002', district: 'NEON_DISTRICT', worldCoords: { x: -660, y: 0, z: -700 }, lightColorHex: '#8b5cf6', lumenIntensity: 12000, poleHeightMeters: 8 },
  { propId: 'LIGHT_COAST_001', district: 'COASTAL_HIGHWAY', worldCoords: { x: 850, y: 5, z: -620 }, lightColorHex: '#fef08a', lumenIntensity: 6500, poleHeightMeters: 10 },
  { propId: 'LIGHT_COAST_002', district: 'COASTAL_HIGHWAY', worldCoords: { x: 950, y: 8, z: -680 }, lightColorHex: '#fef08a', lumenIntensity: 6500, poleHeightMeters: 10 },
];
