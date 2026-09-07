import * as THREE from 'three';
import { districtManager, DistrictDefinition, DistrictType } from './DistrictManager';
import { roadNetworkTopology } from './RoadNetworkTopology';
import { buildingGenerator } from './BuildingGenerator';
import { roadsideProps } from './RoadsideProps';
import { vegetationSystem } from './VegetationSystem';

export class CityGenerator {
  private cityGroup: THREE.Group = new THREE.Group();
  private groundPlane: THREE.Mesh | null = null;
  private isGenerated: boolean = false;

  constructor() {
    this.cityGroup.name = 'RealDrive_Metropolis_World';
  }

  /**
   * Builds the entire RealDrive multi-district procedural 3D world.
   */
  public generateMetropolisWorld(scene: THREE.Scene): THREE.Group {
    if (this.isGenerated) {
      scene.add(this.cityGroup);
      return this.cityGroup;
    }

    this.cityGroup.clear();

    // 1. Massive Terrain Ground Foundation (4000m x 4000m)
    this.createWorldTerrain();

    // 2. Procedural Road Spline Network & Markings
    const roadNetworkMesh = roadNetworkTopology.generateRoadNetworkMeshes();
    this.cityGroup.add(roadNetworkMesh);

    // 3. District-Specific Architecture & Infrastructure
    this.generateDowntownDistrict();
    this.generateAirportDistrict();
    this.generateHarborDistrict();
    this.generateIndustrialDistrict();
    this.generateSuburbsDistrict();
    this.generateCanyonMountainDistrict();
    this.generateExpresswayInfrastructure();

    // 4. Roadside Street Furniture & Lighting
    this.generateRoadsideStreetlightsAndSigns();

    // 5. Environmental Landscaping & Foliage
    this.generateWorldVegetation();

    scene.add(this.cityGroup);
    this.isGenerated = true;
    return this.cityGroup;
  }

