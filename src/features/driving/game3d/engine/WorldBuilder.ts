import * as THREE from 'three';
import { RoadSegment, TrafficSignal, Waypoint } from '../types';
import { cityGenerator } from '../world/CityGenerator';
import { districtManager } from '../world/DistrictManager';
import { roadNetworkTopology } from '../world/RoadNetworkTopology';

export interface WorldBundle {
  scene: THREE.Scene;
  roadSegments: RoadSegment[];
  trafficSignals: TrafficSignal[];
  waypoints: Waypoint[];
  destinationBeacon: THREE.Group;
  collidableMeshes: THREE.Box3[];
}

export class WorldBuilder {
  private static signalHousingMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });

  /**
   * Generates a fully playable 3D city road world with 7 distinct districts
   */
  public static buildCityWorld(scene: THREE.Scene): WorldBundle {
    const roadSegments: RoadSegment[] = [];
    const trafficSignals: TrafficSignal[] = [];
    const collidableMeshes: THREE.Box3[] = [];

    // 1. Generate the Procedural 3D Metropolis City World
    cityGenerator.generateMetropolisWorld(scene);

    // 2. Populate Standard Road Segments for AI Traffic and GPS Navigation
    roadNetworkTopology.getAllSegments().forEach((seg) => {
      roadSegments.push({
        id: seg.id,
        name: seg.name,
        start: seg.points[0],
        end: seg.points[seg.points.length - 1],
        width: seg.totalWidth,
        lanesForward: seg.lanesForward,
        lanesOpposite: seg.lanesOpposite,
        speedLimit: 70,
      });
    });

    // 3. Functional 3D Traffic Signals at Major Intersections
    const sig1 = this.createTrafficSignalGantry(scene, new THREE.Vector3(0, 0, 300), 0);
    trafficSignals.push(sig1);

    const sig2 = this.createTrafficSignalGantry(scene, new THREE.Vector3(0, 0, 800), 0);
    trafficSignals.push(sig2);

    const sig3 = this.createTrafficSignalGantry(scene, new THREE.Vector3(300, 0, 800), Math.PI / 2);
    trafficSignals.push(sig3);

    // 4. Add Collision Bounding Boxes around Major Architecture
    this.registerBuildingCollidables(collidableMeshes);

    // 5. Destination Beacon at Airport VIP Terminal (X: 300, Z: 1100)
    const destinationBeacon = this.createDestinationBeacon(scene, new THREE.Vector3(300, 0, 1100));

    // 6. Navigation Waypoints across Districts
    const waypoints: Waypoint[] = [
      { position: new THREE.Vector3(0, 0, 0), name: 'Downtown Apex Center' },
      { position: new THREE.Vector3(0, 0, 300), name: 'Grand Avenue Interchange' },
      { position: new THREE.Vector3(0, 0, 800), name: 'Airport Highway Junction' },
      { position: new THREE.Vector3(300, 0, 800), name: 'Terminal Way Access' },
      { position: new THREE.Vector3(300, 0, 1100), name: 'Airport VIP International Terminal', isDestination: true },
    ];

    return {
      scene,
      roadSegments,
      trafficSignals,
      waypoints,
      destinationBeacon,
      collidableMeshes,
    };
  }

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

    // 3 Lights: Red, Yellow, Green
    const lightGeo = new THREE.SphereGeometry(0.18, 16, 16);

    const redMat = new THREE.MeshBasicMaterial({ color: 0xff1100 });
    const redLight = new THREE.Mesh(lightGeo, redMat);
    redLight.position.set(-3.5, 5.65, 0.22);
    poleGroup.add(redLight);

    const yellowMat = new THREE.MeshBasicMaterial({ color: 0x443300 });
    const yellowLight = new THREE.Mesh(lightGeo, yellowMat);
    yellowLight.position.set(-3.5, 5.2, 0.22);
    poleGroup.add(yellowLight);

    const greenMat = new THREE.MeshBasicMaterial({ color: 0x004411 });
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

  private static registerBuildingCollidables(collidables: THREE.Box3[]) {
    // Downtown Skyscraper collision boundaries
    const towers = [
      { minX: -85, maxX: -25, minZ: -180, maxZ: -120 },
      { minX: 25, maxX: 85, minZ: -180, maxZ: -120 },
      { minX: -90, maxX: -30, minZ: 90, maxZ: 150 },
      { minX: 30, maxX: 90, minZ: 90, maxZ: 150 },
      { minX: -170, maxX: -110, minZ: -30, maxZ: 30 },
      { minX: 110, maxX: 170, minZ: -30, maxZ: 30 },
      // Airport terminal building
      { minX: 240, maxX: 360, minZ: 1075, maxZ: 1125 },
    ];

    towers.forEach((t) => {
      collidables.push(new THREE.Box3(
        new THREE.Vector3(t.minX, 0, t.minZ),
        new THREE.Vector3(t.maxX, 80, t.maxZ)
      ));
    });
  }

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

    // Overhead destination banner
    const bannerGeo = new THREE.BoxGeometry(4, 1.8, 0.2);
    const bannerMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.y = 7;
    beaconGroup.add(banner);

    scene.add(beaconGroup);
    return beaconGroup;
  }
}

