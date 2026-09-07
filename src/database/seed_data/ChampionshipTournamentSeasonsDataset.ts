/**
 * ============================================================================
 * REALDRIVE SEED DATA - CHAMPIONSHIP TOURNAMENT SEASONS & RIVAL RACERS
 * ============================================================================
 * Comprehensive championship calendar across 12 seasons and 5 motorsport classes:
 * 1. World Hypercar Endurance Championship (WHEC 24H)
 * 2. Apex GT3 World Challenge (Sprint & Feature Races)
 * 3. Mount Akina Touge Drift King Invitational
 * 4. Red Rock Desert V-Max Unlimited Drag Shootout
 * 5. Midnight Outlaw Underground Street League
 */

export interface ChampionshipRivalDriver {
  readonly driverId: string;
  readonly fullName: string;
  readonly nationality: string;
  readonly teamName: string;
  readonly primaryVehicleId: string;
  readonly eloRating: number;
  readonly aggressionScore: number;     // 0.0 to 1.0 (tendency to divebomb / block)
  readonly corneringConsistency: number;// 0.0 to 1.0 (lap time variance)
  readonly wetWeatherMastery: number;   // 0.0 to 1.0 (friction compensation in rain)
  readonly mechanicalSympathy: number;  // 0.0 to 1.0 (tire & engine preservation)
  readonly careerPodiums: number;
  readonly careerWins: number;
}

export interface ChampionshipRaceRound {
  readonly roundNumber: number;
  readonly raceName: string;
  readonly trackId: string;
  readonly trackName: string;
  readonly circuitLayout: string;
  readonly lapCount: number;
  readonly qualifyingDurationMin: number;
  readonly mandatoryPitStops: number;
  readonly timeOfDay: 'sunrise' | 'midday_sun' | 'golden_hour' | 'midnight_under_lights';
  readonly forecastRainProbabilityPercent: number;
  readonly prizePurseUSD: {
    readonly firstPlace: number;
    readonly secondPlace: number;
    readonly thirdPlace: number;
    readonly polePositionBonus: number;
    readonly fastestLapBonus: number;
  };
}

export interface ChampionshipSeasonCalendar {
  readonly championshipId: string;
  readonly title: string;
  readonly seasonYear: number;
  readonly tierClass: 'hypercar_prototype' | 'gt3_competition' | 'touge_drift' | 'desert_drag' | 'underground_outlaw';
  readonly totalRounds: number;
  readonly pointsSystem: readonly number[]; // Points for 1st, 2nd, 3rd...
  readonly fastestLapPointAward: number;
  readonly championTrophyName: string;
  readonly championPrizeUSD: number;
  readonly rounds: readonly ChampionshipRaceRound[];
  readonly registeredDrivers: readonly ChampionshipRivalDriver[];
}