  private createWorldTerrain() {
    const terrainGeom = new THREE.PlaneGeometry(4500, 4500, 64, 64);
    terrainGeom.rotateX(-Math.PI / 2);

    // Terrain material with subtle asphalt/grass blend
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0c1017,
      roughness: 0.95,
      metalness: 0.05,
    });

    this.groundPlane = new THREE.Mesh(terrainGeom, terrainMat);
    this.groundPlane.position.y = -0.05;
    this.groundPlane.receiveShadow = true;
    this.cityGroup.add(this.groundPlane);
  }

  /**
   * 1. DOWNTOWN FINANCIAL DISTRICT: High-rise commercial towers and banking plazas
   */
  private generateDowntownDistrict() {
    const downtownGroup = new THREE.Group();
    downtownGroup.name = 'District_Downtown';

    // Skyscraper Grid Placement along Central Boulevard (Z: -300 to +300, X: -250 to +250)
    const towerConfigs = [
      { x: -55, z: -150, w: 28, d: 28, h: 85, neon: 0x38bdf8 },
      { x: 55, z: -150, w: 32, d: 30, h: 95, neon: 0x60a5fa },
      { x: -60, z: 120, w: 30, d: 30, h: 110, neon: 0x3b82f6 },
      { x: 60, z: 120, w: 34, d: 32, h: 125, neon: 0x0284c7 },
      { x: -140, z: 0, w: 36, d: 36, h: 75, neon: 0x818cf8 },
      { x: 140, z: 0, w: 35, d: 35, h: 88, neon: 0x38bdf8 },
      { x: -160, z: -180, w: 30, d: 30, h: 70 },
      { x: 160, z: -180, w: 28, d: 28, h: 65 },
      { x: -160, z: 180, w: 32, d: 32, h: 80 },
      { x: 160, z: 180, w: 34, d: 34, h: 90 },
      { x: -220, z: -60, w: 30, d: 30, h: 58 },
      { x: 220, z: -60, w: 32, d: 32, h: 62 },
    ];

    towerConfigs.forEach((cfg) => {
      const tower = buildingGenerator.createCommercialSkyscraper({
        position: new THREE.Vector3(cfg.x, 0, cfg.z),
        width: cfg.w,
        depth: cfg.d,
        height: cfg.h,
        district: 'DOWNTOWN',
        hasRooftopAntenna: cfg.h > 80,
        hasNeonLogo: !!cfg.neon,
        neonColor: cfg.neon,
      });
      downtownGroup.add(tower);
    });

    this.cityGroup.add(downtownGroup);
  }

  /**
   * 2. AIRPORT DISTRICT: International Terminal, ATC Tower, and Drop-Off Loop
   */
  private generateAirportDistrict() {
    const airportGroup = new THREE.Group();
    airportGroup.name = 'District_Airport';

    // Terminal Concourse at X: 300, Z: 1100
    const terminal = buildingGenerator.createAirportTerminal(new THREE.Vector3(300, 0, 1100));
    airportGroup.add(terminal);

    // Multi-Level Airport Parking Structure
    const parkingGeom = new THREE.BoxGeometry(70, 14, 50);
    const parkingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const parking = new THREE.Mesh(parkingGeom, parkingMat);
    parking.position.set(180, 7, 1100);
    parking.castShadow = true;
    airportGroup.add(parking);

    this.cityGroup.add(airportGroup);
  }

  /**
   * 3. HARBOR DISTRICT: Shipping Port, Container Cranes, and Stacks
   */
  private generateHarborDistrict() {
    const harborGroup = new THREE.Group();
    harborGroup.name = 'District_Harbor';

    // Container Stacks (X: 800 to 1100, Z: 100 to 400)
    for (let x = 700; x <= 1100; x += 60) {
      for (let z = 100; z <= 350; z += 50) {
        const stack = buildingGenerator.createContainerStack(new THREE.Vector3(x, 0, z));
        harborGroup.add(stack);
      }
    }

    this.cityGroup.add(harborGroup);
  }

  /**
   * 4. INDUSTRIAL DISTRICT: Warehouses, Refineries, and Loading Bays
   */
  private generateIndustrialDistrict() {
    const industrialGroup = new THREE.Group();
    industrialGroup.name = 'District_Industrial';

    const warehouseCoords = [
      { x: 750, z: 1000 },
      { x: 860, z: 1050 },
      { x: 780, z: 1250 },
      { x: 920, z: 1300 },
    ];

    warehouseCoords.forEach((c) => {
      const warehouse = buildingGenerator.createIndustrialWarehouse(new THREE.Vector3(c.x, 0, c.z));
      industrialGroup.add(warehouse);
    });

    this.cityGroup.add(industrialGroup);
  }

  /**
   * 5. SUBURBAN RESIDENTIAL DISTRICT: Villas, Houses, and Driveways
   */
  private generateSuburbsDistrict() {
    const suburbsGroup = new THREE.Group();
    suburbsGroup.name = 'District_Suburbs';

    // Houses along Pinecrest Parkway (X: -600 to -1100, Z: -150 to +150)
    for (let x = -600; x >= -1050; x -= 75) {
      // North side villas
      const houseN = buildingGenerator.createSuburbanVilla(new THREE.Vector3(x, 0, 55), 0);
      suburbsGroup.add(houseN);

      // South side villas
      const houseS = buildingGenerator.createSuburbanVilla(new THREE.Vector3(x, 0, -55), Math.PI);
      suburbsGroup.add(houseS);
    }

    this.cityGroup.add(suburbsGroup);
  }

  /**
   * 6. CANYON MOUNTAIN PASS: Rock Cliff Formations along Switchbacks
   */
  private generateCanyonMountainDistrict() {
    const canyonGroup = new THREE.Group();
    canyonGroup.name = 'District_MountainPass';

    const cliffCoords = [
      { x: -180, z: -650, w: 50, h: 45, d: 50 },
      { x: 190, z: -850, w: 60, h: 55, d: 50 },
      { x: -240, z: -1100, w: 70, h: 65, d: 60 },
      { x: 250, z: -1400, w: 80, h: 75, d: 60 },
      { x: -60, z: -1750, w: 90, h: 85, d: 70 },
    ];

    cliffCoords.forEach((c) => {
      const cliff = buildingGenerator.createMountainRockCliff(new THREE.Vector3(c.x, 0, c.z), c.w, c.h, c.d);
      canyonGroup.add(cliff);
    });

    this.cityGroup.add(canyonGroup);
  }

  /**
   * 7. HIGHWAY EXPRESSWAY INFRASTRUCTURE: Destination Gantries
   */
  private generateExpresswayInfrastructure() {
    const gantryGroup = new THREE.Group();
    gantryGroup.name = 'Highway_Gantries';

    // Overhead Destination Gantry at Airport Highway Fork (Z = 450)
    const airportGantry = roadsideProps.createExpresswayGantry(new THREE.Vector3(40, 0, 480), 22, 0);
    gantryGroup.add(airportGantry);

    this.cityGroup.add(gantryGroup);
  }

  /**
   * Generates roadside streetlights and regulatory traffic speed signs.
   */
  private generateRoadsideStreetlightsAndSigns() {
    const propsGroup = new THREE.Group();
    propsGroup.name = 'Roadside_Streetlights_Signs';

    // Streetlights along Central Boulevard (every 50m from Z: -500 to +1400)
    for (let z = -450; z <= 1350; z += 60) {
      const leftLight = roadsideProps.createStreetLight(new THREE.Vector3(-14, 0, z), 0);
      propsGroup.add(leftLight);

      const rightLight = roadsideProps.createStreetLight(new THREE.Vector3(14, 0, z), Math.PI);
      propsGroup.add(rightLight);
    }

    // Speed limit signs
    const signDowntown = roadsideProps.createSpeedLimitSign(new THREE.Vector3(13, 0, 80), 60, Math.PI);
    propsGroup.add(signDowntown);

    const signHighway = roadsideProps.createSpeedLimitSign(new THREE.Vector3(16, 0, 520), 80, Math.PI);
    propsGroup.add(signHighway);

    this.cityGroup.add(propsGroup);
  }

  /**
   * Generates trees, palms, and vegetation across districts.
   */
  private generateWorldVegetation() {
    const vegGroup = new THREE.Group();
    vegGroup.name = 'World_Vegetation';

    // Downtown Boulevard Palms along sidewalks
    for (let z = -250; z <= 350; z += 40) {
      const palmL = vegetationSystem.createPalmTree(new THREE.Vector3(-18, 0, z));
      vegGroup.add(palmL);

      const palmR = vegetationSystem.createPalmTree(new THREE.Vector3(18, 0, z));
      vegGroup.add(palmR);
    }

    // Mountain Pines in North Canyon (Z: -600 to -1600)
    for (let z = -600; z >= -1600; z -= 50) {
      const pineL = vegetationSystem.createPineTree(new THREE.Vector3(-45, 0, z), 1.2);
      vegGroup.add(pineL);

      const pineR = vegetationSystem.createPineTree(new THREE.Vector3(45, 0, z), 1.3);
      vegGroup.add(pineR);
    }

    // Suburban Oaks (X: -600 to -1000)
    for (let x = -600; x >= -1000; x -= 60) {
      const oak1 = vegetationSystem.createOakTree(new THREE.Vector3(x, 0, 30));
      vegGroup.add(oak1);

      const oak2 = vegetationSystem.createOakTree(new THREE.Vector3(x, 0, -30));
      vegGroup.add(oak2);
    }

    this.cityGroup.add(vegGroup);
  }
}

export const cityGenerator = new CityGenerator();
