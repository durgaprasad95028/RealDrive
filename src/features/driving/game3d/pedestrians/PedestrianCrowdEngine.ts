import * as THREE from 'three';

export type PedestrianArchetype =
  | 'business_executive'
  | 'tourist'
  | 'jogger'
  | 'shopper'
  | 'student'
  | 'courier';

export type PedestrianState = 'walking' | 'jogging' | 'waiting_crosswalk' | 'crossing' | 'fleeing' | 'idle';

export interface PedestrianInstance {
  id: string;
  archetype: PedestrianArchetype;
  state: PedestrianState;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  heading: number;
  walkSpeed: number; // m/s (e.g. 1.3 for walk, 3.2 for jog, 5.0 for flee)
  group: THREE.Group;

  // Animation nodes
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Mesh;

  // Animation state
  animTimer: number;
  panicTimer: number;
}

export class PedestrianCrowdEngine {
  private scene: THREE.Scene;
  private pedestrians: Map<string, PedestrianInstance> = new Map();
  private maxPedestrians: number;
  private spawnRadius: number;
  private despawnRadius: number;
  private counter: number = 0;
  private spawnTimer: number = 0;

  // Sidewalk spawn waypoints across districts
  private sidewalkWaypoints: THREE.Vector3[] = [];

  constructor(scene: THREE.Scene, maxPedestrians: number = 35) {
    this.scene = scene;
    this.maxPedestrians = maxPedestrians;
    this.spawnRadius = 160;
    this.despawnRadius = 220;

    this.initializeSidewalkWaypoints();
  }

  private initializeSidewalkWaypoints(): void {
    // Generate perimeter sidewalk waypoints around Downtown, Harbor, Commercial, and Suburbs
    for (let z = -1200; z <= 1200; z += 40) {
      this.sidewalkWaypoints.push(new THREE.Vector3(-12, 0, z)); // West sidewalk of central spine
      this.sidewalkWaypoints.push(new THREE.Vector3(12, 0, z)); // East sidewalk of central spine
    }
    for (let x = -600; x <= 600; x += 40) {
      this.sidewalkWaypoints.push(new THREE.Vector3(x, 0, 10));
      this.sidewalkWaypoints.push(new THREE.Vector3(x, 0, -10));
    }
  }

  private buildPedestrianMesh(archetype: PedestrianArchetype): {
    group: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  } {
    const root = new THREE.Group();

    // Archetype color palettes
    const palette: Record<PedestrianArchetype, { shirt: number; pants: number; skin: number }> = {
      business_executive: { shirt: 0x1c2833, pants: 0x2c3e50, skin: 0xf5cba7 },
      tourist: { shirt: 0xe67e22, pants: 0x34495e, skin: 0xedbb99 },
      jogger: { shirt: 0x2ecc71, pants: 0x111111, skin: 0xf0b27a },
      shopper: { shirt: 0x9b59b6, pants: 0xd5dbdb, skin: 0xfadbd8 },
      student: { shirt: 0x3498db, pants: 0x1b2631, skin: 0xf5b7b1 },
      courier: { shirt: 0xf39c12, pants: 0x212f3d, skin: 0xdc7633 },
    };

    const colors = palette[archetype];

    const skinMat = new THREE.MeshStandardMaterial({ color: colors.skin, roughness: 0.7 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: colors.shirt, roughness: 0.8 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: colors.pants, roughness: 0.85 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    // Head (radius 0.12m at Y=1.65)
    const headGeo = new THREE.SphereGeometry(0.12, 12, 10);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 1.65, 0);
    head.castShadow = true;
    root.add(head);

    // Torso (0.35m wide, 0.55m tall, 0.22m deep)
    const torsoGeo = new THREE.BoxGeometry(0.35, 0.55, 0.22);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.set(0, 1.25, 0);
    torso.castShadow = true;
    root.add(torso);

    // Left Arm (pivot at shoulder Y=1.45, X=-0.22)
    const armGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.23, 1.45, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.position.set(0, -0.22, 0);
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);
    root.add(leftArm);

    // Right Arm (pivot at shoulder Y=1.45, X=+0.22)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.23, 1.45, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.position.set(0, -0.22, 0);
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);
    root.add(rightArm);

