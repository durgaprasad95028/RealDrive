import * as THREE from 'three';

export interface TreeInstanceData {
  position: THREE.Vector3;
  scale: number;
  rotationY: number;
  treeType: 'OAK' | 'PINE' | 'PALM' | 'BUSH';
}

export class VegetationSystem {
  private trunkMaterial: THREE.MeshStandardMaterial;
  private oakCanopyMaterial: THREE.MeshStandardMaterial;
  private pineCanopyMaterial: THREE.MeshStandardMaterial;
  private palmLeafMaterial: THREE.MeshStandardMaterial;
  private bushMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.9,
    });

    this.oakCanopyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e7d32,
      roughness: 0.85,
    });

    this.pineCanopyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b4d3e,
      roughness: 0.9,
    });

    this.palmLeafMaterial = new THREE.MeshStandardMaterial({
      color: 0x388e3c,
      roughness: 0.75,
    });

    this.bushMaterial = new THREE.MeshStandardMaterial({
      color: 0x4caf50,
      roughness: 0.88,
    });
  }

  /**
   * Builds an individual Oak Tree.
   */
  public createOakTree(pos: THREE.Vector3, scale = 1.0): THREE.Group {
    const tree = new THREE.Group();
    tree.position.copy(pos);
    tree.scale.set(scale, scale, scale);

    // Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 3.5, 8);
    const trunk = new THREE.Mesh(trunkGeom, this.trunkMaterial);
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    tree.add(trunk);

    // Rounded Canopy (3 overlapping spheres)
    const crown1Geom = new THREE.SphereGeometry(2.2, 8, 8);
    const crown1 = new THREE.Mesh(crown1Geom, this.oakCanopyMaterial);
    crown1.position.set(0, 4.2, 0);
    crown1.castShadow = true;
    tree.add(crown1);

    const crown2 = new THREE.Mesh(crown1Geom, this.oakCanopyMaterial);
    crown2.position.set(0.8, 5.0, 0.4);
    crown2.scale.set(0.85, 0.85, 0.85);
    crown2.castShadow = true;
    tree.add(crown2);

    return tree;
  }

  /**
   * Builds a high-elevation Mountain Pine Tree.
   */
  public createPineTree(pos: THREE.Vector3, scale = 1.0): THREE.Group {
    const pine = new THREE.Group();
    pine.position.copy(pos);
    pine.scale.set(scale, scale, scale);

    // Slender Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.2, 0.35, 4.5, 8);
    const trunk = new THREE.Mesh(trunkGeom, this.trunkMaterial);
    trunk.position.y = 2.25;
    trunk.castShadow = true;
    pine.add(trunk);

    // 3 Conical Needles Tiers
    const tierHeights = [3.5, 5.2, 6.6];
    const tierRadii = [2.2, 1.7, 1.1];

    for (let i = 0; i < 3; i++) {
      const coneGeom = new THREE.ConeGeometry(tierRadii[i], 2.2, 8);
      const cone = new THREE.Mesh(coneGeom, this.pineCanopyMaterial);
      cone.position.y = tierHeights[i];
      cone.castShadow = true;
      pine.add(cone);
    }

    return pine;
  }

  /**
   * Builds a Coastal / Boulevard Palm Tree.
   */
  public createPalmTree(pos: THREE.Vector3, scale = 1.0): THREE.Group {
    const palm = new THREE.Group();
    palm.position.copy(pos);
    palm.scale.set(scale, scale, scale);

    // Tall Curved Trunk (Height: 8.5m)
    const trunkGeom = new THREE.CylinderGeometry(0.18, 0.32, 8.5, 8);
    const trunk = new THREE.Mesh(trunkGeom, this.trunkMaterial);
    trunk.position.set(0.4, 4.25, 0);
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    palm.add(trunk);

    // Palm Fronds Crown
    const frondCount = 7;
    const leafGeom = new THREE.ConeGeometry(0.8, 4.0, 4);

    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2;
      const leaf = new THREE.Mesh(leafGeom, this.palmLeafMaterial);
      leaf.position.set(0.8, 8.5, 0);
      leaf.rotation.y = angle;
      leaf.rotation.x = Math.PI / 3.2;
      leaf.castShadow = true;
      palm.add(leaf);
    }

    return palm;
  }

  /**
   * Builds a roadside Bush / Median Shrub.
   */
  public createBush(pos: THREE.Vector3, scale = 1.0): THREE.Group {
    const bush = new THREE.Group();
    bush.position.copy(pos);
    bush.scale.set(scale, scale, scale);

    const bushGeom = new THREE.DodecahedronGeometry(0.9, 1);
    const bushMesh = new THREE.Mesh(bushGeom, this.bushMaterial);
    bushMesh.position.y = 0.7;
    bushMesh.castShadow = true;
    bush.add(bushMesh);

    return bush;
  }
}

export const vegetationSystem = new VegetationSystem();
