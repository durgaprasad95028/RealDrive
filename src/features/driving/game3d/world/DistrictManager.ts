import * as THREE from 'three';

export type DistrictType = 
  | 'DOWNTOWN' 
  | 'HARBOR' 
  | 'INDUSTRIAL' 
  | 'SUBURBS' 
  | 'AIRPORT' 
  | 'HIGHWAY' 
  | 'MOUNTAIN_PASS';

export interface DistrictBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  center: THREE.Vector2;
  radius: number;
}

export interface DistrictEnvironmentConfig {
  ambientColor: number;
  ambientIntensity: number;
  fogColor: number;
  fogDensity: number;
  sunIntensity: number;
  sunColor: number;
  groundBaseColor: number;
  groundGripMultiplier: number;
  baseSpeedLimitKmH: number;
  trafficDensityMultiplier: number;
  pedestrianDensityMultiplier: number;
  heavyTruckAllowed: boolean;
  busRoutesActive: boolean;
  architecturalStyle: 'MODERN_SKYSCRAPERS' | 'INDUSTRIAL_WAREHOUSES' | 'PORT_CONTAINERS' | 'RESIDENTIAL_SUBURBAN' | 'AIRPORT_TERMINAL' | 'HIGHWAY_BARRIERS' | 'CANYON_ROCKS';
}

export interface LandmarkPOI {
  id: string;
  name: string;
  category: 'AIRPORT' | 'GAS_STATION' | 'PORT' | 'HOTEL' | 'HOSPITAL' | 'POLICE_STATION' | 'BANK' | 'WAREHOUSE' | 'SCENIC_VIEW' | 'RACING_CIRCUIT';
  position: THREE.Vector3;
  rotationY: number;
  district: DistrictType;
  description: string;
  rewardMultiplier: number;
  icon: string;
}

export interface DistrictDefinition {
  id: DistrictType;
  name: string;
  tagline: string;
  bounds: DistrictBounds;
  environment: DistrictEnvironmentConfig;
  landmarks: LandmarkPOI[];
  roadTypes: ('EXPRESSWAY' | 'AVENUE' | 'BOULEVARD' | 'STREET' | 'ALLEY' | 'MOUNTAIN_ROAD')[];
}

export class DistrictManager {
  private districts: Map<DistrictType, DistrictDefinition> = new Map();
  private allLandmarks: LandmarkPOI[] = [];
  private currentDistrict: DistrictDefinition;
  private transitionAlpha: number = 1.0;

  constructor() {
    this.initializeDistricts();
    this.currentDistrict = this.districts.get('DOWNTOWN')!;
  }

