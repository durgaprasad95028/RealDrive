/**
 * TournamentCircuitEngine — Professional Motorsports Leagues, AI Rival Drivers & Championship Standings
 */

export type RacingLeagueTier =
  | 'STREET_UNDERGROUND_CLUB'
  | 'TOUGE_DRIFT_BATTLE'
  | 'PRO_GT_SPRINT_CUP'
  | 'QUARTER_MILE_DRAG_MASTERS'
  | 'ENDURANCE_24H_CHALLENGE'
  | 'HEAVY_HAUL_TRACTOR_PULL';

export type RaceEventType = 'CIRCUIT_SPRINT' | 'TIME_ATTACK_LAP' | 'DRIFT_TANDEM' | 'DRAG_ELIMINATOR' | 'POINT_TO_POINT';

export interface AIRivalDriver {
  id: string;
  name: string;
  avatarIcon: string;
  countryCode: string;
  vehicleName: string;
  vehicleClass: string;
  driverSkillRating: number; // 0 to 100
  aggressivenessRating: number; // 0 to 100
  brakingConsistency: number; // 0 to 100
  overtakingTendency: number; // 0 to 100
  currentChampionshipPoints: number;
  seasonWins: number;
  podiums: number;
}

export interface RaceEventDefinition {
  id: string;
  title: string;
  eventType: RaceEventType;
  trackName: string;
  district: string;
  laps: number;
  trackDistanceKm: number;
  gridSize: number;
  requiredTier: string;
  prizeMoneyFirst: number;
  prizeMoneySecond: number;
  prizeMoneyThird: number;
  pointsFirst: number;
  pointsSecond: number;
  pointsThird: number;
  weatherCondition: 'SUNNY_DRY' | 'HEAVY_RAIN_WET' | 'NIGHT_NEON' | 'SUNSET_FOG';
  rivals: AIRivalDriver[];
}

export interface ChampionshipSeason {
  id: string;
  name: string;
  tier: RacingLeagueTier;
  totalRounds: number;
  currentRound: number;
  events: RaceEventDefinition[];
  leaderboard: Array<{
    driverName: string;
    vehicleName: string;
    points: number;
    wins: number;
    isPlayer: boolean;
  }>;
}

