import * as THREE from 'three';
import { TimeOfDay, WeatherType } from '../types';

export class WeatherSystem {
  private scene: THREE.Scene;
  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemisphereLight: THREE.HemisphereLight;
  private rainParticles?: THREE.Points;
  private rainCount = 2500;

  constructor(
    scene: THREE.Scene,
    sunLight: THREE.DirectionalLight,
    ambientLight: THREE.AmbientLight,
    hemisphereLight: THREE.HemisphereLight
  ) {
    this.scene = scene;
    this.sunLight = sunLight;
    this.ambientLight = ambientLight;
    this.hemisphereLight = hemisphereLight;

    this.initRainParticles();
  }

  private initRainParticles() {
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 3);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x90e0ef,
      size: 0.15,
      transparent: true,
      opacity: 0.65,
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  public applyWeatherAndTime(weather: WeatherType, timeOfDay: TimeOfDay) {
    // 1. Time of Day Lighting
    switch (timeOfDay) {
      case 'morning':
        this.scene.background = new THREE.Color(0xa0c4e2);
        this.ambientLight.color.setHex(0x667788);
        this.ambientLight.intensity = 0.8;
        this.hemisphereLight.color.setHex(0xffeedd);
        this.sunLight.color.setHex(0xffdfba);
        this.sunLight.intensity = 1.4;
        this.sunLight.position.set(40, 30, -50);
        break;

      case 'sunset':
        this.scene.background = new THREE.Color(0x3d1b38);
        this.ambientLight.color.setHex(0x3a1c28);
        this.ambientLight.intensity = 0.6;
        this.hemisphereLight.color.setHex(0xff70a6);
        this.sunLight.color.setHex(0xff9f1c);
        this.sunLight.intensity = 1.6;
        this.sunLight.position.set(-60, 15, -40);
        break;

      case 'night':
        this.scene.background = new THREE.Color(0x050811);
        this.ambientLight.color.setHex(0x0a1128);
        this.ambientLight.intensity = 0.25;
        this.hemisphereLight.color.setHex(0x1c2541);
        this.sunLight.color.setHex(0x4361ee);
        this.sunLight.intensity = 0.2;
        this.sunLight.position.set(20, 50, 20);
        break;

      case 'afternoon':
      default:
        this.scene.background = new THREE.Color(0x6ba4d8);
        this.ambientLight.color.setHex(0x778899);
        this.ambientLight.intensity = 1.0;
        this.hemisphereLight.color.setHex(0xffffff);
        this.sunLight.color.setHex(0xffffff);
        this.sunLight.intensity = 2.0;
        this.sunLight.position.set(50, 60, 40);
        break;
    }

    // 2. Weather Effects & Fog
    if (weather === 'fog') {
      this.scene.fog = new THREE.FogExp2(0x94a3b8, 0.018);
      if (this.rainParticles) this.rainParticles.visible = false;
    } else if (weather === 'rain' || weather === 'heavy_rain') {
      this.scene.fog = new THREE.FogExp2(0x475569, 0.012);
      if (this.rainParticles) {
        this.rainParticles.visible = true;
        (this.rainParticles.material as THREE.PointsMaterial).size = weather === 'heavy_rain' ? 0.25 : 0.15;
      }
    } else {
      // Sunny / Clear
      this.scene.fog = new THREE.Fog(0x6ba4d8, 150, 450);
      if (this.rainParticles) this.rainParticles.visible = false;
    }
  }

  public update(dt: number, playerPos: THREE.Vector3) {
    if (this.rainParticles && this.rainParticles.visible) {
      // Move rain system around player
      this.rainParticles.position.x = playerPos.x;
      this.rainParticles.position.z = playerPos.z;

      const posAttr = this.rainParticles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < this.rainCount; i++) {
        // Fall downwards
        arr[i * 3 + 1] -= 38 * dt;
        if (arr[i * 3 + 1] < 0) {
          arr[i * 3 + 1] = 30 + Math.random() * 5;
        }
      }
      posAttr.needsUpdate = true;
    }
  }
}
