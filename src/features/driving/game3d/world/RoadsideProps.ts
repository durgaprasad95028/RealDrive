import * as THREE from 'three';

export class RoadsideProps {
  private poleMaterial: THREE.MeshStandardMaterial;
  private signBoardMaterial: THREE.MeshStandardMaterial;
  private greenGantryMaterial: THREE.MeshStandardMaterial;
  private lampLightMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.poleMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.8,
      roughness: 0.3,
    });

    this.signBoardMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
    });

    this.greenGantryMaterial = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.5,
    });

    this.lampLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });
  }

  /**
   * Generates a circular regulatory speed limit sign (e.g. 60 km/h, 80 km/h, 120 km/h).
   */
  public createSpeedLimitSign(pos: THREE.Vector3, speedKmH: number, rotY = 0): THREE.Group {
    const signGroup = new THREE.Group();
    signGroup.position.copy(pos);
    signGroup.rotation.y = rotY;

    // Pole
    const poleGeom = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
    const pole = new THREE.Mesh(poleGeom, this.poleMaterial);
    pole.position.y = 1.6;
    pole.castShadow = true;
    signGroup.add(pole);

    // Circular Disc Backing
    const discGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 16);
    const redBorderMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const disc = new THREE.Mesh(discGeom, redBorderMat);
    disc.rotation.x = Math.PI / 2;
    disc.position.set(0, 2.7, 0.05);
    signGroup.add(disc);

    // Inner White Face
    const innerGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.042, 16);
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const inner = new THREE.Mesh(innerGeom, whiteMat);
    inner.rotation.x = Math.PI / 2;
    inner.position.set(0, 2.7, 0.052);
    signGroup.add(inner);

    return signGroup;
  }

  /**
   * Generates a major expressway overhead destination sign gantry spanning multiple lanes.
   */
  public createExpresswayGantry(pos: THREE.Vector3, widthSpan = 22, rotY = 0): THREE.Group {
    const gantry = new THREE.Group();
    gantry.position.copy(pos);
    gantry.rotation.y = rotY;

    const postHeight = 7.5;
    const postGeom = new THREE.CylinderGeometry(0.2, 0.25, postHeight, 8);

    // Left Support Column
    const leftPost = new THREE.Mesh(postGeom, this.poleMaterial);
    leftPost.position.set(-widthSpan / 2, postHeight / 2, 0);
    leftPost.castShadow = true;
    gantry.add(leftPost);

    // Right Support Column
    const rightPost = new THREE.Mesh(postGeom, this.poleMaterial);
    rightPost.position.set(widthSpan / 2, postHeight / 2, 0);
    rightPost.castShadow = true;
    gantry.add(rightPost);

    // Cross Truss Beam
    const trussGeom = new THREE.BoxGeometry(widthSpan + 1, 0.6, 0.6);
    const truss = new THREE.Mesh(trussGeom, this.poleMaterial);
    truss.position.set(0, postHeight - 0.3, 0);
    truss.castShadow = true;
    gantry.add(truss);

    // Left Green Directional Board ("AIRPORT TERMINAL / FLIGHTS")
    const boardGeom = new THREE.BoxGeometry(widthSpan * 0.45, 2.4, 0.15);
    const leftBoard = new THREE.Mesh(boardGeom, this.greenGantryMaterial);
    leftBoard.position.set(-widthSpan * 0.23, postHeight - 1.2, 0.35);
    gantry.add(leftBoard);

    // Right Green Directional Board ("METRO CITY CENTER / HIGHWAY 1")
    const rightBoard = new THREE.Mesh(boardGeom, this.greenGantryMaterial);
    rightBoard.position.set(widthSpan * 0.23, postHeight - 1.2, 0.35);
    gantry.add(rightBoard);

    // Downward Illuminating Spotlights
    const spotLeft = new THREE.SpotLight(0xfffbeb, 2.5, 18, Math.PI / 5, 0.4);
    spotLeft.position.set(-widthSpan * 0.23, postHeight - 0.2, 1.2);
    spotLeft.target.position.set(-widthSpan * 0.23, 0, 1.2);
    gantry.add(spotLeft);
    gantry.add(spotLeft.target);

    const spotRight = new THREE.SpotLight(0xfffbeb, 2.5, 18, Math.PI / 5, 0.4);
    spotRight.position.set(widthSpan * 0.23, postHeight - 0.2, 1.2);
    spotRight.target.position.set(widthSpan * 0.23, 0, 1.2);
    gantry.add(spotRight);
    gantry.add(spotRight.target);

    return gantry;
  }

  /**
   * Generates a modern Cobra-Head roadside streetlight.
   */
  public createStreetLight(pos: THREE.Vector3, rotY = 0): THREE.Group {
    const lamp = new THREE.Group();
    lamp.position.copy(pos);
    lamp.rotation.y = rotY;

    // Vertical Post (Height: 8.5m)
    const postGeom = new THREE.CylinderGeometry(0.1, 0.16, 8.5, 8);
    const post = new THREE.Mesh(postGeom, this.poleMaterial);
    post.position.y = 4.25;
    post.castShadow = true;
    lamp.add(post);

    // Curved Overhang Arm
    const armGeom = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8);
    const arm = new THREE.Mesh(armGeom, this.poleMaterial);
    arm.rotation.z = Math.PI / 3;
    arm.position.set(1.2, 8.0, 0);
    lamp.add(arm);

    // Lamp Fixture Head
    const headGeom = new THREE.BoxGeometry(0.8, 0.25, 0.4);
    const head = new THREE.Mesh(headGeom, this.poleMaterial);
    head.position.set(2.4, 8.4, 0);
    lamp.add(head);

    // Glowing Bulb
    const bulbGeom = new THREE.PlaneGeometry(0.7, 0.3);
    const bulb = new THREE.Mesh(bulbGeom, this.lampLightMaterial);
    bulb.rotation.x = Math.PI / 2;
    bulb.position.set(2.4, 8.26, 0);
    lamp.add(bulb);

    // Ground Illuminating SpotLight
    const spot = new THREE.SpotLight(0xfef08a, 4.0, 24, Math.PI / 4, 0.5);
    spot.position.set(2.4, 8.2, 0);
    spot.target.position.set(2.4, 0, 0);
    spot.castShadow = false;
    lamp.add(spot);
    lamp.add(spot.target);

    return lamp;
  }

  /**
   * Generates a modern illuminated transit bus stop shelter.
   */
  public createBusShelter(pos: THREE.Vector3, rotY = 0): THREE.Group {
    const shelter = new THREE.Group();
    shelter.position.copy(pos);
    shelter.rotation.y = rotY;

    // Glass Back Wall
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, opacity: 0.6, transparent: true, roughness: 0.1 });
    const backWallGeom = new THREE.BoxGeometry(6.0, 2.6, 0.05);
    const backWall = new THREE.Mesh(backWallGeom, glassMat);
    backWall.position.set(0, 1.3, -1.2);
    shelter.add(backWall);

    // Roof Canopy
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
    const roofGeom = new THREE.BoxGeometry(6.4, 0.15, 2.8);
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 2.7, 0);
    shelter.add(roof);

    // Wooden Bench
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
    const benchGeom = new THREE.BoxGeometry(4.0, 0.1, 0.5);
    const bench = new THREE.Mesh(benchGeom, benchMat);
    bench.position.set(0, 0.5, -0.8);
    shelter.add(bench);

    // Ad Panel on side
    const adGeom = new THREE.BoxGeometry(0.1, 2.2, 1.2);
    const adMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const ad = new THREE.Mesh(adGeom, adMat);
    ad.position.set(3.0, 1.2, 0);
    shelter.add(ad);

    return shelter;
  }
}

export const roadsideProps = new RoadsideProps();
