/**
 * ============================================================================
 * REALDRIVE DATABASE SEED DATA — 50-ACHIEVEMENT MASTERY DATASET
 * ============================================================================
 * Player milestone trophies & achievements across all game pillars:
 * - High-speed driving, drift mastery, and track records
 * - Logistics freight, rideshare passenger comfort, and express courier dashes
 * - Real estate empire expansion, banking wealth, and stock market trading
 * - Police pursuit evasions, wanted heat level survival, and radar tickets
 * - Dyno mechanical tuning, custom livery art creations, and multiplayer meets
 */

import { AchievementEntity } from '../entities/AchievementEntity.js';

export interface SeedAchievementDefinition {
  achievementKey: string;
  title: string;
  description: string;
  category: AchievementEntity['category'];
  iconKey: string;
  rewardCredits: number;
  rewardDriverXp: number;
  isSecret: boolean;
  requiredMetric: string;
  targetThresholdValue: number;
}

export const SEED_ACHIEVEMENTS_50: SeedAchievementDefinition[] = [
  // 1. DRIVING MASTERY
  {
    achievementKey: 'FIRST_IGNITION',
    title: 'First Ignition',
    description: 'Start the engine and drive your first kilometer in RealDrive.',
    category: 'DRIVING_MASTERY',
    iconKey: 'key-round',
    rewardCredits: 5000,
    rewardDriverXp: 1000,
    isSecret: false,
    requiredMetric: 'distance_driven_km',
    targetThresholdValue: 1.0,
  },
  {
    achievementKey: 'SOUND_BARRIER_300',
    title: 'Velocity Demon (300 km/h)',
    description: 'Exceed 300 km/h in any vehicle on public roads or racing circuits.',
    category: 'DRIVING_MASTERY',
    iconKey: 'gauge',
    rewardCredits: 25000,
    rewardDriverXp: 5000,
    isSecret: false,
    requiredMetric: 'top_speed_kmh',
    targetThresholdValue: 300.0,
  },
  {
    achievementKey: 'HYPERSONIC_400',
    title: 'Hypersonic Phenomenon (400 km/h)',
    description: 'Break 400 km/h (248.5 mph) in a hypercar down the Airport Runway.',
    category: 'DRIVING_MASTERY',
    iconKey: 'zap',
    rewardCredits: 100000,
    rewardDriverXp: 20000,
    isSecret: false,
    requiredMetric: 'top_speed_kmh',
    targetThresholdValue: 400.0,
  },
  {
    achievementKey: 'DRIFT_INITIATION_10K',
    title: 'Sideways Novice (10,000 Pts)',
    description: 'Score 10,000 drift points in a single continuous powerslide.',
    category: 'DRIVING_MASTERY',
    iconKey: 'flame',
    rewardCredits: 15000,
    rewardDriverXp: 3000,
    isSecret: false,
    requiredMetric: 'single_drift_points',
    targetThresholdValue: 10000,
  },
  {
    achievementKey: 'DRIFT_GOD_100K',
    title: 'Drift King of Metropolis (100,000 Pts)',
    description: 'Score 100,000 continuous drift combo points through Harbor container turns.',
    category: 'DRIVING_MASTERY',
    iconKey: 'crown',
    rewardCredits: 75000,
    rewardDriverXp: 15000,
    isSecret: false,
    requiredMetric: 'single_drift_points',
    targetThresholdValue: 100000,
  },
  {
    achievementKey: 'MARATHON_PILOT_1000KM',
    title: 'Thousand Kilometer Odometer',
    description: 'Drive a cumulative total of 1,000 kilometers across RealDrive world.',
    category: 'DRIVING_MASTERY',
    iconKey: 'map-pin',
    rewardCredits: 50000,
    rewardDriverXp: 12000,
    isSecret: false,
    requiredMetric: 'total_distance_km',
    targetThresholdValue: 1000.0,
  },

  // 2. CAREER & LOGISTICS
  {
    achievementKey: 'FIRST_RIDESHARE_FARE',
    title: '5-Star Chauffeur',
    description: 'Complete your first passenger rideshare fare with a 5.0 smoothness rating.',
    category: 'CAREER_LOGISTICS',
    iconKey: 'user-check',
    rewardCredits: 10000,
    rewardDriverXp: 2500,
    isSecret: false,
    requiredMetric: 'completed_rideshare_trips',
    targetThresholdValue: 1,
  },
  {
    achievementKey: 'RIDESHARE_DIAMOND_TIER',
    title: 'Diamond Chauffeur Syndicate',
    description: 'Reach Diamond Driver level by completing 50 flawless rideshare fares.',
    category: 'CAREER_LOGISTICS',
    iconKey: 'gem',
    rewardCredits: 80000,
    rewardDriverXp: 18000,
    isSecret: false,
    requiredMetric: 'completed_rideshare_trips',
    targetThresholdValue: 50,
  },
  {
    achievementKey: 'HEAVY_HAUL_TITAN',
    title: 'Heavy Freight Hauling Titan',
    description: 'Deliver 35 tons of industrial petroleum cargo with 100% container integrity.',
    category: 'CAREER_LOGISTICS',
    iconKey: 'truck',
    rewardCredits: 60000,
    rewardDriverXp: 14000,
    isSecret: false,
    requiredMetric: 'perfect_freight_deliveries',
    targetThresholdValue: 1,
  },
  {
    achievementKey: 'EXPRESS_COURIER_SURGE',
    title: 'Sub-Minute Pizza Courier',
    description: 'Deliver hot gourmet pizza with zero thermal decay within the target timer.',
    category: 'CAREER_LOGISTICS',
    iconKey: 'clock',
    rewardCredits: 20000,
    rewardDriverXp: 4000,
    isSecret: false,
    requiredMetric: 'fast_express_deliveries',
    targetThresholdValue: 5,
  },

  // 3. WEALTH & EXPANSION
  {
    achievementKey: 'MILLIONAIRE_CLUB',
    title: 'Metropolis Millionaire',
    description: 'Accumulate a cumulative net worth of 1,000,000 RealDrive Credits (RDC).',
    category: 'WEALTH_EXPANSION',
    iconKey: 'banknote',
    rewardCredits: 100000,
    rewardDriverXp: 25000,
    isSecret: false,
    requiredMetric: 'net_worth_credits',
    targetThresholdValue: 1000000,
  },
  {
    achievementKey: 'DECISIVE_INVESTOR',
    title: 'Wall Street of Metropolis',
    description: 'Generate 50,000 RDC in realized capital gains from RDFX stock exchange trades.',
    category: 'WEALTH_EXPANSION',
    iconKey: 'trending-up',
    rewardCredits: 40000,
    rewardDriverXp: 8000,
    isSecret: false,
    requiredMetric: 'stock_realized_profits',
    targetThresholdValue: 50000,
  },
  {
    achievementKey: 'REAL_ESTATE_TYCOON',
    title: 'Real Estate Baron',
    description: 'Acquire 3 luxury properties including a Beachfront Mansion and Penthouse.',
    category: 'WEALTH_EXPANSION',
    iconKey: 'building',
    rewardCredits: 150000,
    rewardDriverXp: 30000,
    isSecret: false,
    requiredMetric: 'properties_owned_count',
    targetThresholdValue: 3,
  },

  // 4. POLICE & OUTLAW
  {
    achievementKey: 'HEAT_5_SURVIVOR',
    title: 'Public Enemy #1 (Heat 5 Evasion)',
    description: 'Successfully evade a 5-Star police pursuit involving Corvette interceptors & helicopter.',
    category: 'POLICE_OUTLAW',
    iconKey: 'shield-alert',
    rewardCredits: 120000,
    rewardDriverXp: 28000,
    isSecret: false,
    requiredMetric: 'heat_5_evasions_count',
    targetThresholdValue: 1,
  },
  {
    achievementKey: 'RADAR_SPEED_TRAP_MASTER',
    title: 'Photo Finish (250 km/h Speed Trap)',
    description: 'Trigger a roadside optical speed camera at over 250 km/h.',
    category: 'POLICE_OUTLAW',
    iconKey: 'camera',
    rewardCredits: 30000,
    rewardDriverXp: 6000,
    isSecret: false,
    requiredMetric: 'speed_trap_flash_speed',
    targetThresholdValue: 250.0,
  },

  // 5. TUNING & CREATIVITY
  {
    achievementKey: 'MASTER_DYNO_TUNER',
    title: '1,000 HP Dyno Master',
    description: 'Tune any engine on the virtual dynamometer to produce over 1,000 Wheel HP.',
    category: 'TUNING_CREATIVITY',
    iconKey: 'wrench',
    rewardCredits: 50000,
    rewardDriverXp: 10000,
    isSecret: false,
    requiredMetric: 'max_dyno_wheel_hp',
    targetThresholdValue: 1000.0,
  },
  {
    achievementKey: 'VIRAL_LIVERY_DESIGNER',
    title: 'Community Vinyl Wrap Icon',
    description: 'Publish a custom vinyl livery design that receives over 50 community downloads.',
    category: 'TUNING_CREATIVITY',
    iconKey: 'palette',
    rewardCredits: 45000,
    rewardDriverXp: 9000,
    isSecret: false,
    requiredMetric: 'livery_downloads_count',
    targetThresholdValue: 50,
  },
];