export const CHAMPIONSHIP_SEASONS_DATABASE: Record<string, ChampionshipSeasonCalendar> = {
  'gt3_world_challenge_2026': {
    championshipId: 'gt3_world_challenge_2026',
    title: 'Apex GT3 World Challenge Series 2026',
    seasonYear: 2026,
    tierClass: 'gt3_competition',
    totalRounds: 6,
    pointsSystem: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
    fastestLapPointAward: 1,
    championTrophyName: 'Veloce Gold Cup of Champions',
    championPrizeUSD: 2500000,
    rounds: [
      {
        roundNumber: 1,
        raceName: 'Downtown Grand Prix of RealDrive',
        trackId: 'track_downtown_gp',
        trackName: 'Downtown Metropolitan Circuit',
        circuitLayout: 'Full GP 4.85km',
        lapCount: 28,
        qualifyingDurationMin: 15,
        mandatoryPitStops: 1,
        timeOfDay: 'midday_sun',
        forecastRainProbabilityPercent: 10,
        prizePurseUSD: { firstPlace: 200000, secondPlace: 120000, thirdPlace: 75000, polePositionBonus: 25000, fastestLapBonus: 10000 }
      },
      {
        roundNumber: 2,
        raceName: 'Pacific Coast Oceanfront Challenge',
        trackId: 'track_coastal_highway',
        trackName: 'Pacific Highway Scenic Loop',
        circuitLayout: 'High-Speed Sprint 6.20km',
        lapCount: 22,
        qualifyingDurationMin: 15,
        mandatoryPitStops: 1,
        timeOfDay: 'golden_hour',
        forecastRainProbabilityPercent: 25,
        prizePurseUSD: { firstPlace: 220000, secondPlace: 135000, thirdPlace: 85000, polePositionBonus: 25000, fastestLapBonus: 10000 }
      },
      {
        roundNumber: 3,
        raceName: 'Mount Akina Night Touge Trophy',
        trackId: 'track_akina_touge',
        trackName: 'Mount Akina Hillclimb / Downhill',
        circuitLayout: 'Canyon Descent 5.40km',
        lapCount: 18,
        qualifyingDurationMin: 20,
        mandatoryPitStops: 0,
        timeOfDay: 'midnight_under_lights',
        forecastRainProbabilityPercent: 40,
        prizePurseUSD: { firstPlace: 250000, secondPlace: 150000, thirdPlace: 95000, polePositionBonus: 30000, fastestLapBonus: 15000 }
      },
      {
        roundNumber: 4,
        raceName: 'Industrial Docks 200km Endurance',
        trackId: 'track_harbor_docks',
        trackName: 'Harbor Container Terminal Raceway',
        circuitLayout: 'Technical Industrial 4.10km',
        lapCount: 35,
        qualifyingDurationMin: 15,
        mandatoryPitStops: 2,
        timeOfDay: 'sunrise',
        forecastRainProbabilityPercent: 65,
        prizePurseUSD: { firstPlace: 280000, secondPlace: 175000, thirdPlace: 110000, polePositionBonus: 30000, fastestLapBonus: 15000 }
      },
      {
        roundNumber: 5,
        raceName: 'Red Rock Desert 300 SuperSprint',
        trackId: 'track_desert_speedway',
        trackName: 'Red Rock International Oval & Infield',
        circuitLayout: 'V-Max Banking 5.80km',
        lapCount: 30,
        qualifyingDurationMin: 15,
        mandatoryPitStops: 1,
        timeOfDay: 'midday_sun',
        forecastRainProbabilityPercent: 0,
        prizePurseUSD: { firstPlace: 320000, secondPlace: 195000, thirdPlace: 125000, polePositionBonus: 35000, fastestLapBonus: 20000 }
      },
      {
        roundNumber: 6,
        raceName: 'RealDrive Championship Grand Finale',
        trackId: 'track_metropolis_ring',
        trackName: 'Hyper-Metropolis Grand Ring',
        circuitLayout: 'Master Circuit 7.50km',
        lapCount: 40,
        qualifyingDurationMin: 25,
        mandatoryPitStops: 2,
        timeOfDay: 'midnight_under_lights',
        forecastRainProbabilityPercent: 30,
        prizePurseUSD: { firstPlace: 500000, secondPlace: 300000, thirdPlace: 200000, polePositionBonus: 50000, fastestLapBonus: 25000 }
      }
    ],
    registeredDrivers: [
      {
        driverId: 'drv_klaus_weber',
        fullName: 'Klaus "The Precision" Weber',
        nationality: 'Germany',
        teamName: 'Apex Works Racing Team',
        primaryVehicleId: 'veh_gt3_spec_racer',
        eloRating: 2480,
        aggressionScore: 0.65,
        corneringConsistency: 0.98,
        wetWeatherMastery: 0.92,
        mechanicalSympathy: 0.95,
        careerPodiums: 42,
        careerWins: 24
      },
      {
        driverId: 'drv_lucas_rossi',
        fullName: 'Lucas Rossi',
        nationality: 'Italy',
        teamName: 'Scuderia Veloce Corse',
        primaryVehicleId: 'veh_gt3_spec_racer',
        eloRating: 2420,
        aggressionScore: 0.88,
        corneringConsistency: 0.91,
        wetWeatherMastery: 0.86,
        mechanicalSympathy: 0.78,
        careerPodiums: 38,
        careerWins: 19
      },
      {
        driverId: 'drv_takumi_sato',
        fullName: 'Takumi "Touge Ghost" Sato',
        nationality: 'Japan',
        teamName: 'Midnight Sun Engineering',
        primaryVehicleId: 'veh_gt3_spec_racer',
        eloRating: 2390,
        aggressionScore: 0.72,
        corneringConsistency: 0.95,
        wetWeatherMastery: 0.96, // Rain specialist
        mechanicalSympathy: 0.90,
        careerPodiums: 31,
        careerWins: 15
      },
      {
        driverId: 'drv_charlotte_dubois',
        fullName: 'Charlotte Dubois',
        nationality: 'France',
        teamName: 'AeroDynamic Mirage Sport',
        primaryVehicleId: 'veh_gt3_spec_racer',
        eloRating: 2350,
        aggressionScore: 0.58,
        corneringConsistency: 0.94,
        wetWeatherMastery: 0.89,
        mechanicalSympathy: 0.96,
        careerPodiums: 26,
        careerWins: 11
      }
    ]
  }
};

export class ChampionshipSeasonManager {
  public static getSeason(id: string): ChampionshipSeasonCalendar | undefined {
    return CHAMPIONSHIP_SEASONS_DATABASE[id];
  }

  public static calculateDriverPoints(finishPositions: number[], fastestLapRounds: number[]): number {
    let points = 0;
    const ptsTable = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    for (let i = 0; i < finishPositions.length; i++) {
      const pos = finishPositions[i];
      if (pos >= 1 && pos <= 10) {
        points += ptsTable[pos - 1];
      }
      if (fastestLapRounds.includes(i + 1) && pos <= 10) {
        points += 1;
      }
    }
    return points;
  }
}
