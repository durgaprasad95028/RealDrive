/**
 * ============================================================================
 * REALDRIVE DATABASE — EXOTIC SUPERCAR & HYPERCAR ENGINEERING DATABASE (PART 1)
 * ============================================================================
 * Detailed multi-parameter engineering specs for exotic vehicles:
 * - Camber curves, roll centers, anti-dive percentages
 * - Engine combustion chamber geometry, valve diameters, turbo compressor maps
 * - High-speed downforce distribution and active aero coefficients
 */

export interface DeepVehicleEngineeringRecord {
  modelCode: string;
  chassisCode: string;
  officialName: string;
  badgeManufacturer: string;
  homologationClass: string;
  curbWeightWithFluidsKg: number;
  weightBiasFrontRear: [number, number];
  centerOfGravityHeightMm: number;
  wheelbaseMm: number;
  trackWidthFrontMm: number;
  trackWidthRearMm: number;
  turningCircleDiameterMeters: number;
  
  // Engine Thermodynamics & Geometry
  engineDesignation: string;
  displacementCc: number;
  boreMm: number;
  strokeMm: number;
  cylinderConfiguration: string;
  valvesPerCylinder: number;
  compressionRatioString: string;
  firingOrder: string;
  maxRpmCutoff: number;
  idleRpmTarget: number;
  oilPanCapacityLiters: number;
  coolantCapacityLiters: number;
  
  // Forced Induction & Intake
  inductionSystem: string;
  turboCompressorInducerMm?: number;
  turboCompressorExducerMm?: number;
  turbineWheelExducerMm?: number;
  intercoolerVolumeLiters?: number;
  maxBoostBarGauge: number;
  
  // Powertrain Output
  peakEngineHorsepower: number;
  peakEngineHorsepowerRpm: number;
  peakEngineTorqueNm: number;
  peakEngineTorqueRpm: number;
  redlineTorqueNm: number;
  
  // Drivetrain & Transmission
  transmissionGearboxModel: string;
  clutchType: string;
  gearRatios: number[];
  reverseGearRatio: number;
  finalDriveDifferentialRatio: number;
  diffLsdPowerRampAngleDeg: number;
  diffLsdCoastRampAngleDeg: number;
  diffClutchPlatesCount: number;
  
  // Aerodynamics
  dragCoefficientCd: number;
  frontalAreaSqM: number;
  frontDownforceCoefficientCl: number;
  rearDownforceCoefficientCl: number;
  activeDrsAeroWing: boolean;
  groundEffectVenturiUnderbody: boolean;
  
  // Suspension Kinematics
  frontSuspensionType: string;
  rearSuspensionType: string;
  frontSpringRateNmm: number;
  rearSpringRateNmm: number;
  frontBumpDampingNsM: number;
  rearBumpDampingNsM: number;
  frontReboundDampingNsM: number;
  rearReboundDampingNsM: number;
  antiRollBarFrontDiameterMm: number;
  antiRollBarRearDiameterMm: number;
  staticCamberFrontDeg: number;
  staticCamberRearDeg: number;
  casterAngleDeg: number;
  kingpinAngleDeg: number;
  
  // Brakes & Tires
  frontBrakeDiameterMm: number;
  rearBrakeDiameterMm: number;
  frontBrakeThicknessMm: number;
  rearBrakeThicknessMm: number;
  frontCaliperPistons: number;
  rearCaliperPistons: number;
  tireCompoundStock: string;
  frontTireSpecification: string;
  rearTireSpecification: string;
  recommendedTirePressureFrontPsi: number;
  recommendedTirePressureRearPsi: number;
}

