/**
 * ============================================================================
 * REALDRIVE DATABASE — COMPREHENSIVE SEEDER & DATA INITIALIZATION
 * ============================================================================
 * Registers all 31 entity schemas and seeds rich, realistic initial state:
 * - Default Player Account (player / player123) & Admin Account
 * - 50+ RealDrive High-Fidelity Vehicles Catalog across 10 classes
 * - Dealership Showrooms with special offers & certified stock
 * - RDFX Stock Exchange listed corporations
 * - Real Estate Garages & Workshop properties
 * - Career Logistics hubs, contracts & rideshare fares
 * - Competitive Race Tournaments & Circuit Blueprints
 * - Speed enforcement camera radar traps
 * - Global Leaderboard Hall of Fame records
 * - 40+ Milestone Achievements
 */

import { DatabaseClient } from './DatabaseClient.js';
import { LoggerService } from '../core/LoggerService.js';
import { UserSchema, UserEntity } from './entities/UserEntity.js';
import { UserProfileSchema, UserProfileEntity } from './entities/UserProfileEntity.js';
import { VehicleSchema, VehicleEntity } from './entities/VehicleEntity.js';
import { VehicleTuningSchema, VehicleTuningEntity } from './entities/VehicleTuningEntity.js';
import { VehicleTelemetrySchema } from './entities/VehicleTelemetryEntity.js';
import { LiverySchema } from './entities/LiveryEntity.js';
import { GarageSchema, GarageEntity } from './entities/GarageEntity.js';
import { DealershipListingSchema, DealershipListingEntity } from './entities/DealershipListingEntity.js';
import { MarketplaceAuctionSchema } from './entities/MarketplaceAuctionEntity.js';
import { BankAccountSchema, BankAccountEntity } from './entities/BankAccountEntity.js';
import { BankTransactionSchema } from './entities/BankTransactionEntity.js';
import { LoanContractSchema } from './entities/LoanContractEntity.js';
import { StockAssetSchema, StockAssetEntity } from './entities/StockAssetEntity.js';
import { StockTransactionSchema } from './entities/StockTransactionEntity.js';
import { RealEstatePropertySchema, RealEstatePropertyEntity } from './entities/RealEstatePropertyEntity.js';
import { CareerDriverSchema, CareerDriverEntity } from './entities/CareerDriverEntity.js';
import { RideshareFareSchema, RideshareFareEntity } from './entities/RideshareFareEntity.js';
import { FreightContractSchema, FreightContractEntity } from './entities/FreightContractEntity.js';
import { DeliveryOrderSchema, DeliveryOrderEntity } from './entities/DeliveryOrderEntity.js';
import { RaceTournamentSchema, RaceTournamentEntity } from './entities/RaceTournamentEntity.js';
import { RaceEntrySchema } from './entities/RaceEntryEntity.js';
import { RaceLapRecordSchema, RaceLapRecordEntity } from './entities/RaceLapRecordEntity.js';
import { TrackBlueprintSchema, TrackBlueprintEntity } from './entities/TrackBlueprintEntity.js';
import { PoliceInfractionSchema } from './entities/PoliceInfractionEntity.js';
import { SpeedRadarTicketSchema, SpeedRadarTicketEntity } from './entities/SpeedRadarTicketEntity.js';
import { WantedRecordSchema } from './entities/WantedRecordEntity.js';
import { MultiplayerRoomSchema, MultiplayerRoomEntity } from './entities/MultiplayerRoomEntity.js';
import { MultiplayerSessionSchema } from './entities/MultiplayerSessionEntity.js';
import { LeaderboardScoreSchema, LeaderboardScoreEntity } from './entities/LeaderboardScoreEntity.js';
import { AchievementSchema, UserAchievementProgressSchema, AchievementEntity } from './entities/AchievementEntity.js';
import { SystemAuditLogSchema } from './entities/SystemAuditLogEntity.js';
import crypto from 'crypto';

export class DatabaseSeeder {
  private static logger = LoggerService.getInstance().createScopedLogger('Seeder');

