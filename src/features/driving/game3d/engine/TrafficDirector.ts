import * as THREE from 'three';
import { AITrafficVehicle, TrafficSignal, VehicleCategory } from '../types';
import { VehicleModelBuilder } from './VehicleModelBuilder';

export class TrafficDirector {
  public vehicles: AITrafficVehicle[] = [];
  private scene: THREE.Scene;

  // Lane definitions for 16m wide 2-way road (Metro Parkway)
  // Forward lanes (+Z direction, heading = 0)
  private readonly FORWARD_LANES = [2.2, 5.6];
  // Opposite oncoming lanes (-Z direction, heading = Math.PI)
  private readonly OPPOSITE_LANES = [-2.2, -5.6];

  private readonly POOL_SIZE = 22;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initializeTrafficPool();
  }

  private initializeTrafficPool() {
    const categories: VehicleCategory[] = [
      'sedan', 'sedan', 'taxi', 'taxi', 'suv', 'suv',
      'motorcycle', 'motorcycle', 'motorcycle', // agile bikes
      'bus', 'truck', 'sedan', 'sedan', 'taxi',
      'motorcycle', 'suv', 'bus', 'truck', 'sedan', 'taxi', 'motorcycle', 'suv'
    ];

    for (let i = 0; i < this.POOL_SIZE; i++) {
      const category = categories[i % categories.length];
      const vehicle = VehicleModelBuilder.createAIVehicle(category);

      // Half forward lanes, half opposite oncoming lanes
      const isForward = i % 2 === 0;
      const laneArr = isForward ? this.FORWARD_LANES : this.OPPOSITE_LANES;
      const laneX = laneArr[Math.floor(Math.random() * laneArr.length)];

      vehicle.direction = isForward ? 'forward' : 'opposite';
      vehicle.heading = isForward ? 0 : Math.PI;
      vehicle.mesh.rotation.y = vehicle.heading;

      // Distribute along road Z axis
      const initialZ = 30 + i * 45 + (Math.random() * 20 - 10);
      vehicle.position.set(laneX, 0, initialZ);
      vehicle.mesh.position.copy(vehicle.position);

      this.scene.add(vehicle.mesh);
      this.vehicles.push(vehicle);
    }
  }

  public update(dt: number, playerPos: THREE.Vector3, trafficSignals: TrafficSignal[]) {
    if (dt > 0.1) dt = 0.1;

    for (const v of this.vehicles) {
      // 1. Check upcoming traffic signals
      let shouldStop = false;
      let targetDecel = 0;

      for (const sig of trafficSignals) {
        const distZ = (v.direction === 'forward')
          ? (sig.position.z - v.position.z)
          : (v.position.z - sig.position.z);

        // If signal is 5m to 35m ahead of vehicle along the corridor
        if (distZ > 4 && distZ < 35 && (sig.state === 'red' || sig.state === 'yellow')) {
          shouldStop = true;
          targetDecel = 12.0; // brake smoothly
          break;
        }
      }

      // 2. Check distance to other vehicles in the same lane
      let leaderDist = 999;
      for (const other of this.vehicles) {
        if (other.id === v.id || other.direction !== v.direction) continue;

        // Check if in same lane (|x diff| < 1.8)
        if (Math.abs(other.position.x - v.position.x) < 1.8) {
          const aheadDist = (v.direction === 'forward')
            ? (other.position.z - v.position.z)
            : (v.position.z - other.position.z);

          if (aheadDist > 0 && aheadDist < leaderDist) {
            leaderDist = aheadDist;
          }
        }
      }

      // Check distance to player vehicle if player is in this lane
      if (Math.abs(playerPos.x - v.position.x) < 1.8) {
        const distToPlayer = (v.direction === 'forward')
          ? (playerPos.z - v.position.z)
          : (v.position.z - playerPos.z);

        if (distToPlayer > 0 && distToPlayer < leaderDist) {
          leaderDist = distToPlayer;
        }
      }

      // 3. Adjust speed based on conditions
      if (shouldStop) {
        v.currentSpeed = Math.max(0, v.currentSpeed - targetDecel * dt);
        v.stoppingForSignal = true;
      } else if (leaderDist < 14) {
        // Brake to avoid tailgating
        v.currentSpeed = Math.max(0, v.currentSpeed - 15.0 * dt);
      } else if (leaderDist < 25) {
        // Coast / match speed
        v.currentSpeed = THREE.MathUtils.lerp(v.currentSpeed, v.targetSpeed * 0.7, dt * 2.0);
      } else {
        // Accelerate up to target speed
        v.currentSpeed = THREE.MathUtils.lerp(v.currentSpeed, v.targetSpeed, dt * 1.5);
        v.stoppingForSignal = false;
      }

      // 4. Move AI Vehicle along road
      const moveDelta = v.currentSpeed * dt;
      if (v.direction === 'forward') {
        v.position.z += moveDelta;
      } else {
        v.position.z -= moveDelta;
      }
      v.mesh.position.copy(v.position);

      // 5. Spin AI wheels
      const wheelSpin = (v.currentSpeed / 0.34) * dt;
      v.wheels.forEach((w) => {
        w.rotation.x += wheelSpin;
      });

      // 6. Brake lights visual feedback
      const isBraking = v.currentSpeed < v.targetSpeed * 0.8 || shouldStop;
      if (v.brakeLights) {
        v.brakeLights.forEach((bl) => {
          (bl.material as THREE.MeshBasicMaterial).color.setHex(isBraking ? 0xff0000 : 0x550000);
        });
      }

      // 7. Smart Recycling around Player $(Z_{player})$
      this.recycleVehicleIfNeeded(v, playerPos);
    }
  }

  private recycleVehicleIfNeeded(v: AITrafficVehicle, playerPos: THREE.Vector3) {
    if (v.direction === 'forward') {
      // If forward vehicle is far behind player ($>80m$) or way too far ahead ($>350m$)
      if (v.position.z < playerPos.z - 80) {
        // Respawn ahead of player
        v.position.z = playerPos.z + 180 + Math.random() * 120;
        const laneX = this.FORWARD_LANES[Math.floor(Math.random() * this.FORWARD_LANES.length)];
        v.position.x = laneX;
        v.currentSpeed = v.targetSpeed * 0.9;
      } else if (v.position.z > playerPos.z + 400) {
        // Respawn closer behind player
        v.position.z = playerPos.z - 40 - Math.random() * 30;
      }
    } else {
      // Opposite oncoming vehicle (moving towards player from ahead)
      // If it has passed behind player ($Z < Z_{player} - 60$)
      if (v.position.z < playerPos.z - 60) {
        // Respawn ahead in the distance ($+220m \dots +340m$) coming toward player!
        v.position.z = playerPos.z + 220 + Math.random() * 120;
        const laneX = this.OPPOSITE_LANES[Math.floor(Math.random() * this.OPPOSITE_LANES.length)];
        v.position.x = laneX;
        v.currentSpeed = v.targetSpeed;
      }
    }
  }
}
