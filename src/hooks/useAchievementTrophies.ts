/**
 * ============================================================================
 * REALDRIVE FRONTEND HOOK - TROPHIES & ACHIEVEMENTS TRACKER
 * ============================================================================
 */

import { useState, useCallback } from 'react';

export interface TrophyDto {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  readonly rewardUSD: number;
  readonly isUnlocked: boolean;
  readonly progressPercent: number;
}

export function useAchievementTrophies() {
  const [trophies, setTrophies] = useState<TrophyDto[]>([
    { id: 'ach_first_ignition', title: 'First Ignition', description: 'Start your engine and take your first drive in RealDrive.', tier: 'bronze', rewardUSD: 5000, isUnlocked: true, progressPercent: 100 },
    { id: 'ach_vmax_300', title: 'Triple Century Club', description: 'Surpass 300 km/h on any public road or highway.', tier: 'silver', rewardUSD: 25000, isUnlocked: false, progressPercent: 85 },
    { id: 'ach_vmax_400', title: 'Mach Speed Titan', description: 'Exceed 400 km/h in the Red Rock Desert Autobahn.', tier: 'gold', rewardUSD: 100000, isUnlocked: false, progressPercent: 40 },
    { id: 'ach_drift_marathon', title: 'Tire Smoke Symphony', description: 'Execute a continuous 500-meter controlled drift without spinning.', tier: 'silver', rewardUSD: 35000, isUnlocked: false, progressPercent: 60 }
  ]);

  const [recentUnlock, setRecentUnlock] = useState<TrophyDto | null>(null);

  const triggerProgress = useCallback((id: string, newProgress: number) => {
    setTrophies(prev => prev.map(t => {
      if (t.id === id) {
        const clamped = Math.min(100, Math.max(t.progressPercent, newProgress));
        const unlocked = clamped >= 100;
        const updated = { ...t, progressPercent: clamped, isUnlocked: unlocked };
        if (unlocked && !t.isUnlocked) {
          setRecentUnlock(updated);
        }
        return updated;
      }
      return t;
    }));
  }, []);

  const dismissRecentUnlock = useCallback(() => {
    setRecentUnlock(null);
  }, []);

  return {
    trophies,
    recentUnlock,
    triggerProgress,
    dismissRecentUnlock
  };
}