export const EXOTIC_SUPERCAR_DATABASE_PART_1: DeepVehicleEngineeringRecord[] = [
  {
    modelCode: 'BUG_CHIRON_SS_300',
    chassisCode: 'CHIRON-SS-W16',
    officialName: 'Bugatti Chiron Super Sport 300+',
    badgeManufacturer: 'Bugatti Automobiles S.A.S.',
    homologationClass: 'HYPERCAR',
    curbWeightWithFluidsKg: 1975,
    weightBiasFrontRear: [44.0, 56.0],
    centerOfGravityHeightMm: 420,
    wheelbaseMm: 2711,
    trackWidthFrontMm: 1749,
    trackWidthRearMm: 1661,
    turningCircleDiameterMeters: 12.5,
    engineDesignation: '8.0L Quad-Turbo W16 (Thor)',
    displacementCc: 7993,
    boreMm: 86.0,
    strokeMm: 86.0,
    cylinderConfiguration: 'W16_QUADTURBO',
    valvesPerCylinder: 4,
    compressionRatioString: '9.3:1',
    firingOrder: '1-14-9-4-7-12-15-6-13-8-3-16-11-2-5-10',
    maxRpmCutoff: 7100,
    idleRpmTarget: 900,
    oilPanCapacityLiters: 18.0,
    coolantCapacityLiters: 40.0,
    inductionSystem: 'Sequential Quad-Turbocharging with 2-Stage Activation',
    turboCompressorInducerMm: 58.0,
    turboCompressorExducerMm: 78.0,
    turbineWheelExducerMm: 64.0,
    intercoolerVolumeLiters: 32.0,
    maxBoostBarGauge: 2.85,
    peakEngineHorsepower: 1600,
    peakEngineHorsepowerRpm: 7050,
    peakEngineTorqueNm: 1600,
    peakEngineTorqueRpm: 2250,
    redlineTorqueNm: 1480,
    transmissionGearboxModel: 'Ricardo 7-Speed Dual-Clutch Longitudinal',
    clutchType: 'Dual Multi-Plate Wet Carbon Clutch',
    gearRatios: [3.18, 2.26, 1.68, 1.29, 1.06, 0.88, 0.74],
    reverseGearRatio: 3.45,
    finalDriveDifferentialRatio: 2.75,
    diffLsdPowerRampAngleDeg: 45,
    diffLsdCoastRampAngleDeg: 30,
    diffClutchPlatesCount: 8,
    dragCoefficientCd: 0.35,
    frontalAreaSqM: 2.12,
    frontDownforceCoefficientCl: 0.25,
    rearDownforceCoefficientCl: 0.55,
    activeDrsAeroWing: true,
    groundEffectVenturiUnderbody: true,
    frontSuspensionType: 'Double Wishbone with Active Electronic Dampers',
    rearSuspensionType: 'Double Wishbone with Active Electronic Dampers',
    frontSpringRateNmm: 120.0,
    rearSpringRateNmm: 180.0,
    frontBumpDampingNsM: 4500,
    rearBumpDampingNsM: 6200,
    frontReboundDampingNsM: 7800,
    rearReboundDampingNsM: 9800,
    antiRollBarFrontDiameterMm: 36.0,
    antiRollBarRearDiameterMm: 28.0,
    staticCamberFrontDeg: -1.2,
    staticCamberRearDeg: -1.0,
    casterAngleDeg: 6.5,
    kingpinAngleDeg: 11.0,
    frontBrakeDiameterMm: 420,
    rearBrakeDiameterMm: 400,
    frontBrakeThicknessMm: 40,
    rearBrakeThicknessMm: 38,
    frontCaliperPistons: 8,
    rearCaliperPistons: 6,
    tireCompoundStock: 'Michelin Pilot Sport Cup 2 (Reinforced Carbon Belt)',
    frontTireSpecification: '285/30ZR20',
    rearTireSpecification: '355/25ZR21',
    recommendedTirePressureFrontPsi: 38.0,
    recommendedTirePressureRearPsi: 42.0,
  },
  {
    modelCode: 'POR_911_GT3RS_992',
    chassisCode: '992-GT3-RS',
    officialName: 'Porsche 911 GT3 RS Weissach Package',
    badgeManufacturer: 'Porsche AG',
    homologationClass: 'TRACK_GT3',
    curbWeightWithFluidsKg: 1450,
    weightBiasFrontRear: [38.5, 61.5],
    centerOfGravityHeightMm: 390,
    wheelbaseMm: 2457,
    trackWidthFrontMm: 1612,
    trackWidthRearMm: 1584,
    turningCircleDiameterMeters: 10.5,
    engineDesignation: '4.0L Naturally Aspirated Flat-6 (MA275)',
    displacementCc: 3996,
    boreMm: 102.0,
    strokeMm: 81.5,
    cylinderConfiguration: 'BOXER_6',
    valvesPerCylinder: 4,
    compressionRatioString: '13.3:1',
    firingOrder: '1-6-2-4-3-5',
    maxRpmCutoff: 9000,
    idleRpmTarget: 950,
    oilPanCapacityLiters: 8.5,
    coolantCapacityLiters: 22.0,
    inductionSystem: 'Individual Throttle Bodies with Carbon Airbox',
    maxBoostBarGauge: 0.0,
    peakEngineHorsepower: 525,
    peakEngineHorsepowerRpm: 8500,
    peakEngineTorqueNm: 465,
    peakEngineTorqueRpm: 6300,
    redlineTorqueNm: 410,
    transmissionGearboxModel: 'Porsche 7-Speed Dual-Clutch (PDK-S)',
    clutchType: 'Dual Wet Multi-Plate PDK Clutch',
    gearRatios: [3.75, 2.38, 1.72, 1.34, 1.11, 0.96, 0.84],
    reverseGearRatio: 3.42,
    finalDriveDifferentialRatio: 4.19,
    diffLsdPowerRampAngleDeg: 55,
    diffLsdCoastRampAngleDeg: 45,
    diffClutchPlatesCount: 6,
    dragCoefficientCd: 0.39,
    frontalAreaSqM: 2.05,
    frontDownforceCoefficientCl: 0.45,
    rearDownforceCoefficientCl: 0.95,
    activeDrsAeroWing: true,
    groundEffectVenturiUnderbody: true,
    frontSuspensionType: 'Double Wishbone with Teardrop Aerodynamic Arms',
    rearSuspensionType: 'Multi-Link LSA with Rear Axle Steering (4WS)',
    frontSpringRateNmm: 100.0,
    rearSpringRateNmm: 160.0,
    frontBumpDampingNsM: 3800,
    rearBumpDampingNsM: 5200,
    frontReboundDampingNsM: 6500,
    rearReboundDampingNsM: 8400,
    antiRollBarFrontDiameterMm: 32.0,
    antiRollBarRearDiameterMm: 26.0,
    staticCamberFrontDeg: -2.8,
    staticCamberRearDeg: -2.2,
    casterAngleDeg: 8.2,
    kingpinAngleDeg: 12.5,
    frontBrakeDiameterMm: 410,
    rearBrakeDiameterMm: 390,
    frontBrakeThicknessMm: 36,
    rearBrakeThicknessMm: 32,
    frontCaliperPistons: 6,
    rearCaliperPistons: 4,
    tireCompoundStock: 'Michelin Pilot Sport Cup 2 R',
    frontTireSpecification: '275/35ZR20',
    rearTireSpecification: '335/30ZR21',
    recommendedTirePressureFrontPsi: 29.0,
    recommendedTirePressureRearPsi: 31.0,
  },
  {
    modelCode: 'NIS_GTR_R35_NISMO',
    chassisCode: 'CBA-R35-NISMO',
    officialName: 'Nissan GT-R Nismo GT3 Turbo Edition',
    badgeManufacturer: 'Nissan Motorsport (Nismo)',
    homologationClass: 'JDM_TUNER',
    curbWeightWithFluidsKg: 1720,
    weightBiasFrontRear: [54.0, 46.0],
    centerOfGravityHeightMm: 460,
    wheelbaseMm: 2780,
    trackWidthFrontMm: 1590,
    trackWidthRearMm: 1600,
    turningCircleDiameterMeters: 11.2,
    engineDesignation: '3.8L Twin-Turbo V6 (VR38DETT)',
    displacementCc: 3799,
    boreMm: 95.5,
    strokeMm: 88.4,
    cylinderConfiguration: 'V6_TWINTURBO',
    valvesPerCylinder: 4,
    compressionRatioString: '9.0:1',
    firingOrder: '1-2-3-4-5-6',
    maxRpmCutoff: 7200,
    idleRpmTarget: 750,
    oilPanCapacityLiters: 9.5,
    coolantCapacityLiters: 14.0,
    inductionSystem: 'Twin Garrett GT3 Spec Turbochargers with Air-to-Air Intercoolers',
    turboCompressorInducerMm: 52.0,
    turboCompressorExducerMm: 68.0,
    turbineWheelExducerMm: 58.0,
    intercoolerVolumeLiters: 18.0,
    maxBoostBarGauge: 1.65,
    peakEngineHorsepower: 600,
    peakEngineHorsepowerRpm: 6800,
    peakEngineTorqueNm: 652,
    peakEngineTorqueRpm: 3600,
    redlineTorqueNm: 580,
    transmissionGearboxModel: 'BorgWarner GR6 6-Speed Dual Clutch Rear Transaxle',
    clutchType: 'Dual Wet Multi-Plate Clutch with Carbon Linings',
    gearRatios: [4.056, 2.301, 1.595, 1.248, 1.001, 0.796],
    reverseGearRatio: 3.383,
    finalDriveDifferentialRatio: 3.700,
    diffLsdPowerRampAngleDeg: 60,
    diffLsdCoastRampAngleDeg: 40,
    diffClutchPlatesCount: 8,
    dragCoefficientCd: 0.26,
    frontalAreaSqM: 2.28,
    frontDownforceCoefficientCl: 0.30,
    rearDownforceCoefficientCl: 0.45,
    activeDrsAeroWing: false,
    groundEffectVenturiUnderbody: true,
    frontSuspensionType: 'Double Wishbone with Aluminum Arms & Bilstein DampTronic',
    rearSuspensionType: 'Multi-Link with Aluminum Subframe',
    frontSpringRateNmm: 85.0,
    rearSpringRateNmm: 110.0,
    frontBumpDampingNsM: 3200,
    rearBumpDampingNsM: 4100,
    frontReboundDampingNsM: 5200,
    rearReboundDampingNsM: 6800,
    antiRollBarFrontDiameterMm: 34.0,
    antiRollBarRearDiameterMm: 25.0,
    staticCamberFrontDeg: -2.2,
    staticCamberRearDeg: -1.6,
    casterAngleDeg: 6.8,
    kingpinAngleDeg: 10.8,
    frontBrakeDiameterMm: 410,
    rearBrakeDiameterMm: 390,
    frontBrakeThicknessMm: 36,
    rearBrakeThicknessMm: 32,
    frontCaliperPistons: 6,
    rearCaliperPistons: 4,
    tireCompoundStock: 'Dunlop SP Sport Maxx GT600 DSST CTT',
    frontTireSpecification: '255/40ZRF20',
    rearTireSpecification: '285/35ZRF20',
    recommendedTirePressureFrontPsi: 30.0,
    recommendedTirePressureRearPsi: 29.0,
  },
];
