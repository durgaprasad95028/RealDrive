import * as THREE from 'three';

export type SignalLightColor = 'red' | 'yellow' | 'green' | 'green_left_arrow';

export type IntersectionPhase =
  | 'NORTH_SOUTH_GREEN'
  | 'NORTH_SOUTH_YELLOW'
  | 'NORTH_SOUTH_LEFT_ARROW'
  | 'ALL_RED_CLEARANCE_1'
  | 'EAST_WEST_GREEN'
  | 'EAST_WEST_YELLOW'
  | 'EAST_WEST_LEFT_ARROW'
  | 'ALL_RED_CLEARANCE_2'
  | 'EMERGENCY_PREEMPTION';

export interface IntersectionSignalState {
  intersectionId: string;
  currentPhase: IntersectionPhase;
  phaseTimer: number;
  northSouthLight: SignalLightColor;
  eastWestLight: SignalLightColor;
  northSouthLeftArrow: boolean;
  eastWestLeftArrow: boolean;
  isEmergencyPreemption: boolean;
  emergencyCorridorAxis?: 'north_south' | 'east_west';
}

export interface IntersectionConfig {
  id: string;
  name: string;
  position: THREE.Vector3;
  radius: number; // radius of intersection zone in meters
  hasLeftTurnPockets: boolean;
  hasPedestrianCrossings: boolean;
  phaseDurations: {
    greenDuration: number;
    yellowDuration: number;
    leftArrowDuration: number;
    allRedDuration: number;
  };
}

export class IntersectionController {
  public config: IntersectionConfig;
  public state: IntersectionSignalState;
  public group: THREE.Group;

  // Signal head meshes for 4 approaches (North, South, East, West)
  private signalHeadMeshes: Map<
    string,
    {
      red: THREE.Mesh;
      yellow: THREE.Mesh;
      green: THREE.Mesh;
      leftArrow?: THREE.Mesh;
    }
  > = new Map();

  constructor(config: IntersectionConfig) {
    this.config = config;
    this.state = {
      intersectionId: config.id,
      currentPhase: 'NORTH_SOUTH_GREEN',
      phaseTimer: 0,
      northSouthLight: 'green',
      eastWestLight: 'red',
      northSouthLeftArrow: false,
      eastWestLeftArrow: false,
      isEmergencyPreemption: false,
    };

    this.group = this.buildIntersectionGantry3D();
  }