  private initializeDistricts() {
    // 1. DOWNTOWN FINANCIAL DISTRICT (Central Metropolis)
    const downtown: DistrictDefinition = {
      id: 'DOWNTOWN',
      name: 'Downtown Financial Center',
      tagline: 'High-density urban metropolis with towering commercial skyscrapers and active signals.',
      bounds: {
        minX: -500,
        maxX: 500,
        minZ: -400,
        maxZ: 500,
        center: new THREE.Vector2(0, 50),
        radius: 600,
      },
      environment: {
        ambientColor: 0x223355,
        ambientIntensity: 0.85,
        fogColor: 0x111c2e,
        fogDensity: 0.0018,
        sunIntensity: 1.2,
        sunColor: 0xfffaed,
        groundBaseColor: 0x161a22,
        groundGripMultiplier: 1.0,
        baseSpeedLimitKmH: 60,
        trafficDensityMultiplier: 1.3,
        pedestrianDensityMultiplier: 1.5,
        heavyTruckAllowed: false,
        busRoutesActive: true,
        architecturalStyle: 'MODERN_SKYSCRAPERS',
      },
      landmarks: [
        {
          id: 'poi_downtown_plaza',
          name: 'Apex Financial Plaza',
          category: 'BANK',
          position: new THREE.Vector3(0, 0, 0),
          rotationY: 0,
          district: 'DOWNTOWN',
          description: 'The central corporate landmark with executive parking and fast courier pickups.',
          rewardMultiplier: 1.2,
          icon: '🏦',
        },
        {
          id: 'poi_grand_hotel',
          name: 'The Grand Royale Luxury Suites',
          category: 'HOTEL',
          position: new THREE.Vector3(180, 0, 120),
          rotationY: Math.PI / 2,
          district: 'DOWNTOWN',
          description: 'Five-star VIP chauffeur drop-off with premier hospitality dispatch contracts.',
          rewardMultiplier: 1.35,
          icon: '🏨',
        },
        {
          id: 'poi_metro_hospital',
          name: 'City Central Medical Center',
          category: 'HOSPITAL',
          position: new THREE.Vector3(-220, 0, -180),
          rotationY: -Math.PI / 2,
          district: 'DOWNTOWN',
          description: 'Emergency route corridor with high-priority medical logistics delivery contracts.',
          rewardMultiplier: 1.4,
          icon: '🏥',
        },
        {
          id: 'poi_metro_police',
          name: 'Metropolitan Police HQ',
          category: 'POLICE_STATION',
          position: new THREE.Vector3(-150, 0, 240),
          rotationY: Math.PI,
          district: 'DOWNTOWN',
          description: 'Department headquarters with traffic division patrols and vehicle registration dispatch.',
          rewardMultiplier: 1.0,
          icon: '🚓',
        },
      ],
      roadTypes: ['AVENUE', 'BOULEVARD', 'STREET'],
    };

    // 2. HARBOR & SHIPPING PORT (East Water Pier)
    const harbor: DistrictDefinition = {
      id: 'HARBOR',
      name: 'Ocean Gateway Commercial Port',
      tagline: 'Deepwater container terminal, heavy freight docks, container cranes, and cargo warehouses.',
      bounds: {
        minX: 500,
        maxX: 1600,
        minZ: -400,
        maxZ: 700,
        center: new THREE.Vector2(1050, 150),
        radius: 750,
      },
      environment: {
        ambientColor: 0x1d304a,
        ambientIntensity: 0.9,
        fogColor: 0x142033,
        fogDensity: 0.0028,
        sunIntensity: 1.15,
        sunColor: 0xfff0dd,
        groundBaseColor: 0x1a1e24,
        groundGripMultiplier: 0.94,
        baseSpeedLimitKmH: 50,
        trafficDensityMultiplier: 0.9,
        pedestrianDensityMultiplier: 0.3,
        heavyTruckAllowed: true,
        busRoutesActive: true,
        architecturalStyle: 'PORT_CONTAINERS',
      },
      landmarks: [
        {
          id: 'poi_container_terminal_4',
          name: 'Container Terminal 4 - Heavy Berth',
          category: 'PORT',
          position: new THREE.Vector3(850, 0, 200),
          rotationY: 0,
          district: 'HARBOR',
          description: 'Massive gantry crane terminal with intermodal container freight distribution contracts.',
          rewardMultiplier: 1.5,
          icon: '🚢',
        },
        {
          id: 'poi_harbor_gas',
          name: 'Portside Marine & Diesel Station',
          category: 'GAS_STATION',
          position: new THREE.Vector3(620, 0, -80),
          rotationY: Math.PI / 4,
          district: 'HARBOR',
          description: 'High-flow heavy diesel pumps, truck wash, and 24/7 rest stop for haulers.',
          rewardMultiplier: 1.0,
          icon: '⛽',
        },
      ],
      roadTypes: ['BOULEVARD', 'STREET', 'EXPRESSWAY'],
    };

    // 3. INDUSTRIAL MANUFACTURING ZONE (South-East Logistics District)
    const industrial: DistrictDefinition = {
      id: 'INDUSTRIAL',
      name: 'Ironstone Heavy Industrial Park',
      tagline: 'Refineries, machine tooling plants, assembly hubs, and logistics freight corridors.',
      bounds: {
        minX: 400,
        maxX: 1500,
        minZ: 700,
        maxZ: 1800,
        center: new THREE.Vector2(950, 1250),
        radius: 800,
      },
      environment: {
        ambientColor: 0x2a251e,
        ambientIntensity: 0.75,
        fogColor: 0x221d17,
        fogDensity: 0.0035,
        sunIntensity: 1.0,
        sunColor: 0xffe2b8,
        groundBaseColor: 0x1e1c1a,
        groundGripMultiplier: 0.91,
        baseSpeedLimitKmH: 50,
        trafficDensityMultiplier: 0.85,
        pedestrianDensityMultiplier: 0.2,
        heavyTruckAllowed: true,
        busRoutesActive: true,
        architecturalStyle: 'INDUSTRIAL_WAREHOUSES',
      },
      landmarks: [
        {
          id: 'poi_titan_logistics',
          name: 'Titan Global Freight Hub',
          category: 'WAREHOUSE',
          position: new THREE.Vector3(820, 0, 1100),
          rotationY: 0,
          district: 'INDUSTRIAL',
          description: 'Multi-bay automated warehouse sorting center with cross-country cargo dispatches.',
          rewardMultiplier: 1.6,
          icon: '🏭',
        },
      ],
      roadTypes: ['BOULEVARD', 'STREET'],
    };

    // 4. SUBURBAN RESIDENTIAL HILLS (West Neighborhoods)
    const suburbs: DistrictDefinition = {
      id: 'SUBURBS',
      name: 'Pinecrest Suburban Hills',
      tagline: 'Peaceful residential avenues, modern villas, tree-lined cul-de-sacs, and local schools.',
      bounds: {
        minX: -1600,
        maxX: -500,
        minZ: -600,
        maxZ: 600,
        center: new THREE.Vector2(-1050, 0),
        radius: 750,
      },
      environment: {
        ambientColor: 0x243b2f,
        ambientIntensity: 0.9,
        fogColor: 0x13261c,
        fogDensity: 0.0014,
        sunIntensity: 1.25,
        sunColor: 0xfffae8,
        groundBaseColor: 0x172419,
        groundGripMultiplier: 1.02,
        baseSpeedLimitKmH: 45,
        trafficDensityMultiplier: 0.65,
        pedestrianDensityMultiplier: 0.8,
        heavyTruckAllowed: false,
        busRoutesActive: true,
        architecturalStyle: 'RESIDENTIAL_SUBURBAN',
      },
      landmarks: [
        {
          id: 'poi_pinecrest_market',
          name: 'GreenValley Shopping Mall & Market',
          category: 'BANK',
          position: new THREE.Vector3(-850, 0, 40),
          rotationY: Math.PI / 3,
          district: 'SUBURBS',
          description: 'Suburban retail hub with high-demand grocery delivery and rideshare contracts.',
          rewardMultiplier: 1.15,
          icon: '🛍️',
        },
      ],
      roadTypes: ['STREET', 'BOULEVARD'],
    };

    // 5. METRO INTERNATIONAL AIRPORT (South-West Transit Hub)
    const airport: DistrictDefinition = {
      id: 'AIRPORT',
      name: 'Metro International Skyport',
      tagline: 'Main international terminal, flight concourses, express highway drop-offs, and cargo hangars.',
      bounds: {
        minX: -400,
        maxX: 600,
        minZ: 700,
        maxZ: 1900,
        center: new THREE.Vector2(100, 1300),
        radius: 800,
      },
      environment: {
        ambientColor: 0x1c2b42,
        ambientIntensity: 0.92,
        fogColor: 0x0f1b2b,
        fogDensity: 0.0012,
        sunIntensity: 1.3,
        sunColor: 0xffffff,
        groundBaseColor: 0x191e28,
        groundGripMultiplier: 1.05,
        baseSpeedLimitKmH: 80,
        trafficDensityMultiplier: 1.1,
        pedestrianDensityMultiplier: 1.2,
        heavyTruckAllowed: true,
        busRoutesActive: true,
        architecturalStyle: 'AIRPORT_TERMINAL',
      },
      landmarks: [
        {
          id: 'poi_airport_terminal_1',
          name: 'Terminal 1 VIP International Concourse',
          category: 'AIRPORT',
          position: new THREE.Vector3(300, 0, 1100),
          rotationY: 0,
          district: 'AIRPORT',
          description: 'High-profile luxury VIP transfer hub offering premier Airport Taxi payouts.',
          rewardMultiplier: 1.75,
          icon: '✈️',
        },
      ],
      roadTypes: ['EXPRESSWAY', 'AVENUE', 'BOULEVARD'],
    };

    // 6. HIGHWAY EXPRESSWAY NETWORK (Circumferential Ring Road)
    const highway: DistrictDefinition = {
      id: 'HIGHWAY',
      name: 'Grand Metro Ringway & Expressway Loop',
      tagline: 'High-speed 6-lane elevated expressway with multi-tier interchanges and long high-speed curves.',
      bounds: {
        minX: -1800,
        maxX: 1800,
        minZ: -1200,
        maxZ: 2000,
        center: new THREE.Vector2(0, 400),
        radius: 2200,
      },
      environment: {
        ambientColor: 0x223042,
        ambientIntensity: 0.88,
        fogColor: 0x111b2b,
        fogDensity: 0.0010,
        sunIntensity: 1.35,
        sunColor: 0xfffcf0,
        groundBaseColor: 0x12161f,
        groundGripMultiplier: 1.08,
        baseSpeedLimitKmH: 120,
        trafficDensityMultiplier: 1.2,
        pedestrianDensityMultiplier: 0.0,
        heavyTruckAllowed: true,
        busRoutesActive: true,
        architecturalStyle: 'HIGHWAY_BARRIERS',
      },
      landmarks: [
        {
          id: 'poi_highway_oasis',
          name: 'Apex Highway Oasis & Travel Plaza',
          category: 'GAS_STATION',
          position: new THREE.Vector3(0, 0, -600),
          rotationY: 0,
          district: 'HIGHWAY',
          description: 'Major expressway rest stop featuring ultra-fast EV superchargers and 100-octane fuel.',
          rewardMultiplier: 1.1,
          icon: '⚡',
        },
      ],
      roadTypes: ['EXPRESSWAY'],
    };

    // 7. MOUNTAIN PASS & CANYON SWITCHBACKS (North High Elevation Pass)
    const mountainPass: DistrictDefinition = {
      id: 'MOUNTAIN_PASS',
      name: 'Skyline Canyon Mountain Pass',
      tagline: 'Challenging high-elevation hairpin turns, rock tunnels, steep gradient slopes, and vista lookouts.',
      bounds: {
        minX: -1500,
        maxX: 1500,
        minZ: -2000,
        maxZ: -600,
        center: new THREE.Vector2(0, -1300),
        radius: 1100,
      },
      environment: {
        ambientColor: 0x2e3540,
        ambientIntensity: 0.95,
        fogColor: 0x1b232e,
        fogDensity: 0.0022,
        sunIntensity: 1.4,
        sunColor: 0xffede0,
        groundBaseColor: 0x242220,
        groundGripMultiplier: 0.98,
        baseSpeedLimitKmH: 70,
        trafficDensityMultiplier: 0.45,
        pedestrianDensityMultiplier: 0.05,
        heavyTruckAllowed: false,
        busRoutesActive: false,
        architecturalStyle: 'CANYON_ROCKS',
      },
      landmarks: [
        {
          id: 'poi_canyon_lookout',
          name: 'Eagle Peak Scenic Vista Summit',
          category: 'SCENIC_VIEW',
          position: new THREE.Vector3(200, 45, -1450),
          rotationY: Math.PI / 6,
          district: 'MOUNTAIN_PASS',
          description: 'Highest elevation overlook overlooking the entire metropolis. Host of mountain drift trials.',
          rewardMultiplier: 2.0,
          icon: '🏔️',
        },
        {
          id: 'poi_canyon_circuit',
          name: 'Apex Canyon Touge Time-Attack Gate',
          category: 'RACING_CIRCUIT',
          position: new THREE.Vector3(-350, 30, -1200),
          rotationY: -Math.PI / 4,
          district: 'MOUNTAIN_PASS',
          description: 'Official timing gate for the legal downhill and uphill mountain touge time attack.',
          rewardMultiplier: 2.2,
          icon: '🏁',
        },
      ],
      roadTypes: ['MOUNTAIN_ROAD', 'STREET'],
    };

    // Register into Map
    this.districts.set('DOWNTOWN', downtown);
    this.districts.set('HARBOR', harbor);
    this.districts.set('INDUSTRIAL', industrial);
    this.districts.set('SUBURBS', suburbs);
    this.districts.set('AIRPORT', airport);
    this.districts.set('HIGHWAY', highway);
    this.districts.set('MOUNTAIN_PASS', mountainPass);

    // Aggregate POIs
    this.allLandmarks = [];
    this.districts.forEach(d => {
      this.allLandmarks.push(...d.landmarks);
    });
  }

