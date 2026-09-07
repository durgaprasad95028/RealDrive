import * as THREE from 'three';
import { IntelligentDriverModel, LaneSurroundings } from './IntelligentDriverModel';
import {
  TrafficVehicleInstance,
  TrafficVehicleType,
  TRAFFIC_VEHICLE_SPECS,
} from './TrafficVehicleFleet';
import { IntersectionController } from './IntersectionController';
import { RoadNetworkTopology, RoadSegmentSpline } from '../world/RoadNetworkTopology';

export interface TrafficManagerConfig {
  maxVehicles: number;
  spawnRadius: number;
  despawnRadius: number;
  trafficDensity: number; // 0.0 (empty) to 1.0 (rush hour)
}

export class TrafficManager {
  private scene: THREE.Scene;
  private roadTopology: RoadNetworkTopology;
  private config: TrafficManagerConfig;

  public vehicles: Map<string, TrafficVehicleInstance> = new Map();
  public intersections: Map<string, IntersectionController> = new Map();

  private vehicleCounter: number = 0;
  private spawnTimer: number = 0;

  constructor(scene: THREE.Scene, roadTopology: RoadNetworkTopology, config?: Partial<TrafficManagerConfig>) {
    this.scene = scene;
    this.roadTopology = roadTopology;
    this.config = {
      maxVehicles: config?.maxVehicles ?? 45,
      spawnRadius: config?.spawnRadius ?? 280,
      despawnRadius: config?.despawnRadius ?? 360,
      trafficDensity: config?.trafficDensity ?? 0.7,
    };

    this.initializeIntersections();
  }

  private initializeIntersections(): void {
    const defaultIntersections: Array<{ id: string; name: string; pos: THREE.Vector3 }> = [
      { id: 'int_downtown_core', name: 'Downtown Grand Ave & 4th', pos: new THREE.Vector3(0, 0, 0) },
      { id: 'int_harbor_entry', name: 'Harbor Gateway & Pier 9', pos: new THREE.Vector3(300, 0, -200) },
      { id: 'int_industrial_junction', name: 'Logistics Parkway & 12th', pos: new THREE.Vector3(-350, 0, 400) },
      { id: 'int_airport_boulevard', name: 'Terminal Way & Aviation Blvd', pos: new THREE.Vector3(500, 0, 500) },
    ];

    for (const data of defaultIntersections) {
      const ctrl = new IntersectionController({
        id: data.id,
        name: data.name,
        position: data.pos,
        radius: 28,
        hasLeftTurnPockets: true,
        hasPedestrianCrossings: true,
        phaseDurations: {
          greenDuration: 18,
          yellowDuration: 4,
          leftArrowDuration: 6,
          allRedDuration: 2.5,
        },
      });
      this.intersections.set(data.id, ctrl);
      this.scene.add(ctrl.group);
    }
  }