  private buildIntersectionGantry3D(): THREE.Group {
    const root = new THREE.Group();
    root.name = `Intersection_${this.config.id}`;
    root.position.copy(this.config.position);

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x22262a,
      roughness: 0.5,
      metalness: 0.8,
    });

    const signalBodyMat = new THREE.MeshStandardMaterial({
      color: 0x111315,
      roughness: 0.7,
      metalness: 0.3,
    });

    // 4 Corner Poles with cantilever mast arms
    const directions: Array<{ id: string; angle: number; posX: number; posZ: number }> = [
      { id: 'north', angle: 0, posX: 0, posZ: this.config.radius * 0.9 },
      { id: 'south', angle: Math.PI, posX: 0, posZ: -this.config.radius * 0.9 },
      { id: 'east', angle: Math.PI / 2, posX: this.config.radius * 0.9, posZ: 0 },
      { id: 'west', angle: -Math.PI / 2, posX: -this.config.radius * 0.9, posZ: 0 },
    ];

    for (const dir of directions) {
      const gantryGroup = new THREE.Group();
      gantryGroup.position.set(dir.posX, 0, dir.posZ);
      gantryGroup.rotation.y = dir.angle;

      // Vertical Pole (6.5m high)
      const poleGeo = new THREE.CylinderGeometry(0.18, 0.22, 6.5, 12);
      const pole = new THREE.Mesh(poleGeo, metalMat);
      pole.position.set(dir.posX > 0 ? 4 : -4, 3.25, 0);
      gantryGroup.add(pole);

      // Horizontal Mast Arm (extending over lanes)
      const armGeo = new THREE.CylinderGeometry(0.12, 0.15, 8.0, 10);
      armGeo.rotateZ(Math.PI / 2);
      const arm = new THREE.Mesh(armGeo, metalMat);
      arm.position.set(0, 6.2, 0);
      gantryGroup.add(arm);

      // Signal Head Housing
      const headGeo = new THREE.BoxGeometry(0.45, 1.2, 0.3);
      const headHousing = new THREE.Mesh(headGeo, signalBodyMat);
      headHousing.position.set(0, 5.5, 0);
      gantryGroup.add(headHousing);

      // Red, Yellow, Green Lens Meshes
      const lensGeo = new THREE.CircleGeometry(0.12, 16);

      const redMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x330000,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      });
      const redLens = new THREE.Mesh(lensGeo, redMat);
      redLens.position.set(0, 5.85, 0.16);

      const yellowMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x332200,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      });
      const yellowLens = new THREE.Mesh(lensGeo, yellowMat);
      yellowLens.position.set(0, 5.5, 0.16);

      const greenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x003311,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      });
      const greenLens = new THREE.Mesh(lensGeo, greenMat);
      greenLens.position.set(0, 5.15, 0.16);

      gantryGroup.add(redLens, yellowLens, greenLens);

      this.signalHeadMeshes.set(dir.id, {
        red: redLens,
        yellow: yellowLens,
        green: greenLens,
      });

      root.add(gantryGroup);
    }

    return root;
  }

  /**
   * Advances the traffic signal phase machine
   */
  public update(dt: number): void {
    if (this.state.isEmergencyPreemption) {
      // Preempted green wave corridor
      if (this.state.emergencyCorridorAxis === 'north_south') {
        this.state.northSouthLight = 'green';
        this.state.eastWestLight = 'red';
      } else {
        this.state.northSouthLight = 'red';
        this.state.eastWestLight = 'green';
      }
      this.updateVisualLenses();
      return;
    }

    this.state.phaseTimer += dt;
    const { greenDuration, yellowDuration, leftArrowDuration, allRedDuration } =
      this.config.phaseDurations;

    switch (this.state.currentPhase) {
      case 'NORTH_SOUTH_GREEN':
        this.state.northSouthLight = 'green';
        this.state.eastWestLight = 'red';
        this.state.northSouthLeftArrow = false;
        if (this.state.phaseTimer >= greenDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = this.config.hasLeftTurnPockets
            ? 'NORTH_SOUTH_LEFT_ARROW'
            : 'NORTH_SOUTH_YELLOW';
        }
        break;

      case 'NORTH_SOUTH_LEFT_ARROW':
        this.state.northSouthLight = 'green';
        this.state.northSouthLeftArrow = true;
        this.state.eastWestLight = 'red';
        if (this.state.phaseTimer >= leftArrowDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = 'NORTH_SOUTH_YELLOW';
        }
        break;

      case 'NORTH_SOUTH_YELLOW':
        this.state.northSouthLight = 'yellow';
        this.state.northSouthLeftArrow = false;
        this.state.eastWestLight = 'red';
        if (this.state.phaseTimer >= yellowDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = 'ALL_RED_CLEARANCE_1';
        }
        break;

      case 'ALL_RED_CLEARANCE_1':
        this.state.northSouthLight = 'red';
        this.state.eastWestLight = 'red';
        if (this.state.phaseTimer >= allRedDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = 'EAST_WEST_GREEN';
        }
        break;

      case 'EAST_WEST_GREEN':
        this.state.northSouthLight = 'red';
        this.state.eastWestLight = 'green';
        this.state.eastWestLeftArrow = false;
        if (this.state.phaseTimer >= greenDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = this.config.hasLeftTurnPockets
            ? 'EAST_WEST_LEFT_ARROW'
            : 'EAST_WEST_YELLOW';
        }
        break;

      case 'EAST_WEST_LEFT_ARROW':
        this.state.northSouthLight = 'red';
        this.state.eastWestLight = 'green';
        this.state.eastWestLeftArrow = true;
        if (this.state.phaseTimer >= leftArrowDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = 'EAST_WEST_YELLOW';
        }
        break;

      case 'EAST_WEST_YELLOW':
        this.state.northSouthLight = 'red';
        this.state.eastWestLight = 'yellow';
        this.state.eastWestLeftArrow = false;
        if (this.state.phaseTimer >= yellowDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = 'ALL_RED_CLEARANCE_2';
        }
        break;

      case 'ALL_RED_CLEARANCE_2':
        this.state.northSouthLight = 'red';
        this.state.eastWestLight = 'red';
        if (this.state.phaseTimer >= allRedDuration) {
          this.state.phaseTimer = 0;
          this.state.currentPhase = 'NORTH_SOUTH_GREEN';
        }
        break;
    }

    this.updateVisualLenses();
  }

  private updateVisualLenses(): void {
    const setLens = (
      heads: { red: THREE.Mesh; yellow: THREE.Mesh; green: THREE.Mesh },
      light: SignalLightColor
    ) => {
      const rMat = heads.red.material as THREE.MeshStandardMaterial;
      const yMat = heads.yellow.material as THREE.MeshStandardMaterial;
      const gMat = heads.green.material as THREE.MeshStandardMaterial;

      rMat.emissiveIntensity = light === 'red' ? 3.0 : 0.15;
      rMat.emissive.setHex(light === 'red' ? 0xff1111 : 0x220000);

      yMat.emissiveIntensity = light === 'yellow' ? 3.0 : 0.15;
      yMat.emissive.setHex(light === 'yellow' ? 0xffaa00 : 0x221100);

      gMat.emissiveIntensity = light === 'green' || light === 'green_left_arrow' ? 3.0 : 0.15;
      gMat.emissive.setHex(light === 'green' || light === 'green_left_arrow' ? 0x00ff44 : 0x002208);
    };

    const northHead = this.signalHeadMeshes.get('north');
    const southHead = this.signalHeadMeshes.get('south');
    const eastHead = this.signalHeadMeshes.get('east');
    const westHead = this.signalHeadMeshes.get('west');

    if (northHead) setLens(northHead, this.state.northSouthLight);
    if (southHead) setLens(southHead, this.state.northSouthLight);
    if (eastHead) setLens(eastHead, this.state.eastWestLight);
    if (westHead) setLens(westHead, this.state.eastWestLight);
  }

  /**
   * Triggers emergency priority green light when sirens approach
   */
  public triggerEmergencyPreemption(axis: 'north_south' | 'east_west'): void {
    this.state.isEmergencyPreemption = true;
    this.state.emergencyCorridorAxis = axis;
  }

  public releaseEmergencyPreemption(): void {
    this.state.isEmergencyPreemption = false;
    this.state.currentPhase = 'ALL_RED_CLEARANCE_1';
    this.state.phaseTimer = 0;
  }

  /**
   * Queries whether an approaching vehicle at a given distance & speed must stop
   */
  public queryShouldStop(
    approach: 'north' | 'south' | 'east' | 'west',
    distanceToStopLine: number,
    velocity: number
  ): boolean {
    const light =
      approach === 'north' || approach === 'south'
        ? this.state.northSouthLight
        : this.state.eastWestLight;

    if (light === 'green') return false;
    if (light === 'red') return true;

    // Yellow Light Dilemma Zone Calculation
    // Stop distance: d_stop = v^2 / (2 * a_comfortable)
    const comfortableDecel = 2.8; // m/s^2
    const stopDistance = (velocity * velocity) / (2 * comfortableDecel);

    // If already inside the stopping distance, passing through is safer than emergency braking
    if (distanceToStopLine < stopDistance * 0.75) {
      return false; // Safely proceed through yellow
    }

    return true; // Stop for yellow
  }
}