  public getDistrict(type: DistrictType): DistrictDefinition | undefined {
    return this.districts.get(type);
  }

  public getAllDistricts(): DistrictDefinition[] {
    return Array.from(this.districts.values());
  }

  public getAllLandmarks(): LandmarkPOI[] {
    return this.allLandmarks;
  }

  public getLandmarkById(id: string): LandmarkPOI | undefined {
    return this.allLandmarks.find(l => l.id === id);
  }

  /**
   * Identifies which district the given 3D world coordinate (X, Z) belongs to.
   */
  public getDistrictAtPosition(x: number, z: number): DistrictDefinition {
    // 1. Check tight special zones first
    if (z <= -600) {
      return this.districts.get('MOUNTAIN_PASS')!;
    }
    if (z >= 700 && x >= 400) {
      return this.districts.get('INDUSTRIAL')!;
    }
    if (z >= 700 && x < 400 && x > -400) {
      return this.districts.get('AIRPORT')!;
    }
    if (x >= 500 && z < 700) {
      return this.districts.get('HARBOR')!;
    }
    if (x <= -500 && z < 700) {
      return this.districts.get('SUBURBS')!;
    }
    if (Math.abs(x) > 600 || Math.abs(z) > 600) {
      return this.districts.get('HIGHWAY')!;
    }

    // Default to Downtown Center
    return this.districts.get('DOWNTOWN')!;
  }

