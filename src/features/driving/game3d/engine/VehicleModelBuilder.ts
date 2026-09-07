import * as THREE from 'three';
import { VehicleCategory, AITrafficVehicle } from '../types';

export interface VehicleModelBundle {
  root: THREE.Group;
  wheels: THREE.Mesh[];
  frontLeftWheelGroup?: THREE.Group;
  frontRightWheelGroup?: THREE.Group;
  steeringWheel?: THREE.Group;
  headlights: THREE.SpotLight[];
  headlightMeshes: THREE.Mesh[];
  brakeLights: THREE.Mesh[];
  bodyMesh: THREE.Mesh;
}

export class VehicleModelBuilder {
  // Shared materials for memory efficiency
  private static tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  private static rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
  private static glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x111e2e,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.7,
    transparent: true,
    opacity: 0.6
  });
  private static interiorMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.8 });
  private static chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
  private static headlightOnMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  private static brakeLightOffMat = new THREE.MeshStandardMaterial({ color: 0x550000, roughness: 0.5 });
  private static brakeLightOnMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });

  /**
   * Creates the player's 3D vehicle with detailed cockpit interior and steerable front wheels
   */
  public static createPlayerVehicle(paintColor: number = 0x0066ff, category: string = 'sports'): VehicleModelBundle {
    const root = new THREE.Group();
    root.name = `Player_${category}`;

    const catLower = category.toLowerCase();
    const isTaxi = catLower.includes('taxi');
    const isBus = catLower.includes('bus');
    const isTruck = catLower.includes('truck');
    const isSuv = catLower.includes('suv') || catLower.includes('utility');
    const isCompact = catLower.includes('compact') || catLower.includes('hatchback');

    const effectiveColor = isTaxi ? 0xffb703 : paintColor;

    const paintMat = new THREE.MeshStandardMaterial({
      color: effectiveColor,
      metalness: 0.6,
      roughness: 0.25,
    });

    let chassisW = 1.85;
    let chassisH = 0.45;
    let chassisL = 4.3;
    let wheelRadius = 0.34;
    let wheelZOffset = 1.35;
    let wheelXOffset = 0.95;

    if (isBus) {
      chassisW = 2.6;
      chassisH = 2.2;
      chassisL = 10.0;
      wheelRadius = 0.48;
      wheelZOffset = 3.6;
      wheelXOffset = 1.25;
    } else if (isTruck) {
      chassisW = 2.5;
      chassisH = 1.8;
      chassisL = 8.2;
      wheelRadius = 0.46;
      wheelZOffset = 2.6;
      wheelXOffset = 1.2;
    } else if (isSuv) {
      chassisW = 2.0;
      chassisH = 0.65;
      chassisL = 4.6;
      wheelRadius = 0.42;
      wheelZOffset = 1.45;
      wheelXOffset = 1.0;
    } else if (isCompact) {
      chassisW = 1.75;
      chassisH = 0.45;
      chassisL = 3.8;
      wheelRadius = 0.32;
      wheelZOffset = 1.2;
      wheelXOffset = 0.9;
    }

    // 1. Lower Chassis
    const chassisGeo = new THREE.BoxGeometry(chassisW, chassisH, chassisL);
    const chassis = new THREE.Mesh(chassisGeo, paintMat);
    chassis.position.y = chassisH / 2 + 0.3;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    root.add(chassis);

    // 2. Hood / Front Nose (slanted)
    if (!isBus && !isTruck) {
      const hoodGeo = new THREE.BoxGeometry(chassisW * 0.94, 0.25, chassisL * 0.32);
      const hood = new THREE.Mesh(hoodGeo, paintMat);
      hood.position.set(0, chassis.position.y + 0.2, chassisL * 0.28);
      hood.rotation.x = -0.05;
      hood.castShadow = true;
      root.add(hood);
    }

    // 3. Cabin & Glass Roof
    let cabinW = chassisW * 0.86;
    let cabinH = 0.6;
    let cabinL = chassisL * 0.52;
    let cabinY = chassis.position.y + 0.48;
    let cabinZ = -0.2;

    if (isBus) {
      cabinW = 2.65;
      cabinH = 1.2;
      cabinL = 9.2;
      cabinY = 1.7;
      cabinZ = 0;
    } else if (isTruck) {
      cabinW = 2.4;
      cabinH = 1.4;
      cabinL = 2.2;
      cabinY = 1.4;
      cabinZ = 2.5;

      // Cargo Container for Truck
      const cargoMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 });
      const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.2, 5.4), cargoMat);
      cargo.position.set(0, 1.7, -1.2);
      cargo.castShadow = true;
      root.add(cargo);
    }

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(cabinW, cabinH, cabinL), this.glassMat);
    cabin.position.set(0, cabinY, cabinZ);
    cabin.castShadow = true;
    root.add(cabin);

    // Taxi Roof Sign
    if (isTaxi) {
      const taxiSignMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const taxiSign = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.24), taxiSignMat);
      taxiSign.position.set(0, cabinY + cabinH / 2 + 0.1, -0.2);
      root.add(taxiSign);
    }

    // Sports Spoiler
    if (!isBus && !isTruck && !isSuv && !isTaxi) {
      const spoilerWing = new THREE.Mesh(
        new THREE.BoxGeometry(chassisW * 0.9, 0.05, 0.25),
        paintMat
      );
      spoilerWing.position.set(0, chassis.position.y + 0.45, -chassisL / 2 + 0.1);
      root.add(spoilerWing);
    }

    // 4. Cockpit Interior (visible from first-person driver camera)
    let dashX = isBus ? -0.65 : -0.38;
    let dashY = isBus ? 1.6 : (isTruck ? 1.5 : (isSuv ? 1.05 : 0.88));
    let dashZ = isBus ? 3.4 : (isTruck ? 2.4 : 0.55);

    const dashboardGeo = new THREE.BoxGeometry(chassisW * 0.8, 0.35, 0.6);
    const dashboard = new THREE.Mesh(dashboardGeo, this.interiorMat);
    dashboard.position.set(0, dashY, dashZ);
    root.add(dashboard);

    // Digital Instrument Cluster screen
    const clusterGeo = new THREE.PlaneGeometry(0.32, 0.14);
    const clusterMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const cluster = new THREE.Mesh(clusterGeo, clusterMat);
    cluster.position.set(dashX, dashY + 0.1, dashZ - 0.07);
    cluster.rotation.x = -0.2;
    cluster.rotation.y = Math.PI;
    root.add(cluster);

    // Seats (Driver and Passenger)
    const seatGeo = new THREE.BoxGeometry(0.5, 0.7, 0.5);
    const driverSeat = new THREE.Mesh(seatGeo, this.interiorMat);
    driverSeat.position.set(dashX, dashY - 0.15, dashZ - 0.8);
    root.add(driverSeat);

    // Steering Column & Wheel
    const steeringGroup = new THREE.Group();
    steeringGroup.position.set(dashX, dashY + 0.05, dashZ - 0.22);
    steeringGroup.rotation.x = -0.3;

    // Steering Wheel Rim (Torus)
    const rimGeo = new THREE.TorusGeometry(0.18, 0.022, 12, 24);
    const rim = new THREE.Mesh(rimGeo, this.interiorMat);
    steeringGroup.add(rim);

    // Steering Wheel Center / Spokes
    const spokeGeo = new THREE.BoxGeometry(0.34, 0.03, 0.02);
    const spoke = new THREE.Mesh(spokeGeo, this.chromeMat);
    steeringGroup.add(spoke);
    root.add(steeringGroup);

    // 5. Headlights & SpotLights (Active road illumination)
    const hlGeo = new THREE.BoxGeometry(0.28, 0.12, 0.08);
    const hlY = chassis.position.y + 0.05;
    const hlZ = chassisL / 2;

    const hlLeft = new THREE.Mesh(hlGeo, this.headlightOnMat);
    hlLeft.position.set(-chassisW / 2 + 0.25, hlY, hlZ);
    root.add(hlLeft);

    const hlRight = new THREE.Mesh(hlGeo, this.headlightOnMat);
    hlRight.position.set(chassisW / 2 - 0.25, hlY, hlZ);
    root.add(hlRight);

    // Spotlights casting light cones forward
    const spotLeft = new THREE.SpotLight(0xffffff, 40, 60, Math.PI / 6, 0.3, 1.2);
    spotLeft.position.set(-chassisW / 2 + 0.25, hlY + 0.1, hlZ + 0.1);
    spotLeft.target.position.set(-chassisW / 2 + 0.25, 0, 30);
    root.add(spotLeft);
    root.add(spotLeft.target);

    const spotRight = new THREE.SpotLight(0xffffff, 40, 60, Math.PI / 6, 0.3, 1.2);
    spotRight.position.set(chassisW / 2 - 0.25, hlY + 0.1, hlZ + 0.1);
    spotRight.target.position.set(chassisW / 2 - 0.25, 0, 30);
    root.add(spotRight);
    root.add(spotRight.target);

    // 6. Rear Tail & Brake Lights
    const brakeGeo = new THREE.BoxGeometry(0.38, 0.1, 0.06);
    const blLeft = new THREE.Mesh(brakeGeo, this.brakeLightOffMat);
    blLeft.position.set(-chassisW / 2 + 0.25, hlY, -chassisL / 2);
    root.add(blLeft);

    const blRight = new THREE.Mesh(brakeGeo, this.brakeLightOffMat);
    blRight.position.set(chassisW / 2 - 0.25, hlY, -chassisL / 2);
    root.add(blRight);

    // 7. Wheels & Suspension Hubs
    const wheels: THREE.Mesh[] = [];
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.24, 20);
    wheelGeo.rotateZ(Math.PI / 2);

    // Front Left (Pivot group for steering)
    const flGroup = new THREE.Group();
    flGroup.position.set(-wheelXOffset, wheelRadius, wheelZOffset);
    const flWheel = new THREE.Mesh(wheelGeo, this.tireMat);
    flWheel.castShadow = true;
    flGroup.add(flWheel);
    root.add(flGroup);
    wheels.push(flWheel);

    // Front Right (Pivot group for steering)
    const frGroup = new THREE.Group();
    frGroup.position.set(wheelXOffset, wheelRadius, wheelZOffset);
    const frWheel = new THREE.Mesh(wheelGeo, this.tireMat);
    frWheel.castShadow = true;
    frGroup.add(frWheel);
    root.add(frGroup);
    wheels.push(frWheel);

    // Rear Wheels
    const rlWheel = new THREE.Mesh(wheelGeo, this.tireMat);
    rlWheel.position.set(-wheelXOffset, wheelRadius, -wheelZOffset);
    rlWheel.castShadow = true;
    root.add(rlWheel);
    wheels.push(rlWheel);

    const rrWheel = new THREE.Mesh(wheelGeo, this.tireMat);
    rrWheel.position.set(wheelXOffset, wheelRadius, -wheelZOffset);
    rrWheel.castShadow = true;
    root.add(rrWheel);
    wheels.push(rrWheel);

    return {
      root,
      wheels,
      frontLeftWheelGroup: flGroup,
      frontRightWheelGroup: frGroup,
      steeringWheel: steeringGroup,
      headlights: [spotLeft, spotRight],
      headlightMeshes: [hlLeft, hlRight],
      brakeLights: [blLeft, blRight],
      bodyMesh: chassis
    };
  }

  /**
   * Builds an AI vehicle model based on category (Sedan, Taxi, SUV, Motorcycle, Bus, Truck)
   */
  public static createAIVehicle(category: VehicleCategory): AITrafficVehicle {
    const root = new THREE.Group();
    root.name = `AI_${category}`;
    const wheels: THREE.Mesh[] = [];
    const brakeLights: THREE.Mesh[] = [];
    const headlights: THREE.SpotLight[] = [];

    let length = 4.2;
    let width = 1.8;
    let height = 1.45;
    let targetSpeed = 16.0; // ~58 km/h

    switch (category) {
      case 'taxi': {
        // Taxi Yellow
        const taxiMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3, metalness: 0.4 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 4.2), taxiMat);
        body.position.y = 0.55;
        body.castShadow = true;
        root.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 2.2), this.glassMat);
        cabin.position.set(0, 1.05, -0.2);
        root.add(cabin);

        // Taxi Roof Sign
        const signMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sign = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.22), signMat);
        sign.position.set(0, 1.4, -0.2);
        root.add(sign);

        this.addStandardWheels(root, wheels, 1.8, 4.2);
        this.addStandardLights(root, brakeLights, headlights, 1.8, 4.2);
        targetSpeed = 15.0; // ~54 km/h
        break;
      }

      case 'suv': {
        // SUV Robust
        const suvMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.4, metalness: 0.5 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 4.6), suvMat);
        body.position.y = 0.7;
        body.castShadow = true;
        root.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 2.8), this.glassMat);
        cabin.position.set(0, 1.35, -0.3);
        root.add(cabin);

        width = 2.0;
        length = 4.6;
        height = 1.75;
        this.addStandardWheels(root, wheels, 2.0, 4.6, 0.42);
        this.addStandardLights(root, brakeLights, headlights, 2.0, 4.6, 0.75);
        targetSpeed = 17.5; // ~63 km/h
        break;
      }

      case 'motorcycle': {
        // Motorcycle / Bike with 3D Rider
        width = 0.8;
        length = 2.2;
        height = 1.35;
        targetSpeed = 19.5; // ~70 km/h (bikes are agile and faster)

        const bikeMat = new THREE.MeshStandardMaterial({ color: 0xd90429, metalness: 0.7, roughness: 0.2 });
        // Bike frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 1.6), bikeMat);
        frame.position.y = 0.55;
        frame.castShadow = true;
        root.add(frame);

        // Handlebars
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7), this.chromeMat);
        bar.position.set(0, 0.9, 0.5);
        bar.rotation.z = Math.PI / 2;
        root.add(bar);

        // 3D Rider Model (Helmet & Torso)
        const riderJacketMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
        const riderTorso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.3), riderJacketMat);
        riderTorso.position.set(0, 0.95, -0.15);
        riderTorso.rotation.x = 0.25; // leaning forward
        root.add(riderTorso);

        const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.2 });
        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), helmetMat);
        helmet.position.set(0, 1.3, -0.05);
        root.add(helmet);

        // 2 Bike Wheels (Narrow)
        const bikeWheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 16);
        bikeWheelGeo.rotateZ(Math.PI / 2);

        const frontWheel = new THREE.Mesh(bikeWheelGeo, this.tireMat);
        frontWheel.position.set(0, 0.32, 0.85);
        frontWheel.castShadow = true;
        root.add(frontWheel);
        wheels.push(frontWheel);

        const rearWheel = new THREE.Mesh(bikeWheelGeo, this.tireMat);
        rearWheel.position.set(0, 0.32, -0.85);
        rearWheel.castShadow = true;
        root.add(rearWheel);
        wheels.push(rearWheel);

        // Bike Headlight & Tail Light
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), this.headlightOnMat);
        hl.position.set(0, 0.75, 0.95);
        root.add(hl);

        const bl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.04), this.brakeLightOffMat);
        bl.position.set(0, 0.65, -0.95);
        root.add(bl);
        brakeLights.push(bl);
        break;
      }

      case 'bus': {
        // City Transit Bus
        width = 2.6;
        length = 10.5;
        height = 3.1;
        targetSpeed = 12.0; // ~43 km/h

        const busMat = new THREE.MeshStandardMaterial({ color: 0x0077b6, roughness: 0.4, metalness: 0.3 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.4, 10.5), busMat);
        body.position.y = 1.6;
        body.castShadow = true;
        root.add(body);

        // Long side windows
        const windowGeo = new THREE.BoxGeometry(2.65, 0.9, 9.2);
        const windows = new THREE.Mesh(windowGeo, this.glassMat);
        windows.position.set(0, 1.8, 0);
        root.add(windows);

        // 6 Multi-axle wheels
        const busWheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 18);
        busWheelGeo.rotateZ(Math.PI / 2);

        [-3.6, 2.2, 3.8].forEach((zPos) => {
          [-1.25, 1.25].forEach((xPos) => {
            const w = new THREE.Mesh(busWheelGeo, this.tireMat);
            w.position.set(xPos, 0.48, zPos);
            w.castShadow = true;
            root.add(w);
            wheels.push(w);
          });
        });

        this.addStandardLights(root, brakeLights, headlights, 2.6, 10.5, 0.9);
        break;
      }

      case 'truck': {
        // Cargo Freight Truck
        width = 2.5;
        length = 8.5;
        height = 3.0;
        targetSpeed = 13.0; // ~47 km/h

        const cabMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.4, metalness: 0.5 });
        const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 2.2), cabMat);
        cab.position.set(0, 1.4, 2.8);
        cab.castShadow = true;
        root.add(cab);

        const cargoMat = new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.6 });
        const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.3, 5.8), cargoMat);
        cargo.position.set(0, 1.7, -1.1);
        cargo.castShadow = true;
        root.add(cargo);

        // 6 Heavy Wheels
        const truckWheelGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.32, 18);
        truckWheelGeo.rotateZ(Math.PI / 2);

        [-2.8, -1.6, 2.8].forEach((zPos) => {
          [-1.2, 1.2].forEach((xPos) => {
            const w = new THREE.Mesh(truckWheelGeo, this.tireMat);
            w.position.set(xPos, 0.46, zPos);
            w.castShadow = true;
            root.add(w);
            wheels.push(w);
          });
        });

        this.addStandardLights(root, brakeLights, headlights, 2.5, 8.5, 0.85);
        break;
      }

      case 'sedan':
      default: {
        // Standard City Sedan (random paint color)
        const colors = [0xcccccc, 0x1d3557, 0x333333, 0x6c757d, 0x8338ec];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const sedanMat = new THREE.MeshStandardMaterial({ color: randomColor, roughness: 0.35, metalness: 0.5 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 4.3), sedanMat);
        body.position.y = 0.55;
        body.castShadow = true;
        root.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 2.2), this.glassMat);
        cabin.position.set(0, 1.05, -0.2);
        root.add(cabin);

        this.addStandardWheels(root, wheels, 1.8, 4.3);
        this.addStandardLights(root, brakeLights, headlights, 1.8, 4.3);
        targetSpeed = 16.5; // ~60 km/h
        break;
      }
    }

    return {
      id: Math.random().toString(36).substring(2, 9),
      category,
      mesh: root,
      position: root.position,
      heading: 0,
      targetSpeed,
      currentSpeed: targetSpeed,
      laneIndex: 0,
      direction: 'forward',
      length,
      width,
      height,
      wheels,
      brakeLights,
      headlights
    };
  }

  private static addStandardWheels(root: THREE.Group, wheels: THREE.Mesh[], width: number, length: number, radius = 0.34) {
    const wheelGeo = new THREE.CylinderGeometry(radius, radius, 0.22, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const halfW = width / 2;
    const halfL = length / 2 - 0.75;

    [
      { x: -halfW, z: halfL },
      { x: halfW, z: halfL },
      { x: -halfW, z: -halfL },
      { x: halfW, z: -halfL },
    ].forEach((pos) => {
      const w = new THREE.Mesh(wheelGeo, this.tireMat);
      w.position.set(pos.x, radius, pos.z);
      w.castShadow = true;
      root.add(w);
      wheels.push(w);
    });
  }

  private static addStandardLights(
    root: THREE.Group,
    brakeLights: THREE.Mesh[],
    headlights: THREE.SpotLight[],
    width: number,
    length: number,
    height = 0.6
  ) {
    const halfW = width / 2 - 0.25;
    const halfL = length / 2;

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.24, 0.12, 0.05);
    const hl1 = new THREE.Mesh(hlGeo, this.headlightOnMat);
    hl1.position.set(-halfW, height, halfL);
    root.add(hl1);

    const hl2 = new THREE.Mesh(hlGeo, this.headlightOnMat);
    hl2.position.set(halfW, height, halfL);
    root.add(hl2);

    // Brake lights
    const blGeo = new THREE.BoxGeometry(0.3, 0.1, 0.05);
    const bl1 = new THREE.Mesh(blGeo, this.brakeLightOffMat);
    bl1.position.set(-halfW, height, -halfL);
    root.add(bl1);
    brakeLights.push(bl1);

    const bl2 = new THREE.Mesh(blGeo, this.brakeLightOffMat);
    bl2.position.set(halfW, height, -halfL);
    root.add(bl2);
    brakeLights.push(bl2);
  }
}
