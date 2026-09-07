import * as THREE from 'three';
import { TrafficVehicleInstance } from '../traffic/TrafficVehicleFleet';

export type WantedHeatLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface TrafficInfraction {
  type:
    | 'SPEEDING_RADAR'
    | 'RED_LIGHT_VIOLATION'
    | 'RECKLESS_DRIVING'
    | 'COLLISION_HIT_AND_RUN'
    | 'EVADING_ARREST';
  description: string;
  fineAmount: number;
  heatIncrease: number;
  timestamp: number;
}

export interface PursuitStatus {
  heatLevel: WantedHeatLevel;
  heatPoints: number; // 0 to 500
  isPursuitActive: boolean;
  isEvading: boolean;
  evadeTimer: number; // seconds remaining to lose heat
  bustMeter: number; // 0 to 100%
  totalFinesAccrued: number;
  activeSquadCount: number;
  isHelicopterDeployed: boolean;
  infractions: TrafficInfraction[];
}

export class PolicePursuitEngine {
  private scene: THREE.Scene;
  public status: PursuitStatus;

  // Active police pursuit units
  public policeCruisers: Map<string, TrafficVehicleInstance> = new Map();

  // Helicopter tracking spotlight
  private helicopterSpotlight?: THREE.SpotLight;
  private helicopterLightTarget?: THREE.Object3D;
  private helicopterSoundTimer: number = 0;

  // Spike strip hazards
  public activeSpikeStrips: Array<{ position: THREE.Vector3; width: number; mesh: THREE.Mesh }> = [];

  private unitCounter: number = 0;
  private spawnCooldown: number = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.status = {
      heatLevel: 0,
      heatPoints: 0,
      isPursuitActive: false,
      isEvading: false,
      evadeTimer: 0,
      bustMeter: 0,
      totalFinesAccrued: 0,
      activeSquadCount: 0,
      isHelicopterDeployed: false,
      infractions: [],
    };