export class TournamentCircuitEngine {
  public static readonly LEAGUE_ROSTER: ChampionshipSeason[] = [
    {
      id: 'league_street_underground',
      name: 'Street King Underground Midnight League',
      tier: 'STREET_UNDERGROUND_CLUB',
      totalRounds: 5,
      currentRound: 1,
      events: [
        {
          id: 'evt_downtown_sprint_1',
          title: 'Downtown Neon Grid GP',
          eventType: 'CIRCUIT_SPRINT',
          trackName: 'Apex Grand Metropolis Circuit',
          district: 'Downtown',
          laps: 3,
          trackDistanceKm: 4.8,
          gridSize: 8,
          requiredTier: 'A',
          prizeMoneyFirst: 18000,
          prizeMoneySecond: 10000,
          prizeMoneyThird: 5500,
          pointsFirst: 25,
          pointsSecond: 18,
          pointsThird: 15,
          weatherCondition: 'NIGHT_NEON',
          rivals: [
            {
              id: 'riv_marcus_vance',
              name: 'Marcus Vance',
              avatarIcon: '🏎️',
              countryCode: 'USA',
              vehicleName: 'Detroit Phantom SRT Supercharged 6.2',
              vehicleClass: 'AMERICAN_MUSCLE',
              driverSkillRating: 88,
              aggressivenessRating: 92,
              brakingConsistency: 84,
              overtakingTendency: 90,
              currentChampionshipPoints: 0,
              seasonWins: 0,
              podiums: 0,
            },
            {
              id: 'riv_kenji_takahashi',
              name: 'Kenji Takahashi',
              avatarIcon: '⚡',
              countryCode: 'JPN',
              vehicleName: 'Yokohama V-Spec II Twin Turbo',
              vehicleClass: 'JDM_DRIFT',
              driverSkillRating: 94,
              aggressivenessRating: 78,
              brakingConsistency: 96,
              overtakingTendency: 85,
              currentChampionshipPoints: 0,
              seasonWins: 0,
              podiums: 0,
            },
            {
              id: 'riv_klaus_weber',
              name: 'Klaus Weber',
              avatarIcon: '🏁',
              countryCode: 'DEU',
              vehicleName: 'Bavaria M5 ClubSport Twin-Turbo',
              vehicleClass: 'GERMAN_EXECUTIVE',
              driverSkillRating: 91,
              aggressivenessRating: 82,
              brakingConsistency: 90,
              overtakingTendency: 82,
              currentChampionshipPoints: 0,
              seasonWins: 0,
              podiums: 0,
            },
          ],
        },
      ],
      leaderboard: [
        { driverName: 'Player (You)', vehicleName: 'Selected Vehicle', points: 0, wins: 0, isPlayer: true },
        { driverName: 'Kenji Takahashi', vehicleName: 'Yokohama Skyline GT-R', points: 0, wins: 0, isPlayer: false },
        { driverName: 'Marcus Vance', vehicleName: 'Detroit Hellcat', points: 0, wins: 0, isPlayer: false },
        { driverName: 'Klaus Weber', vehicleName: 'Bavaria M5 CS', points: 0, wins: 0, isPlayer: false },
      ],
    },
    {
      id: 'league_touge_drift',
      name: 'Skyline Touge Drift Masters Invitational',
      tier: 'TOUGE_DRIFT_BATTLE',
      totalRounds: 4,
      currentRound: 1,
      events: [
        {
          id: 'evt_touge_downhill_1',
          title: 'Canyon Pass Downhill Drift Tandem',
          eventType: 'DRIFT_TANDEM',
          trackName: 'Skyline Touge Switchback',
          district: 'Mountain Pass',
          laps: 2,
          trackDistanceKm: 6.2,
          gridSize: 2, // 1v1 Tandem Battle
          requiredTier: 'A',
          prizeMoneyFirst: 24000,
          prizeMoneySecond: 12000,
          prizeMoneyThird: 6000,
          pointsFirst: 30,
          pointsSecond: 20,
          pointsThird: 12,
          weatherCondition: 'SUNSET_FOG',
          rivals: [
            {
              id: 'riv_daiki_fujiwara',
              name: 'Daiki Fujiwara',
              avatarIcon: '🔥',
              countryCode: 'JPN',
              vehicleName: 'Hiroshima Efini Twin-Rotary Turbo',
              vehicleClass: 'JDM_DRIFT',
              driverSkillRating: 98,
              aggressivenessRating: 85,
              brakingConsistency: 95,
              overtakingTendency: 92,
              currentChampionshipPoints: 0,
              seasonWins: 0,
              podiums: 0,
            },
          ],
        },
      ],
      leaderboard: [
        { driverName: 'Player (You)', vehicleName: 'Selected Vehicle', points: 0, wins: 0, isPlayer: true },
        { driverName: 'Daiki Fujiwara', vehicleName: 'Hiroshima RX-7 FD', points: 0, wins: 0, isPlayer: false },
      ],
    },
  ];

  public static getLeagueById(leagueId: string): ChampionshipSeason | undefined {
    return this.LEAGUE_ROSTER.find((l) => l.id === leagueId);
  }

  public static simulateRaceResults(
    event: RaceEventDefinition,
    playerFinishPosition: number
  ): {
    podium: Array<{ position: number; driverName: string; timeFormatted: string; prize: number; points: number }>;
    isPlayerWinner: boolean;
  } {
    const sortedRivals = [...event.rivals].sort((a, b) => b.driverSkillRating - a.driverSkillRating);
    const podium: Array<{ position: number; driverName: string; timeFormatted: string; prize: number; points: number }> = [];

    const baseLapTime = (event.trackDistanceKm / 140) * 3600; // seconds

    for (let pos = 1; pos <= Math.min(event.gridSize, 3); pos++) {
      let driverName = '';
      if (pos === playerFinishPosition) {
        driverName = 'Player (You)';
      } else {
        const rival = sortedRivals[pos > playerFinishPosition ? pos - 2 : pos - 1];
        driverName = rival ? rival.name : `AI Driver #${pos}`;
      }

      const totalTimeSec = baseLapTime * event.laps + (pos - 1) * 1.8 + Math.random() * 0.5;
      const mins = Math.floor(totalTimeSec / 60);
      const secs = (totalTimeSec % 60).toFixed(3).padStart(6, '0');

      let prize = 0;
      let pts = 0;
      if (pos === 1) {
        prize = event.prizeMoneyFirst;
        pts = event.pointsFirst;
      } else if (pos === 2) {
        prize = event.prizeMoneySecond;
        pts = event.pointsSecond;
      } else if (pos === 3) {
        prize = event.prizeMoneyThird;
        pts = event.pointsThird;
      }

      podium.push({
        position: pos,
        driverName,
        timeFormatted: `${mins}:${secs}`,
        prize,
        points: pts,
      });
    }

    return {
      podium,
      isPlayerWinner: playerFinishPosition === 1,
    };
  }
}
