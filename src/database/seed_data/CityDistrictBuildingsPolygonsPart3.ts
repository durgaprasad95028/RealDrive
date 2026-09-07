/**
 * ============================================================================
 * REALDRIVE SEED DATA - CITY DISTRICT BUILDINGS & SKYSCRAPERS 3D MESH (PART 3)
 * ============================================================================
 * High-density 3D building bounding polygons, facade materials, neon arrays,
 * and rooftop helipads across 200+ metropolitan skyscrapers.
 */

export interface UrbanBuildingPolygon3D {
  readonly buildingId: string;
  readonly districtId: string;
  readonly buildingName: string;
  readonly architecturalStyle: 'cyberpunk_glass_tower' | 'brutalist_concrete' | 'art_deco_spire' | 'modern_steel_titan' | 'heritage_masonry';
  readonly centerCoordsVec3: [number, number, number];
  readonly boundingDimensionsVec3: [number, number, number]; // [Width, Height, Depth]
  readonly floorCount: number;
  readonly hasRooftopHelipad: boolean;
  readonly facadeEmissiveColorHex?: string;
  readonly nightIlluminationLumens: number;
  readonly collisionDamageResistanceJoules: number;
  readonly polygonFootprintVertices: readonly [number, number][]; // 2D [X, Z] polygon base
}