  /**
   * Smoothly updates environmental atmospheric params in Three.js scene based on player coordinates.
   */
  public updateAtmosphere(
    playerPos: THREE.Vector3, 
    scene: THREE.Scene, 
    sunLight?: THREE.DirectionalLight, 
    ambientLight?: THREE.AmbientLight
  ): DistrictDefinition {
    const targetDistrict = this.getDistrictAtPosition(playerPos.x, playerPos.z);
    
    if (targetDistrict.id !== this.currentDistrict.id) {
      this.currentDistrict = targetDistrict;
    }

    const env = targetDistrict.environment;

    // Smooth fog transition
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.lerp(new THREE.Color(env.fogColor), 0.05);
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, env.fogDensity, 0.05);
    }

    if (ambientLight) {
      ambientLight.color.lerp(new THREE.Color(env.ambientColor), 0.05);
      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, env.ambientIntensity, 0.05);
    }

    if (sunLight) {
      sunLight.color.lerp(new THREE.Color(env.sunColor), 0.05);
      sunLight.intensity = THREE.MathUtils.lerp(sunLight.intensity, env.sunIntensity, 0.05);
    }

    return this.currentDistrict;
  }

  public getCurrentDistrict(): DistrictDefinition {
    return this.currentDistrict;
  }
}

export const districtManager = new DistrictManager();
