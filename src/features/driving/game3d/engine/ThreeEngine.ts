import * as THREE from 'three';
import { CameraMode, GameTelemetry, NavigationInstruction, TimeOfDay, WeatherType, AITrafficVehicle } from '../types';
import { VehicleModelBuilder, VehicleModelBundle } from './VehicleModelBuilder';
import { WorldBuilder, WorldBundle } from './WorldBuilder';
import { PhysicsVehicle } from './PhysicsVehicle';
import { TrafficDirector } from './TrafficDirector';
import { WeatherSystem } from './WeatherSystem';
import { NavigationSystem } from './NavigationSystem';
import { districtManager } from '../world/DistrictManager';
import { PedestrianCrowdEngine } from '../pedestrians/PedestrianCrowdEngine';
import { PolicePursuitEngine } from '../police/PolicePursuitEngine';
import { WebAudioEngine, EngineSoundProfile } from '../audio/WebAudioEngine';

export class ThreeEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemisphereLight: THREE.HemisphereLight;

  private playerBundle: VehicleModelBundle;
  public playerPhysics: PhysicsVehicle;
  private trafficDirector: TrafficDirector;
  public pedestrianEngine: PedestrianCrowdEngine;
  public policeEngine: PolicePursuitEngine;
  public audioEngine: WebAudioEngine;
  private worldBundle: WorldBundle;
  private weatherSystem: WeatherSystem;
  private navigationSystem: NavigationSystem;

  private isRunning = false;
  private lastTime = 0;
  private reqId: number | null = null;

  // Input states
  public input = {
    throttle: 0,
    brake: 0,
    steer: 0,
    handbrake: false,
  };

  // Telemetry callback
  public onTelemetryUpdate?: (telemetry: GameTelemetry, nav: NavigationInstruction) => void;
  public onMissionCompleteCallback?: () => void;
  public onViolationCallback?: (reason: string) => void;

  private violations = 0;
  private missionCompleted = false;
  private gameTime = 0;
  private vehicleCategory: string = 'sports';

  constructor(canvas: HTMLCanvasElement, paintColor = 0x0066ff, category: string = 'sports') {
    this.canvas = canvas;
    this.vehicleCategory = category;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 2. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70, // 70 degree FOV for natural driver field-of-view
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );

    // 3. Lighting Setup
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x334455, 0.8);
    this.scene.add(this.hemisphereLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.sunLight.position.set(50, 70, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 400;
    const d = 100;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // 4. Build 3D City World
    this.worldBundle = WorldBuilder.buildCityWorld(this.scene);

    // 5. Build Player Vehicle
    this.playerBundle = VehicleModelBuilder.createPlayerVehicle(paintColor, category);
    this.scene.add(this.playerBundle.root);
    this.playerPhysics = new PhysicsVehicle(this.playerBundle, new THREE.Vector3(2.2, 0, 0), category);

    // 6. Build AI Traffic System
    this.trafficDirector = new TrafficDirector(this.scene);

    // 7. Build Pedestrian Crowd, Police Pursuit and Audio Engines
    this.pedestrianEngine = new PedestrianCrowdEngine(this.scene, 35);
    this.policeEngine = new PolicePursuitEngine(this.scene);
    
    let soundProfile: EngineSoundProfile = 'V8_AMERICAN_MUSCLE';
    if (category.includes('truck')) soundProfile = 'HEAVY_DIESEL_TRUCK';
    else if (category.includes('supercar')) soundProfile = 'V10_HIGH_REV_SUPERCAR';
    else if (category.includes('compact') || category.includes('hatchback')) soundProfile = 'INLINE_4_TUNER';
    
    this.audioEngine = new WebAudioEngine(soundProfile);

    // 8. Weather & Navigation Systems
    this.weatherSystem = new WeatherSystem(this.scene, this.sunLight, this.ambientLight, this.hemisphereLight);
    this.weatherSystem.applyWeatherAndTime('sunny', 'afternoon');

    this.navigationSystem = new NavigationSystem(this.worldBundle.waypoints, this.worldBundle.roadSegments);

    // Window resize handler
    window.addEventListener('resize', this.onWindowResize);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.audioEngine.initialize();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.reqId) {
      cancelAnimationFrame(this.reqId);
      this.reqId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05); // cap delta time
    this.lastTime = now;
    this.gameTime += dt;

    this.update(dt);
    this.render();

    this.reqId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // 1. Update Traffic Signal Cycles
    this.updateTrafficSignals(dt);

    // 2. Update Player Vehicle Physics
    this.playerPhysics.update(
      dt,
      this.input,
      this.trafficDirector.vehicles,
      this.worldBundle.collidableMeshes
    );

    // 3. Update Audio Synthesizer
    const pState = this.playerPhysics.state;
    this.audioEngine.update(
      pState.rpm,
      this.input.throttle,
      pState.speedKmh,
      Math.abs(pState.steeringAngle) * (Math.abs(pState.speedKmh) / 80),
      this.playerPhysics.engine.getTelemetry().boostPressureBar * 14.5038,
      this.policeEngine.status.isPursuitActive
    );

    // 4. Update AI Traffic with opposite-lane and signal awareness
    const playerPos = this.playerBundle.root.position;
    this.trafficDirector.update(dt, playerPos, this.worldBundle.trafficSignals);

    // 5. Update Pedestrian Crowd
    this.pedestrianEngine.update(
      dt,
      playerPos,
      Math.abs(this.playerPhysics.state.speedKmh) / 3.6
    );

    // 6. Update Police Pursuit Engine
    const pursuitResult = this.policeEngine.update(
      dt,
      playerPos,
      this.playerPhysics.velocity,
      Math.abs(this.playerPhysics.state.speedKmh)
    );

    if (pursuitResult.isBusted) {
      this.violations += 3;
      if (this.onViolationCallback) {
        this.onViolationCallback('BUSTED BY POLICE — Vehicle Impounded & Fined');
      }
    }

    // 7. Update Weather particles
    this.weatherSystem.update(dt, playerPos);

    // 8. Update Navigation & Destination Check
    const navResult = this.navigationSystem.update(playerPos);

    // 9. Check destination mission completion
    if (navResult.isDestinationReached && !this.missionCompleted) {
      this.missionCompleted = true;
      if (this.onMissionCompleteCallback) {
        this.onMissionCompleteCallback();
      }
    }

    // 10. Check red light and radar speed violations
    this.checkRedLightViolations(playerPos);
    this.checkSpeedRadarTraps(playerPos);

    // 11. Update Camera Position (Driver 1st-Person vs 3rd-Person)
    this.updateCamera();

    // 12. Update Dynamic District Atmosphere & Lighting
    const currentDistrict = districtManager.updateAtmosphere(playerPos, this.scene, this.sunLight, this.ambientLight);

    // 10. Update Sunlight Position to follow player
    this.sunLight.position.set(playerPos.x + 50, 70, playerPos.z + 40);
    this.sunLight.target.position.copy(playerPos);

    // 11. Broadcast Telemetry to UI HUD
    if (this.onTelemetryUpdate) {
      const pState = this.playerPhysics.state;
      const telemetry: GameTelemetry = {
        speedKmh: pState.speedKmh,
        rpm: pState.rpm,
        gear: pState.gear.toString(),
        fuelPercent: Math.max(0, Math.round(pState.fuelPercent)),
        vehicleHealth: Math.max(0, Math.round(pState.healthPercent)),
        speedLimit: currentDistrict.environment.baseSpeedLimitKmH,
        distanceRemaining: navResult.distanceToDestination,
        destinationName: 'Airport International Terminal',
        currentStreet: `${currentDistrict.name} • ${navResult.currentStreet}`,
        timeElapsed: Math.round(this.gameTime),
        headlightsOn: pState.headlights,
        blinkerLeft: pState.blinkerLeft,
        blinkerRight: pState.blinkerRight,
        cameraMode: pState.cameraMode,
        violations: this.violations,
        weather: 'sunny',
        timeOfDay: 'afternoon',
        isPaused: false,
        isMissionComplete: this.missionCompleted,
        score: Math.max(0, 100 - this.violations * 15 - (100 - pState.healthPercent)),
        cashEarned: 350,
        xpEarned: 180,
      };

      this.onTelemetryUpdate(telemetry, navResult.instruction);
    }
  }

  private updateTrafficSignals(dt: number) {
    for (const sig of this.worldBundle.trafficSignals) {
      sig.timer += dt;

      if (sig.state === 'green' && sig.timer >= sig.greenDuration) {
        sig.state = 'yellow';
        sig.timer = 0;
        this.setSignalVisuals(sig, 0x440000, 0xffb703, 0x004400);
      } else if (sig.state === 'yellow' && sig.timer >= sig.yellowDuration) {
        sig.state = 'red';
        sig.timer = 0;
        this.setSignalVisuals(sig, 0xff1100, 0x443300, 0x004400);
      } else if (sig.state === 'red' && sig.timer >= sig.redDuration) {
        sig.state = 'green';
        sig.timer = 0;
        this.setSignalVisuals(sig, 0x440000, 0x443300, 0x00ff44);
      }
    }
  }

  private setSignalVisuals(sig: any, redColor: number, yellowColor: number, greenColor: number) {
    (sig.redLightMesh.material as THREE.MeshBasicMaterial).color.setHex(redColor);
    (sig.yellowLightMesh.material as THREE.MeshBasicMaterial).color.setHex(yellowColor);
    (sig.greenLightMesh.material as THREE.MeshBasicMaterial).color.setHex(greenColor);
  }

  private checkRedLightViolations(playerPos: THREE.Vector3) {
    for (const sig of this.worldBundle.trafficSignals) {
      if (sig.state === 'red') {
        // If player speeds through red light crosswalk zone (within 4m of signal)
        const dist = playerPos.distanceTo(sig.position);
        if (dist < 5.5 && Math.abs(this.playerPhysics.state.speedKmh) > 20) {
          this.violations++;
          this.policeEngine.reportInfraction(
            'RED_LIGHT_VIOLATION',
            'Crossed intersection against solid red traffic signal',
            250,
            45
          );
          if (this.onViolationCallback) {
            this.onViolationCallback('Red Light Traffic Signal Violation ($250 Fine + Wanted Heat)');
          }
          break;
        }
      }
    }
  }

  private checkSpeedRadarTraps(playerPos: THREE.Vector3) {
    const currentDistrict = districtManager.getDistrictAtPosition(playerPos.x, playerPos.z);
    const speedLimit = currentDistrict.environment.baseSpeedLimitKmH;
    const currentSpeed = Math.abs(this.playerPhysics.state.speedKmh);

    if (currentSpeed > speedLimit + 25) {
      // 10% chance per frame to get clocked by photo radar trap if exceeding speed limit
      if (Math.random() < 0.005) {
        this.violations++;
        this.policeEngine.reportInfraction(
          'SPEEDING_RADAR',
          `Automated speed radar trap clocked ${Math.round(currentSpeed)} km/h in a ${speedLimit} km/h zone`,
          350,
          35
        );
        if (this.onViolationCallback) {
          this.onViolationCallback(`Speed Radar Violation: ${Math.round(currentSpeed)} km/h in ${speedLimit} km/h zone ($350 Fine)`);
        }
      }
    }
  }

  private updateCamera() {
    const pState = this.playerPhysics.state;
    const carPos = this.playerBundle.root.position;
    const carRot = this.playerBundle.root.rotation.y;

    const cat = this.vehicleCategory.toLowerCase();
    let driverOffset = new THREE.Vector3(-0.38, 1.18, -0.05);
    let chaseOffset = new THREE.Vector3(0, 2.6, -6.8);

    if (cat.includes('bus')) {
      driverOffset = new THREE.Vector3(-0.65, 2.0, 3.2);
      chaseOffset = new THREE.Vector3(0, 4.5, -12.0);
    } else if (cat.includes('truck')) {
      driverOffset = new THREE.Vector3(-0.6, 1.9, 1.8);
      chaseOffset = new THREE.Vector3(0, 4.0, -10.0);
    } else if (cat.includes('suv') || cat.includes('utility')) {
      driverOffset = new THREE.Vector3(-0.42, 1.35, -0.1);
      chaseOffset = new THREE.Vector3(0, 3.0, -7.5);
    } else if (cat.includes('compact') || cat.includes('hatchback')) {
      driverOffset = new THREE.Vector3(-0.35, 1.15, -0.05);
      chaseOffset = new THREE.Vector3(0, 2.4, -6.2);
    }

    if (pState.cameraMode === 'first_person') {
      // FIRST-PERSON DRIVER'S COCKPIT VIEW
      const worldDriverOffset = driverOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), carRot);

      this.camera.position.set(
        carPos.x + worldDriverOffset.x,
        carPos.y + worldDriverOffset.y,
        carPos.z + worldDriverOffset.z
      );

      // Look forward through windshield with slight lateral gaze when steering
      const lookDist = 45;
      const lookTarget = new THREE.Vector3(
        carPos.x + Math.sin(carRot + pState.steeringAngle * 0.25) * lookDist,
        carPos.y + driverOffset.y * 0.9,
        carPos.z + Math.cos(carRot + pState.steeringAngle * 0.25) * lookDist
      );

      this.camera.lookAt(lookTarget);
    } else {
      // THIRD-PERSON CHASE CAMERA VIEW
      const worldChaseOffset = chaseOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), carRot);

      this.camera.position.lerp(
        new THREE.Vector3(
          carPos.x + worldChaseOffset.x,
          carPos.y + worldChaseOffset.y,
          carPos.z + worldChaseOffset.z
        ),
        0.18
      );

      const lookTarget = new THREE.Vector3(
        carPos.x + Math.sin(carRot) * 12,
        carPos.y + 1.2,
        carPos.z + Math.cos(carRot) * 12
      );

      this.camera.lookAt(lookTarget);
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public setWeatherAndTime(weather: WeatherType, timeOfDay: TimeOfDay) {
    this.weatherSystem.applyWeatherAndTime(weather, timeOfDay);
  }

  public toggleCamera() {
    const nextMode = this.playerPhysics.state.cameraMode === 'first_person' ? 'third_person' : 'first_person';
    this.playerPhysics.setCameraMode(nextMode);
  }

  public toggleHeadlights() {
    const nextState = !this.playerPhysics.state.headlights;
    this.playerPhysics.state.headlights = nextState;
    this.playerBundle.headlights.forEach((spot) => {
      spot.intensity = nextState ? 40 : 0;
    });
    this.playerBundle.headlightMeshes.forEach((hl) => {
      (hl.material as THREE.MeshBasicMaterial).color.setHex(nextState ? 0xffffff : 0x222222);
    });
  }

  public toggleTimeOfDay() {
    const times: TimeOfDay[] = ['afternoon', 'sunset', 'night', 'morning'];
    const currentIdx = times.indexOf(this.playerPhysics.state.cameraMode as any) || 0;
    const nextTime = times[(currentIdx + 1) % times.length];
    this.weatherSystem.applyWeatherAndTime('sunny', nextTime);
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  public getPlayerPosition(): THREE.Vector3 {
    return this.playerBundle.root.position;
  }

  public getTrafficVehicles(): AITrafficVehicle[] {
    return this.trafficDirector.vehicles;
  }

  public dispose() {
    this.stop();
    this.audioEngine.dispose();
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }
}
