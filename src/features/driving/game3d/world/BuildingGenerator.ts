import * as THREE from 'three';
import { DistrictType } from './DistrictManager';

export interface BuildingOptions {
  position: THREE.Vector3;
  width: number;
  depth: number;
  height: number;
  rotationY?: number;
  district: DistrictType;
  hasRooftopAntenna?: boolean;
  hasHelipad?: boolean;
  hasNeonLogo?: boolean;
  neonColor?: number;
}

export class BuildingGenerator {
  private materials: Map<string, THREE.Material> = new Map();
  private sharedGeometries: Map<string, THREE.BufferGeometry> = new Map();

  constructor() {
    this.initMaterials();
  }

  private initMaterials() {
    // 1. Modern Skyscraper Glass & Concrete
    this.materials.set('skyscraper_glass', new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1.2,
    }));

    this.materials.set('skyscraper_spandrel', new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.6,
    }));

    // 2. Industrial Corrugated Steel & Brick
    this.materials.set('industrial_steel', new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.7,
      metalness: 0.5,
    }));

    this.materials.set('industrial_rust', new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      roughness: 0.9,
      metalness: 0.1,
    }));

    // 3. Port Shipping Containers
    this.materials.set('container_blue', new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5, metalness: 0.3 }));
    this.materials.set('container_orange', new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5, metalness: 0.3 }));
    this.materials.set('container_green', new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5, metalness: 0.3 }));
    this.materials.set('container_red', new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5, metalness: 0.3 }));

    // 4. Suburban House Materials
    this.materials.set('suburban_wall', new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 }));
    this.materials.set('suburban_roof', new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 }));
    this.materials.set('suburban_wood', new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 }));

    // 5. Airport Materials
    this.materials.set('airport_white', new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.7 }));
    this.materials.set('airport_cyan_glass', new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8, opacity: 0.85, transparent: true }));

    // 6. Mountain Canyon Rocks
    this.materials.set('canyon_rock_dark', new THREE.MeshStandardMaterial({ color: 0x382f2d, roughness: 0.95 }));
    this.materials.set('canyon_rock_red', new THREE.MeshStandardMaterial({ color: 0x5a3d31, roughness: 0.92 }));
  }

  /**
   * Generates a modern commercial skyscraper with tiered architecture, neon rooftop, and entrance.
   */
  public createCommercialSkyscraper(opts: BuildingOptions): THREE.Group {
    const building = new THREE.Group();
    building.position.copy(opts.position);
    if (opts.rotationY) building.rotation.y = opts.rotationY;

    const w = opts.width;
    const d = opts.depth;
    const h = opts.height;

    // 1. Base Lobby Tier (Height: 6m)
    const lobbyHeight = 6;
    const lobbyGeom = new THREE.BoxGeometry(w + 2, lobbyHeight, d + 2);
    const lobby = new THREE.Mesh(lobbyGeom, this.materials.get('skyscraper_spandrel')!);
    lobby.position.y = lobbyHeight / 2;
    lobby.castShadow = true;
    lobby.receiveShadow = true;
    building.add(lobby);

    // 2. Main Tower Shaft
    const towerHeight = h - lobbyHeight - 4;
    const towerGeom = new THREE.BoxGeometry(w, towerHeight, d);
    const tower = new THREE.Mesh(towerGeom, this.materials.get('skyscraper_glass')!);
    tower.position.y = lobbyHeight + towerHeight / 2;
    tower.castShadow = true;
    tower.receiveShadow = true;
    building.add(tower);

    // Window Horizontal Floor Slits
    const floorCount = Math.floor(towerHeight / 4);
    const floorSlabGeom = new THREE.BoxGeometry(w + 0.3, 0.4, d + 0.3);
    const slabMat = this.materials.get('skyscraper_spandrel')!;
    
    for (let f = 1; f < floorCount; f++) {
      const slab = new THREE.Mesh(floorSlabGeom, slabMat);
      slab.position.y = lobbyHeight + f * 4;
      building.add(slab);
    }

    // 3. Rooftop Tier & Mech Penthouse
    const roofHeight = 4;
    const roofGeom = new THREE.BoxGeometry(w * 0.7, roofHeight, d * 0.7);
    const roof = new THREE.Mesh(roofGeom, this.materials.get('skyscraper_spandrel')!);
    roof.position.y = h - roofHeight / 2;
    building.add(roof);

    // 4. Rooftop Antenna
    if (opts.hasRooftopAntenna) {
      const antennaHeight = 16;
      const antennaGeom = new THREE.CylinderGeometry(0.15, 0.4, antennaHeight, 8);
      const antennaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      const antenna = new THREE.Mesh(antennaGeom, antennaMat);
      antenna.position.set(0, h + antennaHeight / 2, 0);
      building.add(antenna);

      // Blinking red aviation beacon on top
      const beaconLight = new THREE.PointLight(0xff0000, 2, 20);
      beaconLight.position.set(0, h + antennaHeight, 0);
      building.add(beaconLight);
    }

    // 5. Neon Corporate Logo on Upper Facade
    if (opts.hasNeonLogo) {
      const neonColor = opts.neonColor || 0x38bdf8;
      const logoGeom = new THREE.BoxGeometry(w * 0.5, 3, 0.4);
      const logoMat = new THREE.MeshBasicMaterial({ color: neonColor });
      const logoFront = new THREE.Mesh(logoGeom, logoMat);
      logoFront.position.set(0, h - 8, d / 2 + 0.25);
      building.add(logoFront);

      const logoGlow = new THREE.PointLight(neonColor, 2.5, 25);
      logoGlow.position.set(0, h - 8, d / 2 + 2);
      building.add(logoGlow);
    }

    return building;
  }

  /**
   * Generates a modern Airport Terminal with curved glass concourse and control tower.
   */
  public createAirportTerminal(pos: THREE.Vector3): THREE.Group {
    const airport = new THREE.Group();
    airport.position.copy(pos);

    // 1. Main Terminal Concourse (Width: 120m, Depth: 50m, Height: 18m)
    const concourseGeom = new THREE.BoxGeometry(120, 18, 50);
    const concourse = new THREE.Mesh(concourseGeom, this.materials.get('airport_white')!);
    concourse.position.y = 9;
    concourse.castShadow = true;
    concourse.receiveShadow = true;
    airport.add(concourse);

    // Front Glass Wall
    const glassGeom = new THREE.PlaneGeometry(110, 12);
    const glass = new THREE.Mesh(glassGeom, this.materials.get('airport_cyan_glass')!);
    glass.position.set(0, 8, 25.1);
    airport.add(glass);

    // Curved Roof Canopy
    const canopyGeom = new THREE.CylinderGeometry(65, 65, 124, 16, 1, false, 0, Math.PI);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
    const canopy = new THREE.Mesh(canopyGeom, canopyMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.position.set(0, 18, 0);
    airport.add(canopy);

    // 2. Air Traffic Control Tower (Height: 55m)
    const towerShaftGeom = new THREE.CylinderGeometry(3.5, 5.5, 45, 12);
    const towerShaft = new THREE.Mesh(towerShaftGeom, this.materials.get('airport_white')!);
    towerShaft.position.set(50, 22.5, -35);
    airport.add(towerShaft);

    // Tower Cab Glass Observation Deck
    const cabGeom = new THREE.CylinderGeometry(7, 5, 8, 12);
    const cab = new THREE.Mesh(cabGeom, this.materials.get('airport_cyan_glass')!);
    cab.position.set(50, 48, -35);
    airport.add(cab);

    // Radar Dome
    const domeGeom = new THREE.SphereGeometry(3.5, 12, 12);
    const dome = new THREE.Mesh(domeGeom, this.materials.get('airport_white')!);
    dome.position.set(50, 54, -35);
    airport.add(dome);

    // Rotating Radar Bar
    const radarBarGeom = new THREE.BoxGeometry(7, 0.4, 0.8);
    const radarBarMat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const radarBar = new THREE.Mesh(radarBarGeom, radarBarMat);
    radarBar.position.set(50, 58, -35);
    airport.add(radarBar);

    return airport;
  }

  /**
   * Generates a port shipping container stack.
   */
  public createContainerStack(pos: THREE.Vector3): THREE.Group {
    const stack = new THREE.Group();
    stack.position.copy(pos);

    const colors = ['container_blue', 'container_orange', 'container_green', 'container_red'];
    const cWidth = 3.0;
    const cHeight = 2.8;
    const cLength = 12.0;

    const containerGeom = new THREE.BoxGeometry(cWidth, cHeight, cLength);

    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 3; y++) {
        const matKey = colors[(x + y) % colors.length];
        const container = new THREE.Mesh(containerGeom, this.materials.get(matKey)!);
        container.position.set(x * (cWidth + 0.4) - 1.7, y * (cHeight + 0.1) + cHeight / 2, 0);
        container.castShadow = true;
        container.receiveShadow = true;
        stack.add(container);
      }
    }

    return stack;
  }

  /**
   * Generates an industrial logistics warehouse with loading docks.
   */
  public createIndustrialWarehouse(pos: THREE.Vector3, w = 45, d = 35, h = 12): THREE.Group {
    const warehouse = new THREE.Group();
    warehouse.position.copy(pos);

    // Main Structure
    const geom = new THREE.BoxGeometry(w, h, d);
    const main = new THREE.Mesh(geom, this.materials.get('industrial_steel')!);
    main.position.y = h / 2;
    main.castShadow = true;
    main.receiveShadow = true;
    warehouse.add(main);

    // Loading Dock Rollup Doors (4 doors)
    const doorGeom = new THREE.BoxGeometry(4, 4.5, 0.2);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });

    for (let i = -1.5; i <= 1.5; i++) {
      const door = new THREE.Mesh(doorGeom, doorMat);
      door.position.set(i * 7, 2.25, d / 2 + 0.15);
      warehouse.add(door);
    }

    return warehouse;
  }

  /**
   * Generates a modern suburban residential house with garage and pitched roof.
   */
  public createSuburbanVilla(pos: THREE.Vector3, rotY = 0): THREE.Group {
    const house = new THREE.Group();
    house.position.copy(pos);
    house.rotation.y = rotY;

    // Main Living Body (Width: 14m, Depth: 10m, Height: 5.5m)
    const bodyGeom = new THREE.BoxGeometry(14, 5.5, 10);
    const body = new THREE.Mesh(bodyGeom, this.materials.get('suburban_wall')!);
    body.position.y = 2.75;
    body.castShadow = true;
    body.receiveShadow = true;
    house.add(body);

    // Pitched Gable Roof
    const roofGeom = new THREE.ConeGeometry(9.5, 3.5, 4);
    const roof = new THREE.Mesh(roofGeom, this.materials.get('suburban_roof')!);
    roof.position.y = 5.5 + 1.75;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.1, 1, 0.8);
    house.add(roof);

    // Attached Garage Box
    const garageGeom = new THREE.BoxGeometry(6, 3.8, 7);
    const garage = new THREE.Mesh(garageGeom, this.materials.get('suburban_wall')!);
    garage.position.set(8.5, 1.9, 1);
    garage.castShadow = true;
    house.add(garage);

    // Garage White Door
    const gDoorGeom = new THREE.BoxGeometry(4.8, 3.0, 0.2);
    const gDoorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const gDoor = new THREE.Mesh(gDoorGeom, gDoorMat);
    gDoor.position.set(8.5, 1.5, 4.6);
    house.add(gDoor);

    return house;
  }

  /**
   * Generates a realistic mountain rock cliff face for the Canyon Pass.
   */
  public createMountainRockCliff(pos: THREE.Vector3, w = 40, h = 30, d = 30): THREE.Group {
    const cliff = new THREE.Group();
    cliff.position.copy(pos);

    const rockGeom = new THREE.DodecahedronGeometry(h * 0.6, 1);
    const rockMat = this.materials.get('canyon_rock_dark')!;
    const rock = new THREE.Mesh(rockGeom, rockMat);
    rock.position.y = h / 2;
    rock.scale.set(w / 20, 1.2, d / 20);
    rock.castShadow = true;
    rock.receiveShadow = true;
    cliff.add(rock);

    return cliff;
  }
}

export const buildingGenerator = new BuildingGenerator();
