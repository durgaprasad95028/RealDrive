/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - MILESTONE & ACHIEVEMENTS HTTP CONTROLLER
 * ============================================================================
 * REST API routes for player trophies, milestone tracking, and reward claims.
 */

import { HttpRequest, HttpResponse } from '../../core/HttpTypes';
import { AchievementTrackingEngine } from './AchievementTrackingEngine';

export class MilestoneController {
  private readonly achievementEngine = AchievementTrackingEngine.getInstance();

  public getMyAchievements = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user?.userId || 'guest_user';
    const achievements = this.achievementEngine.getUserAchievements(userId);

    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    return {
      status: 200,
      body: {
        success: true,
        totalAchievements: achievements.length,
        unlockedCount,
        completionPercent: Math.round((unlockedCount / achievements.length) * 100),
        achievements
      }
    };
  };

  public reportSpeedMilestone = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user?.userId || 'guest_user';
    const { speedKph } = req.body || {};

    if (!speedKph) {
      return { status: 400, body: { success: false, error: 'speedKph is required' } };
    }

    const unlocked = this.achievementEngine.updateSpeedMilestone(userId, speedKph);
    return {
      status: 200,
      body: {
        success: true,
        newUnlockAchieved: !!unlocked,
        unlockedTrophy: unlocked
      }
    };
  };
}