    this.setupHelicopterSpotlight();
  }

  private setupHelicopterSpotlight(): void {
    this.helicopterLightTarget = new THREE.Object3D();
    this.scene.add(this.helicopterLightTarget);

    this.helicopterSpotlight = new THREE.SpotLight(0xddeeff, 0, 300, Math.PI / 7, 0.45, 1.2);
    this.helicopterSpotlight.castShadow = true;
    this.helicopterSpotlight.target = this.helicopterLightTarget;
    this.scene.add(this.helicopterSpotlight);
  }

  /**
   * Reports a traffic violation committed by the player
   */
  public reportInfraction(
    type: TrafficInfraction['type'],
    description: string,
    fine: number,
    heatGain: number
  ): void {
    const infraction: TrafficInfraction = {
      type,
      description,
      fineAmount: fine,
      heatIncrease: heatGain,
      timestamp: Date.now(),
    };

    this.status.infractions.push(infraction);
    this.status.totalFinesAccrued += fine;
    this.status.heatPoints = Math.min(500, this.status.heatPoints + heatGain);
    this.recomputeHeatLevel();
    this.status.isPursuitActive = this.status.heatLevel > 0;
    this.status.isEvading = false;
    this.status.evadeTimer = 15.0; // 15s evade cooldown
  }

  private recomputeHeatLevel(): void {
    const p = this.status.heatPoints;
    let newLevel: WantedHeatLevel = 0;
    if (p >= 400) newLevel = 5;
    else if (p >= 300) newLevel = 4;
    else if (p >= 200) newLevel = 3;
    else if (p >= 100) newLevel = 2;
    else if (p >= 20) newLevel = 1;
    else newLevel = 0;

    this.status.heatLevel = newLevel;
    this.status.isHelicopterDeployed = newLevel >= 4;
  }

  /**
   * Main update loop for police pursuit AI, PIT maneuvers, spike strips, helicopter, and bust mechanics
   */
  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerVelocity: THREE.Vector3,
    playerSpeedKmh: number
  ): { isBusted: boolean; hasEvaded: boolean } {
    let isBusted = false;
    let hasEvaded = false;

    if (!this.status.isPursuitActive) {
      this.clearAllUnits();
      if (this.helicopterSpotlight) this.helicopterSpotlight.intensity = 0;
      return { isBusted: false, hasEvaded: false };
    }

    // 1. Manage Pursuit Units Spawning
    this.manageSquadDeployments(dt, playerPos);

    // 2. Check Line of Sight & Evade Timer
    let closestCopDist = Infinity;
    this.policeCruisers.forEach((cop) => {
      const d = cop.position.distanceTo(playerPos);
      if (d < closestCopDist) closestCopDist = d;
    });

    if (closestCopDist > 140) {
      // Out of sight -> evade countdown
      this.status.isEvading = true;
      this.status.evadeTimer -= dt;
      if (this.status.evadeTimer <= 0) {
        // Escaped pursuit!
        this.status.isPursuitActive = false;
        this.status.heatPoints = 0;
        this.status.heatLevel = 0;
        this.clearAllUnits();
        hasEvaded = true;
      }
    } else {
      this.status.isEvading = false;
      this.status.evadeTimer = 15.0;
    }

    // 3. Bust Mechanic: If player is almost stopped (< 6 km/h) and cop is right next to player (< 7m)
    if (playerSpeedKmh < 6.0 && closestCopDist < 7.5) {
      this.status.bustMeter += dt * 38.0; // Fills in ~2.6 seconds
      if (this.status.bustMeter >= 100) {
        this.status.bustMeter = 100;
        isBusted = true;
        this.status.isPursuitActive = false;
      }
    } else {
      this.status.bustMeter = Math.max(0, this.status.bustMeter - dt * 45.0);
    }

    // 4. Update Interceptor Pursuit Kinematics & PIT Maneuver AI
    this.policeCruisers.forEach((cop, id) => {
      cop.isSirenActive = true;

      // Pursuit Vector toward player
      const toPlayer = new THREE.Vector3().subVectors(playerPos, cop.position);
      const dist = toPlayer.length();

      if (dist > 300) {
        this.despawnUnit(id);
        return;
      }

      // Calculate Target Intercept Position
      let targetPos = playerPos.clone();

      if (this.status.heatLevel >= 3 && dist < 30) {
        // PIT Maneuver Tactic: Aim for player's rear quarter panel
        const forwardPlayer = playerVelocity.clone().normalize();
        const lateralOffset = new THREE.Vector3(-forwardPlayer.z, 0, forwardPlayer.x).multiplyScalar(1.8);
        targetPos.sub(forwardPlayer.clone().multiplyScalar(3.0)).add(lateralOffset);
      }

      const steerDir = new THREE.Vector3().subVectors(targetPos, cop.position).normalize();
      const desiredYaw = Math.atan2(steerDir.x, steerDir.z);

      // Smooth yaw turning towards player
      let deltaAngle = desiredYaw - cop.yaw;
      while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

      cop.yaw += deltaAngle * Math.min(1.0, dt * (3.0 + this.status.heatLevel * 0.4));
      cop.steerAngle = Math.max(-0.6, Math.min(0.6, deltaAngle));

      // Aggressive pursuit speed based on heat level
      const targetSpeed = Math.min(
        cop.spec.maxSpeedKmh / 3.6,
        playerSpeedKmh / 3.6 + (this.status.heatLevel * 3.5 + 4.0)
      );

      const speedDiff = targetSpeed - cop.velocity;
      cop.acceleration = Math.max(-8.0, Math.min(6.5, speedDiff * 2.5));
      cop.velocity = Math.max(0, cop.velocity + cop.acceleration * dt);

      // Move forward along yaw
      cop.position.x += Math.sin(cop.yaw) * cop.velocity * dt;
      cop.position.z += Math.cos(cop.yaw) * cop.velocity * dt;

      cop.update(dt);
    });

    // 5. Update Helicopter Searchlight
    if (this.status.isHelicopterDeployed && this.helicopterSpotlight && this.helicopterLightTarget) {
      this.helicopterSpotlight.intensity = 6.0;
      // Helicopter hovers 65m above and 15m behind player
      this.helicopterSpotlight.position.set(
        playerPos.x + Math.sin(Date.now() * 0.001) * 20,
        playerPos.y + 65,
        playerPos.z - 25
      );
      this.helicopterLightTarget.position.copy(playerPos);
    } else if (this.helicopterSpotlight) {
      this.helicopterSpotlight.intensity = 0;
    }

    this.status.activeSquadCount = this.policeCruisers.size;

    return { isBusted, hasEvaded };
  }

  private manageSquadDeployments(dt: number, playerPos: THREE.Vector3): void {
    const desiredCops = Math.min(6, this.status.heatLevel * 2);
    if (this.policeCruisers.size >= desiredCops) return;

    this.spawnCooldown -= dt;
    if (this.spawnCooldown > 0) return;
    this.spawnCooldown = 3.5;

    // Spawn squad cruiser 120m behind or in front of player
    const id = `police_${++this.unitCounter}`;
    const cop = new TrafficVehicleInstance(id, 'police_cruiser', 0x080808);
    cop.isSirenActive = true;

    // Position behind player
    const spawnAngle = Math.random() * Math.PI * 2;
    cop.position.set(
      playerPos.x + Math.sin(spawnAngle) * 110,
      playerPos.y,
      playerPos.z + Math.cos(spawnAngle) * 110
    );

    cop.group.position.copy(cop.position);
    this.policeCruisers.set(id, cop);
    this.scene.add(cop.group);
  }

  public deployRoadblockSpikeStrip(pos: THREE.Vector3, roadHeading: number): void {
    const spikeGeo = new THREE.BoxGeometry(10.0, 0.08, 0.4);
    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.4,
      metalness: 0.9,
    });
    const mesh = new THREE.Mesh(spikeGeo, spikeMat);
    mesh.position.copy(pos);
    mesh.rotation.y = roadHeading;
    mesh.castShadow = true;

    this.scene.add(mesh);
    this.activeSpikeStrips.push({
      position: pos.clone(),
      width: 10.0,
      mesh,
    });
  }

  public despawnUnit(id: string): void {
    const cop = this.policeCruisers.get(id);
    if (cop) {
      this.scene.remove(cop.group);
      cop.dispose();
      this.policeCruisers.delete(id);
    }
  }

  public clearAllUnits(): void {
    this.policeCruisers.forEach((cop, id) => {
      this.scene.remove(cop.group);
      cop.dispose();
    });
    this.policeCruisers.clear();

    this.activeSpikeStrips.forEach((strip) => {
      this.scene.remove(strip.mesh);
      strip.mesh.geometry.dispose();
    });
    this.activeSpikeStrips = [];
  }
}
