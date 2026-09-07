/**
 * GaragePropertyManager — Real Estate Portfolio, Luxury Workshop Upgrades & Fleet Storage
 */

export type PropertyLocationDistrict = 'DOWNTOWN' | 'HARBOR' | 'SUBURBS' | 'AIRPORT' | 'MOUNTAIN_PASS' | 'INDUSTRIAL';

export interface GaragePropertyUpgrade {
  id: string;
  name: string;
  category: 'FLOORING' | 'LIGHTING' | 'CAR_LIFTS' | 'TOOL_STATION' | 'LOUNGE' | 'SECURITY';
  costCredits: number;
  isInstalled: boolean;
  description: string;
  prestigeBonus: number;
}

export interface GarageProperty {
  id: string;
  name: string;
  district: PropertyLocationDistrict;
  address: string;
  purchasePriceCredits: number;
  vehicleCapacity: number;
  currentVehicleIds: string[];
  isOwned: boolean;
  prestigeRating: number; // 1 to 5 stars
  hasDynoBay: boolean;
  hasPaintBooth: boolean;
  hasDetailingBay: boolean;
  hasDirectTrackAccess: boolean;
  propertyTaxPerDay: number;
  propertyValuation: number;
  availableUpgrades: GaragePropertyUpgrade[];
  description: string;
}

export class GaragePropertyManager {
  private static masterPropertyList: GarageProperty[] = [
    {
      id: 'prop_downtown_sky_penthouse',
      name: 'Apex Sky-Penthouse Glass Garage',
      district: 'DOWNTOWN',
      address: '770 Financial Tower Way, Floor 45',
      purchasePriceCredits: 1850000,
      vehicleCapacity: 6,
      currentVehicleIds: [],
      isOwned: false,
      prestigeRating: 5,
      hasDynoBay: false,
      hasPaintBooth: false,
      hasDetailingBay: true,
      hasDirectTrackAccess: false,
      propertyTaxPerDay: 450,
      propertyValuation: 1850000,
      description: 'Ultra-exclusive high-rise glass sky-garage with vehicle elevator and panoramic 360-degree skyline views.',
      availableUpgrades: [
        {
          id: 'upg_epoxy_marble',
          name: 'Italian Carrara Marble Polished Tile',
          category: 'FLOORING',
          costCredits: 35000,
          isInstalled: false,
          description: 'Mirror-finish polished marble flooring with integrated LED ground strips.',
          prestigeBonus: 25,
        },
        {
          id: 'upg_neon_cieling',
          name: 'Hexagonal Architectural LED Grid',
          category: 'LIGHTING',
          costCredits: 18000,
          isInstalled: false,
          description: 'Ultra-bright diffused honeycomb lighting for showcase photography.',
          prestigeBonus: 15,
        },
      ],
    },
    {
      id: 'prop_harbor_industrial_warehouse',
      name: 'Pier 9 Deepwater Logistics & Dyno Depot',
      district: 'HARBOR',
      address: 'Pier 9 Ocean Freight Access Way',
      purchasePriceCredits: 850000,
      vehicleCapacity: 20,
      currentVehicleIds: [],
      isOwned: false,
      prestigeRating: 3,
      hasDynoBay: true,
      hasPaintBooth: true,
      hasDetailingBay: true,
      hasDirectTrackAccess: false,
      propertyTaxPerDay: 220,
      propertyValuation: 850000,
      description: 'Massive converted industrial shipyard warehouse equipped with an all-wheel-drive in-ground chassis dynamometer.',
      availableUpgrades: [
        {
          id: 'upg_heavy_lifts',
          name: 'Quad 2-Post Commercial Vehicle Lifts',
          category: 'CAR_LIFTS',
          costCredits: 42000,
          isInstalled: false,
          description: 'Heavy-duty 10,000 lb hydraulic lifts for simultaneous mechanical overhauls.',
          prestigeBonus: 30,
        },
      ],
    },
    {
      id: 'prop_suburbs_luxury_villa',
      name: 'Pinecrest Valley 4-Car Luxury Retreat',
      district: 'SUBURBS',
      address: '142 Pinecrest Country Club Boulevard',
      purchasePriceCredits: 620000,
      vehicleCapacity: 4,
      currentVehicleIds: [],
      isOwned: true, // starter owned property
      prestigeRating: 4,
      hasDynoBay: false,
      hasPaintBooth: false,
      hasDetailingBay: true,
      hasDirectTrackAccess: false,
      propertyTaxPerDay: 120,
      propertyValuation: 620000,
      description: 'Heated garage with climate-controlled detailing bay in the peaceful suburban hills.',
      availableUpgrades: [],
    },
    {
      id: 'prop_airport_private_hangar',
      name: 'Skyport Executive Hangar Complex',
      district: 'AIRPORT',
      address: 'Skyport Gate 14 Airfield Runway Access',
      purchasePriceCredits: 2400000,
      vehicleCapacity: 30,
      currentVehicleIds: [],
      isOwned: false,
      prestigeRating: 5,
      hasDynoBay: true,
      hasPaintBooth: true,
      hasDetailingBay: true,
      hasDirectTrackAccess: true,
      propertyTaxPerDay: 600,
      propertyValuation: 2400000,
      description: 'Massive private aircraft hangar with direct taxiway runway access for terminal top speed testing.',
      availableUpgrades: [],
    },
    {
      id: 'prop_mountain_touge_workshop',
      name: 'Skyline Ridge Touge Workshop',
      district: 'MOUNTAIN_PASS',
      address: 'Skyline Canyon Pass Mile Marker 4',
      purchasePriceCredits: 480000,
      vehicleCapacity: 6,
      currentVehicleIds: [],
      isOwned: false,
      prestigeRating: 4,
      hasDynoBay: true,
      hasPaintBooth: false,
      hasDetailingBay: false,
      hasDirectTrackAccess: true,
      propertyTaxPerDay: 90,
      propertyValuation: 480000,
      description: 'Dedicated mountain touge drift workshop situated directly at the foot of the canyon switchbacks.',
      availableUpgrades: [],
    },
  ];

  public static getAllProperties(): GarageProperty[] {
    return this.masterPropertyList;
  }

  public static getOwnedProperties(): GarageProperty[] {
    return this.masterPropertyList.filter((p) => p.isOwned);
  }

  public static purchaseProperty(propertyId: string, playerCredits: number): { success: boolean; message: string; remainingCredits: number } {
    const prop = this.masterPropertyList.find((p) => p.id === propertyId);
    if (!prop) return { success: false, message: 'Property not found', remainingCredits: playerCredits };
    if (prop.isOwned) return { success: false, message: 'Property is already owned', remainingCredits: playerCredits };
    if (playerCredits < prop.purchasePriceCredits) {
      return { success: false, message: `Insufficient credits. Requires $${prop.purchasePriceCredits.toLocaleString()}`, remainingCredits: playerCredits };
    }

    prop.isOwned = true;
    return {
      success: true,
      message: `Successfully acquired deed to ${prop.name}!`,
      remainingCredits: playerCredits - prop.purchasePriceCredits,
    };
  }
}