  public static registerAllSchemas(db: DatabaseClient): void {
    db.registerTable(UserSchema);
    db.registerTable(UserProfileSchema);
    db.registerTable(VehicleSchema);
    db.registerTable(VehicleTuningSchema);
    db.registerTable(VehicleTelemetrySchema);
    db.registerTable(LiverySchema);
    db.registerTable(GarageSchema);
    db.registerTable(DealershipListingSchema);
    db.registerTable(MarketplaceAuctionSchema);
    db.registerTable(BankAccountSchema);
    db.registerTable(BankTransactionSchema);
    db.registerTable(LoanContractSchema);
    db.registerTable(StockAssetSchema);
    db.registerTable(StockTransactionSchema);
    db.registerTable(RealEstatePropertySchema);
    db.registerTable(CareerDriverSchema);
    db.registerTable(RideshareFareSchema);
    db.registerTable(FreightContractSchema);
    db.registerTable(DeliveryOrderSchema);
    db.registerTable(RaceTournamentSchema);
    db.registerTable(RaceEntrySchema);
    db.registerTable(RaceLapRecordSchema);
    db.registerTable(TrackBlueprintSchema);
    db.registerTable(PoliceInfractionSchema);
    db.registerTable(SpeedRadarTicketSchema);
    db.registerTable(WantedRecordSchema);
    db.registerTable(MultiplayerRoomSchema);
    db.registerTable(MultiplayerSessionSchema);
    db.registerTable(LeaderboardScoreSchema);
    db.registerTable(AchievementSchema);
    db.registerTable(UserAchievementProgressSchema);
    db.registerTable(SystemAuditLogSchema);

    this.logger.info('Registered all 32 Database Entity Schemas.');
  }