    // Left Leg (pivot at hip Y=0.95, X=-0.11)
    const legGeo = new THREE.BoxGeometry(0.13, 0.85, 0.14);
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.11, 0.95, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.set(0, -0.42, 0);
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);

    // Shoe
    const shoeGeo = new THREE.BoxGeometry(0.13, 0.08, 0.22);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.84, 0.04);
    leftLeg.add(leftShoe);
    root.add(leftLeg);

    // Right Leg (pivot at hip Y=0.95, X=+0.11)
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.11, 0.95, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.set(0, -0.42, 0);
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.84, 0.04);
    rightLeg.add(rightShoe);
    root.add(rightLeg);

    return { group: root, leftArm, rightArm, leftLeg, rightLeg, torso, head };
  }

  public update(dt: number, playerPos: THREE.Vector3, playerVelocity: number): void {
    // 1. Spawning / Despawning
    this.spawnTimer += dt;
    if (this.spawnTimer > 1.0 && this.pedestrians.size < this.maxPedestrians) {
      this.spawnTimer = 0;
      this.spawnPedestrianNear(playerPos);
    }

    // 2. Update each pedestrian
    this.pedestrians.forEach((ped, id) => {
      const distToPlayer = ped.position.distanceTo(playerPos);

      // Despawn if too far
      if (distToPlayer > this.despawnRadius) {
        this.despawnPedestrian(id);
        return;
      }

      // Evade / Flee AI if player is speeding dangerously close (< 18m)
      if (distToPlayer < 18 && playerVelocity > 8.0) {
        ped.state = 'fleeing';
        ped.panicTimer = 3.0; // Stay in panic for 3 seconds
        ped.walkSpeed = 5.2; // Sprint away

        // Vector away from player
        const fleeVec = new THREE.Vector3().subVectors(ped.position, playerPos).normalize();
        ped.targetPosition.copy(ped.position).addScaledVector(fleeVec, 15);
      } else if (ped.panicTimer > 0) {
        ped.panicTimer -= dt;
        if (ped.panicTimer <= 0) {
          ped.state = ped.archetype === 'jogger' ? 'jogging' : 'walking';
          ped.walkSpeed = ped.archetype === 'jogger' ? 3.2 : 1.35;
        }
      }

      // Movement Kinematics
      const toTarget = new THREE.Vector3().subVectors(ped.targetPosition, ped.position);
      toTarget.y = 0;
      const distToTarget = toTarget.length();

      if (distToTarget < 1.0) {
        // Pick new random sidewalk waypoint
        this.pickNewTargetWaypoint(ped, playerPos);
      } else {
        toTarget.normalize();
        ped.velocity.copy(toTarget).multiplyScalar(ped.walkSpeed);
        ped.position.addScaledVector(ped.velocity, dt);

        // Heading yaw
        ped.heading = Math.atan2(toTarget.x, toTarget.z);
      }

      // Sync 3D group transform
      ped.group.position.copy(ped.position);
      ped.group.rotation.y = ped.heading;

      // Skeletal Walk / Run Cycle Animation
      const animSpeedMultiplier = ped.state === 'fleeing' ? 14 : ped.state === 'jogging' ? 9 : 5.5;
      ped.animTimer += dt * animSpeedMultiplier;

      const swingAngle = Math.sin(ped.animTimer) * (ped.state === 'fleeing' ? 0.85 : 0.55);

      ped.leftArm.rotation.x = -swingAngle;
      ped.rightArm.rotation.x = swingAngle;
      ped.leftLeg.rotation.x = swingAngle;
      ped.rightLeg.rotation.x = -swingAngle;

      // Subtle vertical bobbing
      const bob = Math.abs(Math.sin(ped.animTimer)) * 0.04;
      ped.torso.position.y = 1.25 + bob;
      ped.head.position.y = 1.65 + bob;
    });
  }

  private spawnPedestrianNear(playerPos: THREE.Vector3): void {
    // Find sidewalk points within spawn radius
    const candidates = this.sidewalkWaypoints.filter((wp) => {
      const d = wp.distanceTo(playerPos);
      return d > 30 && d < this.spawnRadius;
    });

    if (candidates.length === 0) return;

    const startPoint = candidates[Math.floor(Math.random() * candidates.length)];
    const archetypes: PedestrianArchetype[] = [
      'business_executive',
      'tourist',
      'jogger',
      'shopper',
      'student',
      'courier',
    ];
    const pickedArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];

    const id = `ped_${++this.counter}`;
    const meshData = this.buildPedestrianMesh(pickedArchetype);

    const isJogger = pickedArchetype === 'jogger';
    const ped: PedestrianInstance = {
      id,
      archetype: pickedArchetype,
      state: isJogger ? 'jogging' : 'walking',
      position: startPoint.clone(),
      targetPosition: startPoint.clone().add(new THREE.Vector3(0, 0, (Math.random() > 0.5 ? 1 : -1) * 80)),
      velocity: new THREE.Vector3(),
      heading: 0,
      walkSpeed: isJogger ? 3.2 : 1.35,
      group: meshData.group,
      leftArm: meshData.leftArm,
      rightArm: meshData.rightArm,
      leftLeg: meshData.leftLeg,
      rightLeg: meshData.rightLeg,
      torso: meshData.torso,
      head: meshData.head,
      animTimer: Math.random() * Math.PI * 2,
      panicTimer: 0,
    };

    ped.group.position.copy(ped.position);
    this.pedestrians.set(id, ped);
    this.scene.add(ped.group);
  }

  private pickNewTargetWaypoint(ped: PedestrianInstance, playerPos: THREE.Vector3): void {
    const candidates = this.sidewalkWaypoints.filter((wp) => {
      const d = wp.distanceTo(ped.position);
      return d > 20 && d < 120;
    });

    if (candidates.length > 0) {
      ped.targetPosition.copy(candidates[Math.floor(Math.random() * candidates.length)]);
    } else {
      // Step forward
      ped.targetPosition.set(ped.position.x, ped.position.y, ped.position.z + 50);
    }
  }

  public despawnPedestrian(id: string): void {
    const ped = this.pedestrians.get(id);
    if (ped) {
      this.scene.remove(ped.group);
      ped.group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      this.pedestrians.delete(id);
    }
  }

  public clearAll(): void {
    this.pedestrians.forEach((_, id) => this.despawnPedestrian(id));
  }
}