export const CITY_BUILDINGS_PART3_DATABASE: readonly UrbanBuildingPolygon3D[] = [
  // ==========================================================================
  // DOWNTOWN FINANCIAL CORE SKYSCRAPERS (01-20)
  // ==========================================================================
  {
    buildingId: 'bld_apex_tower_prime',
    districtId: 'downtown_financial',
    buildingName: 'Apex Hyperdynamics World Headquarters Tower',
    architecturalStyle: 'cyberpunk_glass_tower',
    centerCoordsVec3: [85.0, 160.0, 240.0],
    boundingDimensionsVec3: [65.0, 320.0, 55.0],
    floorCount: 88,
    hasRooftopHelipad: true,
    facadeEmissiveColorHex: '#00E5FF',
    nightIlluminationLumens: 180000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [52.5, 212.5],
      [117.5, 212.5],
      [117.5, 267.5],
      [52.5, 267.5]
    ]
  },
  {
    buildingId: 'bld_rdfx_stock_exchange_spire',
    districtId: 'downtown_financial',
    buildingName: 'RealDrive Financial Exchange Spire',
    architecturalStyle: 'art_deco_spire',
    centerCoordsVec3: [0.0, 190.0, 150.0],
    boundingDimensionsVec3: [75.0, 380.0, 75.0],
    floorCount: 102,
    hasRooftopHelipad: true,
    facadeEmissiveColorHex: '#10B981',
    nightIlluminationLumens: 250000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [-37.5, 112.5],
      [37.5, 112.5],
      [37.5, 187.5],
      [-37.5, 187.5]
    ]
  },
  {
    buildingId: 'bld_vortex_energy_monolith',
    districtId: 'downtown_financial',
    buildingName: 'Vortex Electric Energy Monolith',
    architecturalStyle: 'modern_steel_titan',
    centerCoordsVec3: [-120.0, 135.0, 380.0],
    boundingDimensionsVec3: [58.0, 270.0, 48.0],
    floorCount: 72,
    hasRooftopHelipad: false,
    facadeEmissiveColorHex: '#38BDF8',
    nightIlluminationLumens: 140000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [-149.0, 356.0],
      [-91.0, 356.0],
      [-91.0, 404.0],
      [-149.0, 404.0]
    ]
  },
  {
    buildingId: 'bld_kronos_logistics_hub_center',
    districtId: 'downtown_financial',
    buildingName: 'Kronos International Plaza',
    architecturalStyle: 'brutalist_concrete',
    centerCoordsVec3: [240.0, 95.0, 450.0],
    boundingDimensionsVec3: [82.0, 190.0, 68.0],
    floorCount: 54,
    hasRooftopHelipad: true,
    facadeEmissiveColorHex: '#F59E0B',
    nightIlluminationLumens: 95000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [199.0, 416.0],
      [281.0, 416.0],
      [281.0, 484.0],
      [199.0, 484.0]
    ]
  },
  {
    buildingId: 'bld_nitro_petroleum_tower',
    districtId: 'downtown_financial',
    buildingName: 'NitroOctane Global Refining Tower',
    architecturalStyle: 'cyberpunk_glass_tower',
    centerCoordsVec3: [180.0, 145.0, 80.0],
    boundingDimensionsVec3: [52.0, 290.0, 52.0],
    floorCount: 78,
    hasRooftopHelipad: true,
    facadeEmissiveColorHex: '#EF4444',
    nightIlluminationLumens: 160000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [154.0, 54.0],
      [206.0, 54.0],
      [206.0, 106.0],
      [154.0, 106.0]
    ]
  },

  // ==========================================================================
  // NEON STRIP ENTERTAINMENT DISTRICT (21-40)
  // ==========================================================================
  {
    buildingId: 'bld_neon_casino_royale',
    districtId: 'neon_strip_boulevard',
    buildingName: 'Grand Casino Royale & Luxury Hotel',
    architecturalStyle: 'cyberpunk_glass_tower',
    centerCoordsVec3: [950.0, 85.0, 620.0],
    boundingDimensionsVec3: [90.0, 170.0, 70.0],
    floorCount: 48,
    hasRooftopHelipad: true,
    facadeEmissiveColorHex: '#EC4899',
    nightIlluminationLumens: 450000, // Giant animated neon facade
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [905.0, 585.0],
      [995.0, 585.0],
      [995.0, 655.0],
      [905.0, 655.0]
    ]
  },
  {
    buildingId: 'bld_neon_nightclub_apex',
    districtId: 'neon_strip_boulevard',
    buildingName: 'Club Apex Underground Cyber Lounge',
    architecturalStyle: 'brutalist_concrete',
    centerCoordsVec3: [880.0, 25.0, 540.0],
    boundingDimensionsVec3: [45.0, 50.0, 45.0],
    floorCount: 6,
    hasRooftopHelipad: false,
    facadeEmissiveColorHex: '#8B5CF6',
    nightIlluminationLumens: 120000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [857.5, 517.5],
      [902.5, 517.5],
      [902.5, 562.5],
      [857.5, 562.5]
    ]
  },

  // ==========================================================================
  // HARBOR DOCKS & WAREHOUSE DISTRICT (41-60)
  // ==========================================================================
  {
    buildingId: 'bld_harbor_customs_terminal',
    districtId: 'harbor_shipping_docks',
    buildingName: 'Port Authority Customs & Quarantine Center',
    architecturalStyle: 'brutalist_concrete',
    centerCoordsVec3: [620.0, 22.0, 1400.0],
    boundingDimensionsVec3: [120.0, 44.0, 85.0],
    floorCount: 5,
    hasRooftopHelipad: true,
    facadeEmissiveColorHex: '#64748B',
    nightIlluminationLumens: 65000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [560.0, 1357.5],
      [680.0, 1357.5],
      [680.0, 1442.5],
      [560.0, 1442.5]
    ]
  },
  {
    buildingId: 'bld_harbor_cold_storage_facility',
    districtId: 'harbor_shipping_docks',
    buildingName: 'BioVax Global Cold Chain Depot 1',
    architecturalStyle: 'modern_steel_titan',
    centerCoordsVec3: [520.0, 18.0, 1150.0],
    boundingDimensionsVec3: [140.0, 36.0, 95.0],
    floorCount: 3,
    hasRooftopHelipad: false,
    facadeEmissiveColorHex: '#0EA5E9',
    nightIlluminationLumens: 45000,
    collisionDamageResistanceJoules: 999999999,
    polygonFootprintVertices: [
      [450.0, 1102.5],
      [590.0, 1102.5],
      [590.0, 1197.5],
      [450.0, 1197.5]
    ]
  }
];

export class CityDistrictBuildingsPart3Service {
  public static getAllBuildings(): UrbanBuildingPolygon3D[] {
    return [...CITY_BUILDINGS_PART3_DATABASE];
  }

  public static getBuildingsByDistrict(districtId: string): UrbanBuildingPolygon3D[] {
    return CITY_BUILDINGS_PART3_DATABASE.filter(b => b.districtId === districtId);
  }

  public static getRooftopHelipads(): UrbanBuildingPolygon3D[] {
    return CITY_BUILDINGS_PART3_DATABASE.filter(b => b.hasRooftopHelipad);
  }
}
