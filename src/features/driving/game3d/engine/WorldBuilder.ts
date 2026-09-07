import * as THREE from 'three';
import { RoadSegment, TrafficSignal, Waypoint } from '../types';

export interface WorldBundle {
  scene: THREE.Scene;
  roadSegments: RoadSegment[];
  trafficSignals: TrafficSignal[];
  waypoints: Waypoint[];
  destinationBeacon: THREE.Group;
  collidableMeshes: THREE.Box3[];
}

export class WorldBuilder {
  private static asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x22252a,
    roughness: 0.85,
    metalness: 0.1,
  });

  private static sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x8d99ae,
    roughness: 0.9,
  });

  private static curbMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.7,
  });

  private static yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xffb703 });
  private static whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  private static grassMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.9 });
  private static signalHousingMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });

  /**
   * Generates a fully playable 3D city road world
   */
  public static buildCityWorld(scene: THREE.Scene): WorldBundle {
    const roadSegments: RoadSegment[] = [];
    const trafficSignals: TrafficSignal[] = [];
    const collidableMeshes: THREE.Box3[] = [];

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(2000, 2000);
    const ground = new THREE.Mesh(groundGeo, this.grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // ==========================================
    // 1. MAIN METRO BOULEVARD (North-South, Z: -150 to 1200)
    // 4 Lanes total (2 Forward + 2 Opposite) = 15m wide
    // ==========================================
    this.createTwoWayRoadSegment(
      scene,
      roadSegments,
      new THREE.Vector3(0, 0, -150),
      new THREE.Vector3(0, 0, 1200),
      16,
      'Metro Parkway',
      70
    );

    // ==========================================
    // 2. CROSS AVENUE 1 (East-West, Z = 300, X: -300 to 300)
    // ==========================================
    this.createTwoWayRoadSegment(
      scene,
      roadSegments,
      new THREE.Vector3(-300, 0, 300),
      new THREE.Vector3(300, 0, 300),
      14,
      'Grand Avenue',
      60
    );

    // ==========================================
    // 3. CROSS AVENUE 2 - AIRPORT CONNECTOR (East-West, Z = 800, X: -400 to 400)
    // ==========================================
    this.createTwoWayRoadSegment(
      scene,
      roadSegments,
      new THREE.Vector3(-400, 0, 800),
      new THREE.Vector3(400, 0, 800),
      16,
      'Airport Highway',
      80
    );

    // ==========================================
    // 4. AIRPORT TERMINAL ROAD (North, Z = 800 to 1100 at X = 300)
    // ==========================================
    this.createTwoWayRoadSegment(
      scene,
      roadSegments,
      new THREE.Vector3(300, 0, 800),
      new THREE.Vector3(300, 0, 1150),
      14,
      'Terminal Way',
      50
    );

    // ==========================================
    // 5. 3D TRAFFIC SIGNALS AT INTERSECTIONS
    // ==========================================
    // Intersection 1: (0, 0, 300) Metro Parkway & Grand Ave
    const sig1 = this.createTrafficSignalGantry(scene, new THREE.Vector3(0, 0, 300), 0);
    trafficSignals.push(sig1);

    // Intersection 2: (0, 0, 800) Metro Parkway & Airport Hwy
    const sig2 = this.createTrafficSignalGantry(scene, new THREE.Vector3(0, 0, 800), 0);
    trafficSignals.push(sig2);

    // Intersection 3: (300, 0, 800) Airport Hwy & Terminal Way
    const sig3 = this.createTrafficSignalGantry(scene, new THREE.Vector3(300, 0, 800), Math.PI / 2);
    trafficSignals.push(sig3);

    // ==========================================
    // 6. BUILDINGS & CITY SKYLINE
    // ==========================================
    this.buildCityBlocks(scene, collidableMeshes);

    // ==========================================
    // 7. STREETLIGHTS & TREES
    // ==========================================
    this.buildStreetFurniture(scene);

    // ==========================================
    // 8. DESTINATION BEACON (Airport Terminal at X: 300, Z: 1100)
    // ==========================================
    const destinationBeacon = this.createDestinationBeacon(scene, new THREE.Vector3(300, 0, 1100));

    // Define Waypoints for GPS
    const waypoints: Waypoint[] = [
      { position: new THREE.Vector3(0, 0, 0), name: 'City Center Start' },
      { position: new THREE.Vector3(0, 0, 300), name: 'Grand Ave Intersection' },
      { position: new THREE.Vector3(0, 0, 800), name: 'Airport Highway Junction' },
      { position: new THREE.Vector3(300, 0, 800), name: 'Terminal Way Turn' },
      { position: new THREE.Vector3(300, 0, 1100), name: 'Airport International Terminal', isDestination: true },
    ];

    return {
      scene,
      roadSegments,
      trafficSignals,
      waypoints,
      destinationBeacon,
      collidableMeshes
    };
  }

  /**
   * Builds a two-way multi-lane asphalt road with markings, curbs and sidewalks
   */
  private static createTwoWayRoadSegment(
    scene: THREE.Scene,
    segments: RoadSegment[],
    start: THREE.Vector3,
    end: THREE.Vector3,
    width: number,
    name: string,
    speedLimit: number
  ) {
    const dir = new THREE.Vector3().subVectors(end, start);
    const length = dir.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const angle = Math.atan2(dir.x, dir.z);

    const roadGroup = new THREE.Group();
    roadGroup.position.copy(mid);
    roadGroup.rotation.y = angle;

    // 1. Asphalt Road Surface
    const asphaltGeo = new THREE.PlaneGeometry(width, length);
    const asphalt = new THREE.Mesh(asphaltGeo, this.asphaltMat);
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.y = 0.01;
    asphalt.receiveShadow = true;
    roadGroup.add(asphalt);

    // 2. Double-Yellow Median Line (Opposite traffic divider at X = 0)
    const yellowLineGeo = new THREE.PlaneGeometry(0.18, length);
    const yl1 = new THREE.Mesh(yellowLineGeo, this.yellowLineMat);
    yl1.rotation.x = -Math.PI / 2;
    yl1.position.set(-0.15, 0.02, 0);
    roadGroup.add(yl1);

    const yl2 = new THREE.Mesh(yellowLineGeo, this.yellowLineMat);
    yl2.rotation.x = -Math.PI / 2;
    yl2.position.set(0.15, 0.02, 0);
    roadGroup.add(yl2);

    // 3. White Dashed Lane Dividers (Separating lanes in each direction)
    const dashLength = 3.5;
    const dashGap = 5.0;
    const numDashes = Math.floor(length / (dashLength + dashGap));

    [-width / 4, width / 4].forEach((laneOffset) => {
      for (let i = 0; i < numDashes; i++) {
        const dashGeo = new THREE.PlaneGeometry(0.15, dashLength);
        const dash = new THREE.Mesh(dashGeo, this.whiteLineMat);
        dash.rotation.x = -Math.PI / 2;
        const zPos = -length / 2 + i * (dashLength + dashGap) + dashLength / 2;
        dash.position.set(laneOffset, 0.02, zPos);
        roadGroup.add(dash);
      }
    });

    // 4. White Solid Shoulder Edge Lines
    [-width / 2 + 0.3, width / 2 - 0.3].forEach((edgeOffset) => {
      const edgeGeo = new THREE.PlaneGeometry(0.18, length);
      const edge = new THREE.Mesh(edgeGeo, this.whiteLineMat);
      edge.rotation.x = -Math.PI / 2;
      edge.position.set(edgeOffset, 0.02, 0);
      roadGroup.add(edge);
    });

    // 5. Curbs & Sidewalks on both sides
    const sidewalkWidth = 3.5;
    const sidewalkGeo = new THREE.BoxGeometry(sidewalkWidth, 0.2, length);

    // Left Sidewalk
    const leftSidewalk = new THREE.Mesh(sidewalkGeo, this.sidewalkMat);
    leftSidewalk.position.set(-width / 2 - sidewalkWidth / 2, 0.1, 0);
    leftSidewalk.receiveShadow = true;
    roadGroup.add(leftSidewalk);

    // Right Sidewalk
    const rightSidewalk = new THREE.Mesh(sidewalkGeo, this.sidewalkMat);
    rightSidewalk.position.set(width / 2 + sidewalkWidth / 2, 0.1, 0);
    rightSidewalk.receiveShadow = true;
    roadGroup.add(rightSidewalk);

    scene.add(roadGroup);

    segments.push({
      id: Math.random().toString(36).substring(2, 9),
      name,
      start,
      end,
      width,
      lanesForward: 2,
      lanesOpposite: 2,
      speedLimit,
    });
  }

  /**
   * Creates an overhead 3D traffic signal gantry with cycled Red, Yellow, and Green lights
   */
  private static createTrafficSignalGantry(scene: THREE.Scene, pos: THREE.Vector3, rotY: number): TrafficSignal {
    const poleGroup = new THREE.Group();
    poleGroup.position.copy(pos);
    poleGroup.rotation.y = rotY;

    // Vertical steel pole
    const vertPoleGeo = new THREE.CylinderGeometry(0.15, 0.15, 6.5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    const vertPole = new THREE.Mesh(vertPoleGeo, poleMat);
    vertPole.position.set(-9.5, 3.25, 0);
    poleGroup.add(vertPole);

    // Horizontal gantry arm
    const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 19);
    armGeo.rotateZ(Math.PI / 2);
    const horizArm = new THREE.Mesh(armGeo, poleMat);
    horizArm.position.set(0, 6.2, 0);
    poleGroup.add(horizArm);

    // Signal Housing Box
    const housingGeo = new THREE.BoxGeometry(0.6, 1.6, 0.4);
    const housing = new THREE.Mesh(housingGeo, this.signalHousingMat);
    housing.position.set(-3.5, 5.2, 0);
    poleGroup.add(housing);

    // 3 Lights: Red (top), Yellow (mid), Green (bottom)
    const lightGeo = new THREE.SphereGeometry(0.18, 16, 16);

    const redMat = new THREE.MeshBasicMaterial({ color: 0xff1100 });
    const redLight = new THREE.Mesh(lightGeo, redMat);
    redLight.position.set(-3.5, 5.65, 0.22);
    poleGroup.add(redLight);

    const yellowMat = new THREE.MeshBasicMaterial({ color: 0x443300 }); // off initially
    const yellowLight = new THREE.Mesh(lightGeo, yellowMat);
    yellowLight.position.set(-3.5, 5.2, 0.22);
    poleGroup.add(yellowLight);

    const greenMat = new THREE.MeshBasicMaterial({ color: 0x004411 }); // off initially
    const greenLight = new THREE.Mesh(lightGeo, greenMat);
    greenLight.position.set(-3.5, 4.75, 0.22);
    poleGroup.add(greenLight);

    scene.add(poleGroup);

    return {
      id: Math.random().toString(36).substring(2, 9),
      position: pos,
      heading: rotY,
      state: 'green',
      timer: 0,
      greenDuration: 12.0,
      yellowDuration: 3.0,
      redDuration: 10.0,
      poleGroup,
      redLightMesh: redLight,
      yellowLightMesh: yellowLight,
      greenLightMesh: greenLight,
    };
  }

  /**
   * Builds dense 3D city buildings alongside the road corridors
   */
  private static buildCityBlocks(scene: THREE.Scene, collidables: THREE.Box3[]) {
    const buildingColors = [0x1e293b, 0x0f172a, 0x334155, 0x1f2937, 0x27272a, 0x18181b];
    const glassColors = [0x38bdf8, 0x0284c7, 0x0ea5e9, 0x64748b];

    // Grid of buildings along Metro Parkway (Z: -100 to 1100, X: +/- 25m to 120m)
    for (let z = -100; z <= 1100; z += 65) {
      // Don't build in intersections
      if ((z >= 260 && z <= 340) || (z >= 760 && z <= 840)) continue;

      // Left Side Buildings (X < 0)
      const leftX = -(24 + Math.random() * 15);
      const widthL = 22 + Math.random() * 15;
      const depthL = 35 + Math.random() * 20;
      const heightL = 30 + Math.random() * 70;

      const bColorL = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const bMatL = new THREE.MeshStandardMaterial({ color: bColorL, roughness: 0.3, metalness: 0.7 });
      const bGeoL = new THREE.BoxGeometry(widthL, heightL, depthL);
      const buildingL = new THREE.Mesh(bGeoL, bMatL);
      buildingL.position.set(leftX - widthL / 2, heightL / 2, z);
      buildingL.castShadow = true;
      buildingL.receiveShadow = true;
      scene.add(buildingL);

      // Window grid rows
      this.addWindowGlowPanels(buildingL, widthL, heightL, depthL, glassColors);

      const boxL = new THREE.Box3().setFromObject(buildingL);
      collidables.push(boxL);

      // Right Side Buildings (X > 0)
      const rightX = 24 + Math.random() * 15;
      const widthR = 22 + Math.random() * 15;
      const depthR = 35 + Math.random() * 20;
      const heightR = 25 + Math.random() * 85;

      const bColorR = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const bMatR = new THREE.MeshStandardMaterial({ color: bColorR, roughness: 0.3, metalness: 0.7 });
      const bGeoR = new THREE.BoxGeometry(widthR, heightR, depthR);
      const buildingR = new THREE.Mesh(bGeoR, bMatR);
      buildingR.position.set(rightX + widthR / 2, heightR / 2, z);
      buildingR.castShadow = true;
      buildingR.receiveShadow = true;
      scene.add(buildingR);

      this.addWindowGlowPanels(buildingR, widthR, heightR, depthR, glassColors);

      const boxR = new THREE.Box3().setFromObject(buildingR);
      collidables.push(boxR);
    }
  }

  private static addWindowGlowPanels(
    building: THREE.Mesh,
    w: number,
    h: number,
    d: number,
    colors: number[]
  ) {
    const numRows = Math.floor(h / 6);
    const windowMat = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    for (let r = 1; r < numRows; r++) {
      const windowStrip = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.85, 1.8),
        windowMat
      );
      windowStrip.position.set(0, -h / 2 + r * 6, d / 2 + 0.05);
      building.add(windowStrip);
    }
  }

  /**
   * Adds streetlights with light cones and lush trees along sidewalks
   */
  private static buildStreetFurniture(scene: THREE.Scene) {
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.8 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x582f0e, roughness: 0.9 });
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });

    for (let z = -120; z <= 1100; z += 40) {
      if ((z >= 280 && z <= 320) || (z >= 780 && z <= 820)) continue;

      // Streetlights at X = -10 and X = 10
      [-10, 10].forEach((xPos) => {
        const lampGroup = new THREE.Group();
        lampGroup.position.set(xPos, 0, z);

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6.0), lampMat);
        pole.position.y = 3.0;
        lampGroup.add(pole);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.06), lampMat);
        arm.position.set(xPos > 0 ? -0.5 : 0.5, 5.9, 0);
        lampGroup.add(arm);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), bulbMat);
        bulb.position.set(xPos > 0 ? -1.0 : 1.0, 5.8, 0);
        lampGroup.add(bulb);

        // Soft point light down to street
        const pl = new THREE.PointLight(0xfffae0, 25, 20, 1.5);
        pl.position.set(xPos > 0 ? -1.0 : 1.0, 5.6, 0);
        lampGroup.add(pl);

        scene.add(lampGroup);
      });

      // Trees at X = -11.5 and X = 11.5
      [-11.5, 11.5].forEach((xPos) => {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(xPos, 0, z + 20);

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.5), trunkMat);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.4 + Math.random() * 0.4, 8, 8), treeFoliageMat);
        foliage.position.y = 3.2;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        scene.add(treeGroup);
      });
    }
  }

  /**
   * Creates a glowing vertical destination waypoint beacon
   */
  private static createDestinationBeacon(scene: THREE.Scene, pos: THREE.Vector3): THREE.Group {
    const beaconGroup = new THREE.Group();
    beaconGroup.position.copy(pos);

    // Vertical cylinder light column
    const cylinderGeo = new THREE.CylinderGeometry(3.5, 3.5, 80, 24, 1, true);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const cylinder = new THREE.Mesh(cylinderGeo, beaconMat);
    cylinder.position.y = 40;
    beaconGroup.add(cylinder);

    // Glowing ground rings
    const ringGeo = new THREE.RingGeometry(2.5, 3.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    beaconGroup.add(ring);

    // Overhead destination flag icon
    const bannerGeo = new THREE.BoxGeometry(4, 1.8, 0.2);
    const bannerMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.y = 7;
    beaconGroup.add(banner);

    scene.add(beaconGroup);
    return beaconGroup;
  }
}
