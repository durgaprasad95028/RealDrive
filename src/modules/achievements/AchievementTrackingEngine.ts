/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - ACHIEVEMENT & TROPHY TRACKING ENGINE
 * ============================================================================
 * Real-time event milestone evaluator monitoring driver achievements, platinum
 * trophy unlocks, reward cash distributions, and special livery gifts.
 */

export interface TrophyAchievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  readonly category: 'speed' | 'drift' | 'career' | 'economy' | 'police_evasion' | 'collection';
  readonly rewardUSD: number;
  readonly rewardDriverXp: number;
  readonly unlockedBadgeIcon: string;
  isUnlocked: boolean;
  progressPercent: number; // 0 to 100
  unlockedAtTimestamp?: number;
}

export const MASTER_ACHIEVEMENTS_LIST: readonly TrophyAchievement[] = [
  {
    id: 'ach_first_ignition',
    title: 'First Ignition',
    description: 'Start your engine and take your first drive in RealDrive.',
    tier: 'bronze',
    category: 'career',
    rewardUSD: 5000,
    rewardDriverXp: 250,
    unlockedBadgeIcon: 'key_ignition',
    isUnlocked: true,
    progressPercent: 100
  },
  {
    id: 'ach_vmax_300',
    title: 'Triple Century Club',
    description: 'Surpass 300 km/h (186 mph) on any public road or highway.',
    tier: 'silver',
    category: 'speed',
    rewardUSD: 25000,
    rewardDriverXp: 1000,
    unlockedBadgeIcon: 'speedometer_300',
    isUnlocked: false,
    progressPercent: 85
  },
  {
    id: 'ach_vmax_400',
    title: 'Mach Speed Titan',
    description: 'Exceed 400 km/h (248.5 mph) in the Red Rock Desert Autobahn.',
    tier: 'gold',
    category: 'speed',
    rewardUSD: 100000,
    rewardDriverXp: 5000,
    unlockedBadgeIcon: 'rocket_flame',
    isUnlocked: false,
    progressPercent: 40
  },
  {
    id: 'ach_drift_marathon',
    title: 'Tire Smoke Symphony',
    description: 'Execute a continuous 500-meter controlled drift without spinning.',
    tier: 'silver',
    category: 'drift',
    rewardUSD: 35000,
    rewardDriverXp: 1500,
    unlockedBadgeIcon: 'tire_skid_smoke',
    isUnlocked: false,
    progressPercent: 60
  },
  {
    id: 'ach_five_star_escape',
    title: 'Public Enemy #1',
    description: 'Evade a Level 5 maximum pursuit police interceptor task force.',
    tier: 'gold',
    category: 'police_evasion',
    rewardUSD: 150000,
    rewardDriverXp: 7500,
    unlockedBadgeIcon: 'police_siren_broken',
    isUnlocked: false,
    progressPercent: 20
  },
  {
    id: 'ach_supercar_collector',
    title: 'Exotic Fleet Magnate',
    description: 'Own at least 5 different hypercars in your personal multi-bay garage.',
    tier: 'gold',
    category: 'collection',
    rewardUSD: 250000,
    rewardDriverXp: 10000,
    unlockedBadgeIcon: 'gold_garage_key',
    isUnlocked: false,
    progressPercent: 40
  },
  {
    id: 'ach_platinum_master',
    title: 'RealDrive Living Legend',
    description: 'Unlock every gold and silver trophy in the entire RealDrive universe.',
    tier: 'platinum',
    category: 'career',
    rewardUSD: 1000000,
    rewardDriverXp: 50000,
    unlockedBadgeIcon: 'platinum_laurel_crown',
    isUnlocked: false,
    progressPercent: 15
  }
];

export class AchievementTrackingEngine {
  private static instance: AchievementTrackingEngine;
  private readonly userAchievements: Map<string, TrophyAchievement[]> = new Map();

  private constructor() {}

  public static getInstance(): AchievementTrackingEngine {
    if (!AchievementTrackingEngine.instance) {
      AchievementTrackingEngine.instance = new AchievementTrackingEngine();
    }
    return AchievementTrackingEngine.instance;
  }

  public getUserAchievements(userId: string): TrophyAchievement[] {
    let list = this.userAchievements.get(userId);
    if (!list) {
      list = MASTER_ACHIEVEMENTS_LIST.map(a => ({ ...a }));
      this.userAchievements.set(userId, list);
    }
    return list;
  }

  public updateSpeedMilestone(userId: string, currentSpeedKph: number): TrophyAchievement | null {
    const list = this.getUserAchievements(userId);
    const vmax300 = list.find(a => a.id === 'ach_vmax_300');
    if (vmax300 && !vmax300.isUnlocked) {
      vmax300.progressPercent = Math.min(100, Math.round((currentSpeedKph / 300.0) * 100));
      if (currentSpeedKph >= 300.0) {
        vmax300.isUnlocked = true;
        vmax300.unlockedAtTimestamp = Date.now();
        return vmax300;
      }
    }

    const vmax400 = list.find(a => a.id === 'ach_vmax_400');
    if (vmax400 && !vmax400.isUnlocked) {
      vmax400.progressPercent = Math.min(100, Math.round((currentSpeedKph / 400.0) * 100));
      if (currentSpeedKph >= 400.0) {
        vmax400.isUnlocked = true;
        vmax400.unlockedAtTimestamp = Date.now();
        return vmax400;
      }
    }

    return null;
  }
}