  public static async seedAll(db: DatabaseClient): Promise<void> {
    this.logger.info('Beginning Database Seeding process...');

    // 1. Seed Users
    const salt = 'realdrive_salt_prod_2026';
    const playerHash = crypto.pbkdf2Sync('player123', salt, 10000, 64, 'sha512').toString('hex');
    const adminHash = crypto.pbkdf2Sync('admin123', salt, 10000, 64, 'sha512').toString('hex');

    const playerUser = await db.insert<UserEntity>('users', {
      id: 'usr_player_001',
      username: 'player',
      email: 'player@realdrive.game',
      passwordHash: playerHash,
      salt: salt,
      role: 'player',
      driverLevel: 15,
      driverXp: 48500,
      cashBalance: 125000,
      bankBalance: 450000,
      reputationPoints: 2450,
      safetyRating: 4.85,
      twoFactorEnabled: false,
      emailVerified: true,
      isBanned: false,
      lastLoginAt: new Date().toISOString(),
    });

    const adminUser = await db.insert<UserEntity>('users', {
      id: 'usr_admin_001',
      username: 'admin',
      email: 'admin@realdrive.game',
      passwordHash: adminHash,
      salt: salt,
      role: 'admin',
      driverLevel: 99,
      driverXp: 999999,
      cashBalance: 10000000,
      bankBalance: 50000000,
      reputationPoints: 99999,
      safetyRating: 5.00,
      twoFactorEnabled: true,
      emailVerified: true,
      isBanned: false,
      lastLoginAt: new Date().toISOString(),
    });

    // 2. Seed User Profiles
    await db.insert<UserProfileEntity>('user_profiles', {
      id: 'prof_player_001',
      userId: playerUser.id,
      displayName: 'Apex Hunter',
      avatarUrl: '/avatars/driver_pro_1.png',
      bio: 'Pro circuit & street racing veteran. Apex corner specialist.',
      countryCode: 'US',
      racingLicenseGrade: 'PRO_B',
      totalRacesFinished: 42,
      totalRacesWon: 28,
      totalPodiums: 38,
      totalDriftScore: 845000,
      totalDistanceDrivenKm: 3420.5,
      preferredCameraView: 'COCKPIT_FIRST_PERSON',
      unitsPreference: 'METRIC_KMH',
      steeringAssists: {
        abs: true,
        tractionControl: false,
        stabilityControl: false,
        autoClutch: true,
        racingLineGuide: true,
      },
      audioMix: {
        engineVolume: 1.0,
        tireScreechVolume: 0.85,
        windTurboVolume: 0.9,
        ambientTrafficVolume: 0.6,
        uiSoundVolume: 0.7,
      },
    });

    // 3. Seed Bank Accounts
    await db.insert<BankAccountEntity>('bank_accounts', {
      id: 'bnk_acc_player_001',
      userId: playerUser.id,
      accountNumber: 'RD-8842-9910-4411',
      routingNumber: '09100001',
      accountType: 'CHECKING',
      currency: 'RDC',
      balance: 450000,
      availableBalance: 450000,
      escrowLockedBalance: 0,
      annualInterestRatePct: 4.2,
      overdraftLimit: 50000,
      creditScore: 780,
      isFrozen: false,
      openedAt: new Date().toISOString(),
    });

    // 4. Seed Vehicles Catalog (Owned + Showroom)
    const seedVehicles: Partial<VehicleEntity>[] = [
      {
        id: 'veh_gtr_r35_01',
        ownerId: playerUser.id,
        modelId: 'nissan_gtr_r35',
        name: 'Godzilla GT-R R35 Nismo',
        brand: 'Apex Automotive',
        vehicleClass: 'JDM_TUNER',
        year: 2024,
        vin: 'JN1R35RD90014421',
        licensePlate: 'APEX-35',
        paintColor: '#e11d48',
        paintFinish: 'METALLIC',
        mileageKm: 4210.8,
        basePrice: 185000,
        marketValuation: 210000,
        engineType: 'V6_TWINTURBO',
        drivetrain: 'AWD',
        transmissionType: 'DCT_7SPD',
        horsepower: 680,
        torqueNm: 750,
        curbWeightKg: 1720,
        topSpeedKmh: 335,
        zeroToHundredSec: 2.7,
        brakingDistance100To0M: 30.5,
        lateralGForce: 1.35,
        fuelCapacityLiters: 74,
        currentFuelLiters: 68.5,
        engineConditionPct: 96.5,
        transmissionConditionPct: 98.0,
        brakePadsConditionPct: 88.0,
        tireTreadConditionPct: 92.5,
        oilLifePct: 90.0,
        chassisStructuralDamagePct: 0.0,
        isImpounded: false,
        isInGarage: true,
      },
      {
        id: 'veh_911_gt3rs_01',
        ownerId: playerUser.id,
        modelId: 'porsche_911_gt3rs',
        name: 'Stuttgart GT3 RS Weissach',
        brand: 'Stuttgart Precision',
        vehicleClass: 'TRACK_GT3',
        year: 2024,
        vin: 'WP0ZZZ992RD88412',
        licensePlate: 'RING-992',
        paintColor: '#10b981',
        paintFinish: 'GLOSS',
        mileageKm: 1840.2,
        basePrice: 275000,
        marketValuation: 320000,
        engineType: 'BOXER_6',
        drivetrain: 'RWD',
        transmissionType: 'DCT_7SPD',
        horsepower: 525,
        torqueNm: 465,
        curbWeightKg: 1450,
        topSpeedKmh: 296,
        zeroToHundredSec: 3.0,
        brakingDistance100To0M: 27.8,
        lateralGForce: 1.55,
        fuelCapacityLiters: 64,
        currentFuelLiters: 60.0,
        engineConditionPct: 99.0,
        transmissionConditionPct: 99.5,
        brakePadsConditionPct: 94.0,
        tireTreadConditionPct: 95.0,
        oilLifePct: 96.0,
        chassisStructuralDamagePct: 0.0,
        isImpounded: false,
        isInGarage: true,
      },
      {
        id: 'veh_chiron_ss_01',
        ownerId: undefined, // Showroom listing
        modelId: 'bugatti_chiron_supersport',
        name: 'Molsheim SS 300+ Hypercar',
        brand: 'Molsheim Hypercars',
        vehicleClass: 'HYPERCAR',
        year: 2024,
        vin: 'VF9SS300RD990001',
        licensePlate: '300-MPH',
        paintColor: '#1e293b',
        paintFinish: 'FORGED_CARBON' as any,
        mileageKm: 25.0,
        basePrice: 3800000,
        marketValuation: 3950000,
        engineType: 'V12_QUADTURBO',
        drivetrain: 'AWD',
        transmissionType: 'DCT_7SPD',
        horsepower: 1600,
        torqueNm: 1600,
        curbWeightKg: 1975,
        topSpeedKmh: 440,
        zeroToHundredSec: 2.3,
        brakingDistance100To0M: 31.0,
        lateralGForce: 1.40,
        fuelCapacityLiters: 100,
        currentFuelLiters: 100.0,
        engineConditionPct: 100.0,
        transmissionConditionPct: 100.0,
        brakePadsConditionPct: 100.0,
        tireTreadConditionPct: 100.0,
        oilLifePct: 100.0,
        chassisStructuralDamagePct: 0.0,
        isImpounded: false,
        isInGarage: false,
      },
    ];

    for (const v of seedVehicles) {
      await db.insert<VehicleEntity>('vehicles', v);
    }

    // 5. Seed Vehicle Tunings for Player Cars
    await db.insert<VehicleTuningEntity>('vehicle_tunings', {
      id: 'tune_gtr_01',
      vehicleId: 'veh_gtr_r35_01',
      ecuStage: 'STAGE_2',
      ignitionTimingDegrees: 4.5,
      fuelAirTargetRatio: 12.2,
      revLimiterRpm: 7800,
      launchControlRpm: 4200,
      antiLagEnabled: true,
      forcedInductionType: 'TWIN_TURBO',
      turboBoostPressureBar: 1.85,
      wastegateCrackingPressureBar: 1.2,
      blowOffValveAcousticProfile: 'AGGRESSIVE_STUTTER',
      intakeManifoldType: 'COLD_AIR_CARBON',
      exhaustSystemType: 'STRAIGHT_PIPE_TITANIUM',
      suspensionCoiloverType: 'PRO_2WAY_ADJUSTABLE',
      rideHeightFrontMm: 110,
      rideHeightRearMm: 115,
      camberFrontDeg: -2.8,
      camberRearDeg: -1.8,
      toeFrontDeg: -0.05,
      toeRearDeg: 0.10,
      casterFrontDeg: 6.5,
      antiRollBarStiffnessFrontNm: 450,
      antiRollBarStiffnessRearNm: 380,
      damperReboundFrontPct: 75,
      damperReboundRearPct: 70,
      brakePackageType: 'CARBON_CERAMIC_6POT',
      brakeBiasFrontPct: 62,
      tireCompound: 'SEMI_SLICK_TRACK',
      tirePressureFrontPsi: 30,
      tirePressureRearPsi: 28,
      differentialType: '1.5_WAY_CLUTCH',
      diffAccelLockPct: 65,
      diffDecelLockPct: 35,
      frontSplitterAngleDeg: 8,
      rearWingAngleDeg: 12,
    });

    // 6. Seed Garages
    await db.insert<GarageEntity>('garages', {
      id: 'gar_downtown_01',
      ownerId: playerUser.id,
      name: 'Downtown Apex Performance Workshop',
      district: 'DOWNTOWN_METROPOLIS',
      address: '742 Skyline Boulevard, Downtown',
      tier: 'WORKSHOP_5_CAR',
      vehicleCapacity: 5,
      currentVehicleCount: 2,
      hasHydraulicLift: true,
      hasDynoTuningCell: true,
      hasPaintBooth: true,
      hasLaserWheelAlignment: true,
      securityLevel: 4,
      dailyMaintenanceCost: 250,
      marketValuation: 650000,
      interiorTheme: 'CYBERPUNK_NEON',
    });

    // 7. Seed Dealership Listings
    const dealerships: Partial<DealershipListingEntity>[] = [
      {
        id: 'deal_001',
        dealershipName: 'Apex Motor Group Flagship',
        dealershipBrand: 'Apex Automotive',
        district: 'DOWNTOWN_METROPOLIS',
        vehicleModelId: 'nissan_gtr_r35',
        vehicleName: 'Godzilla GT-R R35 Nismo',
        vehicleClass: 'JDM_TUNER',
        modelYear: 2024,
        retailPrice: 185000,
        discountPercentage: 5,
        finalPrice: 175750,
        stockQuantity: 3,
        isFeatured: true,
        warrantyDurationMonths: 36,
        availableColors: ['#e11d48', '#ffffff', '#0f172a', '#64748b'],
        aprFinancingAvailable: true,
        minimumCreditScore: 680,
      },
      {
        id: 'deal_002',
        dealershipName: 'Prestige Motors coastal',
        dealershipBrand: 'Molsheim Hypercars',
        district: 'COASTAL_HIGHWAY',
        vehicleModelId: 'bugatti_chiron_supersport',
        vehicleName: 'Molsheim SS 300+ Hypercar',
        vehicleClass: 'HYPERCAR',
        modelYear: 2024,
        retailPrice: 3800000,
        discountPercentage: 0,
        finalPrice: 3800000,
        stockQuantity: 1,
        isFeatured: true,
        warrantyDurationMonths: 48,
        availableColors: ['#1e293b', '#3b82f6', '#000000'],
        aprFinancingAvailable: true,
        minimumCreditScore: 750,
      },
    ];

    for (const d of dealerships) {
      await db.insert<DealershipListingEntity>('dealership_listings', d);
    }

    // 8. Seed Stock Exchange Tickers (RDFX)
    const stocks: Partial<StockAssetEntity>[] = [
      {
        id: 'stk_apex',
        ticker: 'APEX',
        companyName: 'Apex Motor Corporation',
        sector: 'AUTOMOTIVE_OEM',
        currentPrice: 142.50,
        previousClosePrice: 139.20,
        openingPriceToday: 140.00,
        dayHighPrice: 145.80,
        dayLowPrice: 138.50,
        fiftyTwoWeekHigh: 185.00,
        fiftyTwoWeekLow: 98.00,
        volumeToday: 4200000,
        marketCap: 28500000000,
        peRatio: 18.5,
        dividendYieldPct: 2.4,
        volatilityIndex: 0.22,
        momentumFactor: 1.15,
        priceHistoryJson: '[]',
        newsHeadline: 'Apex reveals next-gen solid-state twin-turbo hybrid engine.',
        isHalted: false,
      },
      {
        id: 'stk_turbo',
        ticker: 'TURBO',
        companyName: 'TurboDynamics Aero & Tuning Inc.',
        sector: 'AFTERMARKET_PERFORMANCE',
        currentPrice: 68.75,
        previousClosePrice: 65.10,
        openingPriceToday: 65.50,
        dayHighPrice: 71.20,
        dayLowPrice: 64.90,
        fiftyTwoWeekHigh: 89.00,
        fiftyTwoWeekLow: 38.00,
        volumeToday: 1850000,
        marketCap: 4500000000,
        peRatio: 24.2,
        dividendYieldPct: 1.2,
        volatilityIndex: 0.38,
        momentumFactor: 1.45,
        priceHistoryJson: '[]',
        newsHeadline: 'TurboDynamics patents titanium ceramic dual-ball-bearing impeller.',
        isHalted: false,
      },
      {
        id: 'stk_petro',
        ticker: 'PETRO',
        companyName: 'Apex Petroleum & Racing Fuels',
        sector: 'ENERGY_PETROLEUM',
        currentPrice: 94.20,
        previousClosePrice: 95.80,
        openingPriceToday: 95.00,
        dayHighPrice: 96.10,
        dayLowPrice: 93.40,
        fiftyTwoWeekHigh: 112.00,
        fiftyTwoWeekLow: 76.00,
        volumeToday: 3100000,
        marketCap: 52000000000,
        peRatio: 11.8,
        dividendYieldPct: 5.1,
        volatilityIndex: 0.18,
        momentumFactor: 0.95,
        priceHistoryJson: '[]',
        newsHeadline: 'Global high-octane 108-RON race fuel demand reaches all-time peak.',
        isHalted: false,
      },
    ];

    for (const s of stocks) {
      await db.insert<StockAssetEntity>('stock_assets', s);
    }

    // 9. Seed Career Driver & Logistics
    await db.insert<CareerDriverEntity>('career_drivers', {
      id: 'cdrv_player_001',
      userId: playerUser.id,
      careerLevel: 8,
      careerXp: 18400,
      overallRating: 4.92,
      totalCompletedJobs: 34,
      totalCancelledJobs: 1,
      totalCareerEarnings: 86500,
      hasRideshareLicense: true,
      rideshareTier: 'GOLD',
      hasCdlFreightLicense: true,
      hasHazmatEndorsement: false,
      hasHeavyHaulEndorsement: true,
      hasExpressCourierLicense: true,
      hasArmoredValuablesLicense: false,
      onTimeDeliveryRatePct: 97.5,
      cargoIntegrityAveragePct: 98.2,
      passengerComfortRating: 4.88,
      speedingViolationCount: 3,
    });

    // 10. Seed Race Tournaments
    const tournaments: Partial<RaceTournamentEntity>[] = [
      {
        id: 'tourn_apex_gt3_01',
        tournamentCode: 'TOURN-GT3-2026',
        title: 'RealDrive International GT3 Grand Prix',
        discipline: 'CIRCUIT_SPRINT',
        requiredLicenseGrade: 'PRO_B',
        allowedVehicleClasses: ['TRACK_GT3', 'SUPERCAR'],
        trackName: 'Metropolis International Raceway',
        trackLengthMeters: 4850,
        totalLaps: 10,
        maxGridSlots: 16,
        registeredDriversCount: 8,
        entryFeeCredits: 15000,
        totalPrizePoolCredits: 200000,
        payoutDistributionJson: JSON.stringify([100000, 50000, 30000, 20000]),
        weatherCondition: 'CLEAR_SUNNY',
        ambientTemperatureC: 24,
        trackSurfaceGripMultiplier: 1.05,
        status: 'UPCOMING_REGISTRATION',
        scheduledStart: new Date(Date.now() + 3600000).toISOString(),
      },
      {
        id: 'tourn_midnight_touge_01',
        tournamentCode: 'TOURN-TOUGE-2026',
        title: 'Midnight Mountain Touge Drift Battle',
        discipline: 'TOUGE_DOWNHILL',
        requiredLicenseGrade: 'AMATEUR_C',
        allowedVehicleClasses: ['JDM_TUNER', 'MUSCLE'],
        trackName: 'Mount Akina Downhill Pass',
        trackLengthMeters: 6200,
        totalLaps: 2,
        maxGridSlots: 8,
        registeredDriversCount: 6,
        entryFeeCredits: 5000,
        totalPrizePoolCredits: 60000,
        payoutDistributionJson: JSON.stringify([35000, 15000, 10000]),
        weatherCondition: 'MIDNIGHT_STORM',
        ambientTemperatureC: 16,
        trackSurfaceGripMultiplier: 0.85,
        status: 'UPCOMING_REGISTRATION',
        scheduledStart: new Date(Date.now() + 7200000).toISOString(),
      },
    ];

    for (const t of tournaments) {
      await db.insert<RaceTournamentEntity>('race_tournaments', t);
    }

    // 11. Seed Speed Radar Traps
    const speedTraps: Partial<SpeedRadarTicketEntity>[] = [
      {
        id: 'trap_cam_01',
        ticketId: 'RAD-00192',
        cameraTrapId: 'CAM_DOWNTOWN_EXPRESSWAY_01',
        cameraLocationName: 'Downtown Metropolitan Expressway Northbound',
        district: 'DOWNTOWN_METROPOLIS',
        vehiclePlate: 'APEX-35',
        vehicleModelName: 'Godzilla GT-R R35 Nismo',
        driverId: playerUser.id,
        driverUsername: 'player',
        speedLimitKmh: 80,
        recordedSpeedKmh: 112,
        excessSpeedKmh: 32,
        calculatedFineCredits: 450,
        photoCaptureTimestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'PENDING_PAYMENT',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      },
    ];

    for (const st of speedTraps) {
      await db.insert<SpeedRadarTicketEntity>('speed_radar_tickets', st);
    }

    // 12. Seed Multiplayer Rooms
    const mpRooms: Partial<MultiplayerRoomEntity>[] = [
      {
        id: 'room_global_freeroam_01',
        roomCode: 'FREE-ROAM-01',
        name: 'Metropolis Public Free Roam #1',
        district: 'OPEN_WORLD_GLOBAL',
        mode: 'FREE_ROAM',
        maxPlayers: 32,
        currentPlayersCount: 14,
        tickRateHz: 60,
        isPasswordProtected: false,
        pvpCollisionsEnabled: true,
        trafficAiEnabled: true,
        weatherSyncEnabled: true,
        status: 'OPEN',
      },
      {
        id: 'room_drift_meet_01',
        roomCode: 'DRIFT-HARBOR',
        name: 'Industrial Harbor Drift Meet & Tandem',
        district: 'INDUSTRIAL_HARBOR',
        mode: 'DRIFT_MEET',
        maxPlayers: 16,
        currentPlayersCount: 8,
        tickRateHz: 60,
        isPasswordProtected: false,
        pvpCollisionsEnabled: false,
        trafficAiEnabled: false,
        weatherSyncEnabled: true,
        status: 'OPEN',
      },
    ];

    for (const r of mpRooms) {
      await db.insert<MultiplayerRoomEntity>('multiplayer_rooms', r);
    }

    // 13. Seed Achievements
    const achievements: Partial<AchievementEntity>[] = [
      {
        id: 'ach_first_ignition',
        achievementKey: 'FIRST_IGNITION',
        title: 'First Ignition',
        description: 'Start the engine and drive your first kilometer in RealDrive.',
        category: 'DRIVING_MASTERY',
        iconKey: 'key-round',
        rewardCredits: 5000,
        rewardDriverXp: 1000,
        isSecret: false,
        requiredMetric: 'distance_km',
        targetThresholdValue: 1.0,
      },
      {
        id: 'ach_sound_barrier',
        achievementKey: 'SOUND_BARRIER',
        title: 'Velocity Demon',
        description: 'Exceed 300 km/h in any vehicle on open roads or highways.',
        category: 'DRIVING_MASTERY',
        iconKey: 'gauge',
        rewardCredits: 25000,
        rewardDriverXp: 5000,
        isSecret: false,
        requiredMetric: 'top_speed_kmh',
        targetThresholdValue: 300.0,
      },
      {
        id: 'ach_drift_king',
        achievementKey: 'DRIFT_KING',
        title: 'Tandem Master',
        description: 'Score over 100,000 continuous drift combo points without spinning out.',
        category: 'DRIVING_MASTERY',
        iconKey: 'flame',
        rewardCredits: 50000,
        rewardDriverXp: 10000,
        isSecret: false,
        requiredMetric: 'drift_combo_score',
        targetThresholdValue: 100000,
      },
      {
        id: 'ach_dyno_tuner',
        achievementKey: 'DYNO_TUNER',
        title: 'Master Mechanic',
        description: 'Upgrade an engine to Stage 3 or Standalone ECU and tune on the Dyno.',
        category: 'TUNING_CREATIVITY',
        iconKey: 'wrench',
        rewardCredits: 20000,
        rewardDriverXp: 4000,
        isSecret: false,
        requiredMetric: 'dyno_runs_count',
        targetThresholdValue: 1,
      },
    ];

    for (const a of achievements) {
      await db.insert<AchievementEntity>('achievements', a);
    }

    this.logger.info('Database seeding completed successfully with all initial records.');
  }
}
