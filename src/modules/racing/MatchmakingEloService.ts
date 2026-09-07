/**
 * ============================================================================
 * REALDRIVE RACING — ELO MATCHMAKING & SKILL RATING ENGINE
 * ============================================================================
 * Competitive multiplayer driver rating algorithms:
 * - Dynamic K-factor scaling based on driver experience
 * - Expected win probability calculation: E_A = 1 / (1 + 10^((R_B - R_A)/400))
 * - Tier promotions (Bronze -> Silver -> Gold -> Platinum -> Diamond -> Apex Legend)
 */

export class MatchmakingEloService {
  public static calculateEloChange(
    playerRating: number,
    opponentRating: number,
    playerWon: boolean,
    kFactor: number = 32
  ): number {
    const expectedScore = 1.0 / (1.0 + Math.pow(10, (opponentRating - playerRating) / 400.0));
    const actualScore = playerWon ? 1.0 : 0.0;
    const delta = Math.round(kFactor * (actualScore - expectedScore));
    return delta;
  }

  public static getSkillTier(rating: number): {
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'APEX_LEGEND';
    badge: string;
    division: 1 | 2 | 3 | 4;
  } {
    if (rating < 1200) return { tier: 'BRONZE', badge: 'shield', division: 1 };
    if (rating < 1500) return { tier: 'SILVER', badge: 'award', division: 2 };
    if (rating < 1800) return { tier: 'GOLD', badge: 'zap', division: 3 };
    if (rating < 2100) return { tier: 'PLATINUM', badge: 'star', division: 4 };
    if (rating < 2500) return { tier: 'DIAMOND', badge: 'diamond', division: 1 };
    return { tier: 'APEX_LEGEND', badge: 'crown', division: 1 };
  }
}