  /**
   * Main update loop called every frame
   */
  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerSpeed: number,
    isPlayerSirenActive: boolean = false
  ): void {
    // 1. Update all intersection controllers
    this.intersections.forEach((intersection) => {
      intersection.update(dt);
    });

    // 2. Spawn / Despawn lifecycle based on player proximity
    this.manageVehicleSpawning(dt, playerPos);

    // 3. Update physics and IDM decision-making for each active AI vehicle
    const vehicleList = Array.from(this.vehicles.values());

    for (const vehicle of vehicleList) {
      // Check distance to player for culling/despawning
      const distToPlayer = vehicle.position.distanceTo(playerPos);
      if (distToPlayer > this.config.despawnRadius) {
        this.despawnVehicle(vehicle.id);
        continue;
      }

      // Step A: Find leader and followers in current and adjacent lanes
      const surroundings = this.gatherLaneSurroundings(vehicle, vehicleList, playerPos, playerSpeed);

      // Step B: Check intersection signal status ahead
      let isStoppedByRedLight = false;
      let distToStopLine = Infinity;

      for (const [_, inter] of this.intersections) {
        const d = vehicle.position.distanceTo(inter.config.position);
        if (d < inter.config.radius * 1.5 && d > 3.0) {
          // Approaching this intersection
          const shouldStop = inter.queryShouldStop('north', d, vehicle.velocity);
          if (shouldStop) {
            isStoppedByRedLight = true;
            distToStopLine = Math.min(distToStopLine, d - 4.0);
          }
        }
      }

      // Step C: Emergency siren pullover reaction
      if (isPlayerSirenActive && distToPlayer < 60) {
        vehicle.targetLaneIndex = Math.min(vehicle.laneIndex + 1, 2); // Pull to shoulder/right lane
        vehicle.targetLateralOffset = 1.5;
      }

      // Step D: MOBIL Lane Change Decision
      if (
        !isStoppedByRedLight &&
        Math.random() < 0.05 && // Evaluate lane change periodically
        vehicle.lateralOffset === vehicle.targetLateralOffset
      ) {
        if (surroundings.leaderLeftLane || surroundings.followerLeftLane) {
          const evalLeft = IntelligentDriverModel.evaluateLaneChange(
            {
              id: vehicle.id,
              position: vehicle.position,
              velocity: vehicle.velocity,
              acceleration: vehicle.acceleration,
              heading: vehicle.yaw,
              length: vehicle.spec.length,
              width: vehicle.spec.width,
              laneId: vehicle.laneIndex,
              targetLaneId: vehicle.laneIndex - 1,
              laneOffset: vehicle.lateralOffset,
              laneProgress: vehicle.laneProgress,
              speedLimit: vehicle.speedLimit,
              isYielding: false,
              isBraking: vehicle.isBraking,
              isIndicatingLeft: vehicle.isIndicatingLeft,
              isIndicatingRight: vehicle.isIndicatingRight,
            },
            surroundings,
            'left',
            vehicle.idmParams
          );
          if (evalLeft.shouldChange && vehicle.laneIndex > 0) {
            vehicle.targetLaneIndex = vehicle.laneIndex - 1;
            vehicle.targetLateralOffset = (vehicle.targetLaneIndex - 1) * 3.5;
            vehicle.isIndicatingLeft = true;
            vehicle.isIndicatingRight = false;
          }
        }
      }

      // Step E: Longitudinal Acceleration (IDM)
      let effectiveLeaderDist = surroundings.leaderSameLane
        ? surroundings.leaderSameLane.distance
        : Infinity;
      let effectiveLeaderSpeed = surroundings.leaderSameLane
        ? surroundings.leaderSameLane.velocity
        : vehicle.velocity;

      if (isStoppedByRedLight && distToStopLine < effectiveLeaderDist) {
        effectiveLeaderDist = distToStopLine;
        effectiveLeaderSpeed = 0; // Virtual stopped vehicle at red light stop bar
      }

      const acc = IntelligentDriverModel.calculateAcceleration(
        vehicle.velocity,
        vehicle.speedLimit,
        effectiveLeaderDist,
        effectiveLeaderSpeed,
        vehicle.idmParams
      );

      vehicle.acceleration = acc;
      vehicle.velocity = Math.max(0, vehicle.velocity + acc * dt);
      vehicle.isBraking = acc < -0.6;

      // Step F: Lateral Lane Transition
      const latRes = IntelligentDriverModel.computeLateralTransition(
        vehicle.lateralOffset,
        vehicle.targetLateralOffset,
        dt,
        1.8
      );
      vehicle.lateralOffset = latRes.offset;
      if (latRes.isComplete) {
        vehicle.laneIndex = vehicle.targetLaneIndex;
        vehicle.isIndicatingLeft = false;
        vehicle.isIndicatingRight = false;
      }

      // Step G: Advance along road spline
      vehicle.laneProgress += vehicle.velocity * dt;
      const roadSplineSample = this.roadTopology.sampleRoadPoint(
        vehicle.roadSegmentId,
        vehicle.laneProgress,
        vehicle.laneIndex,
        vehicle.lateralOffset
      );

      if (roadSplineSample) {
        vehicle.position.copy(roadSplineSample.position);
        vehicle.yaw = roadSplineSample.yaw;
        vehicle.pitch = -acc * 0.015; // Suspension pitch under acceleration/braking
        vehicle.speedLimit = roadSplineSample.speedLimit;
      } else {
        // Reached end of road segment -> route to next connecting segment or despawn
        this.routeToNextRoadSegment(vehicle);
      }

      // Step H: Update 3D visual mesh & wheels
      vehicle.update(dt);
    }
  }

  private gatherLaneSurroundings(
    ego: TrafficVehicleInstance,
    allVehicles: TrafficVehicleInstance[],
    playerPos: THREE.Vector3,
    playerSpeed: number
  ): LaneSurroundings {
    const surroundings: LaneSurroundings = {};

    let minLeadDist = Infinity;
    let minFollowDist = Infinity;

    for (const other of allVehicles) {
      if (other.id === ego.id) continue;
      if (other.roadSegmentId !== ego.roadSegmentId) continue;

      const deltaS = other.laneProgress - ego.laneProgress;
      const netDist = Math.abs(deltaS) - (ego.spec.length + other.spec.length) * 0.5;

      if (other.laneIndex === ego.laneIndex) {
        if (deltaS > 0 && netDist < minLeadDist) {
          minLeadDist = netDist;
          surroundings.leaderSameLane = {
            distance: netDist,
            velocity: other.velocity,
            length: other.spec.length,
            id: other.id,
          };
        } else if (deltaS < 0 && Math.abs(deltaS) < minFollowDist) {
          minFollowDist = netDist;
          surroundings.followerSameLane = {
            distance: netDist,
            velocity: other.velocity,
            length: other.spec.length,
            id: other.id,
          };
        }
      }
    }

    // Check player vehicle as a potential leader in same lane
    const distToPlayer = ego.position.distanceTo(playerPos);
    if (distToPlayer < 80) {
      const headingVec = new THREE.Vector3(Math.sin(ego.yaw), 0, Math.cos(ego.yaw));
      const toPlayerVec = playerPos.clone().sub(ego.position);
      const forwardDot = headingVec.dot(toPlayerVec);

      if (forwardDot > 0 && (!surroundings.leaderSameLane || forwardDot < surroundings.leaderSameLane.distance)) {
        surroundings.leaderSameLane = {
          distance: Math.max(0.5, forwardDot - 4.5),
          velocity: playerSpeed,
          length: 4.8,
          id: 'player',
        };
      }
    }

    return surroundings;
  }

  private manageVehicleSpawning(dt: number, playerPos: THREE.Vector3): void {
    if (this.vehicles.size >= this.config.maxVehicles) return;

    this.spawnTimer += dt;
    if (this.spawnTimer < 1.2 / Math.max(0.1, this.config.trafficDensity)) return;
    this.spawnTimer = 0;

    // Pick random road segment in front of or behind player
    const randomSegment = this.roadTopology.getRandomRoadSegmentNear(
      playerPos,
      this.config.spawnRadius
    );
    if (!randomSegment) return;

    const vehicleTypes: TrafficVehicleType[] = [
      'compact_hatchback',
      'executive_sedan',
      'suv_crossover',
      'semi_truck',
      'city_bus',
      'delivery_van',
      'supercar',
      'muscle_car',
      'electric_ev',
    ];
    const pickedType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];

    const id = `veh_${++this.vehicleCounter}`;
    const vehicle = new TrafficVehicleInstance(id, pickedType);

    const laneIndex = Math.floor(Math.random() * (randomSegment.lanesCount || 2));
    vehicle.roadSegmentId = randomSegment.id;
    vehicle.laneIndex = laneIndex;
    vehicle.targetLaneIndex = laneIndex;
    vehicle.laneProgress = Math.random() * randomSegment.length;
    vehicle.velocity = (randomSegment.speedLimit || 22.2) * (0.8 + Math.random() * 0.3);

    const sample = this.roadTopology.sampleRoadPoint(
      vehicle.roadSegmentId,
      vehicle.laneProgress,
      vehicle.laneIndex,
      0
    );
    if (sample) {
      vehicle.position.copy(sample.position);
      vehicle.yaw = sample.yaw;
      vehicle.speedLimit = sample.speedLimit;
      vehicle.group.position.copy(vehicle.position);
      vehicle.group.rotation.y = vehicle.yaw;

      this.vehicles.set(id, vehicle);
      this.scene.add(vehicle.group);
    }
  }

  private routeToNextRoadSegment(vehicle: TrafficVehicleInstance): void {
    const nextSeg = this.roadTopology.getNextSegment(vehicle.roadSegmentId);
    if (nextSeg) {
      vehicle.roadSegmentId = nextSeg.id;
      vehicle.laneProgress = 0;
    } else {
      this.despawnVehicle(vehicle.id);
    }
  }

  public despawnVehicle(id: string): void {
    const veh = this.vehicles.get(id);
    if (veh) {
      this.scene.remove(veh.group);
      veh.dispose();
      this.vehicles.delete(id);
    }
  }

  public clearAll(): void {
    this.vehicles.forEach((v) => {
      this.scene.remove(v.group);
      v.dispose();
    });
    this.vehicles.clear();
  }
}
