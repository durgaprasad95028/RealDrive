/**
 * ============================================================================
 * REALDRIVE RACING — RACING CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - GET  /api/v1/racing/tournaments
 * - GET  /api/v1/racing/tournaments/:id
 * - POST /api/v1/racing/tournaments/:id/register
 * - GET  /api/v1/racing/leaderboards
 * - POST /api/v1/racing/leaderboards
 * - GET  /api/v1/racing/tracks
 * - POST /api/v1/racing/tracks
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { TournamentLeagueService } from './TournamentLeagueService.js';
import { LeaderboardAggregationService } from './LeaderboardAggregationService.js';
import { TrackBlueprintService } from './TrackBlueprintService.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';

export class RacingController {
  private router: RouterRegistry;
  private tournamentService: TournamentLeagueService;
  private leaderboardService: LeaderboardAggregationService;
  private trackService: TrackBlueprintService;

  constructor() {
    this.router = new RouterRegistry('/racing');
    this.tournamentService = new TournamentLeagueService();
    this.leaderboardService = new LeaderboardAggregationService();
    this.trackService = new TrackBlueprintService();
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // Tournaments
    this.router.get('/tournaments', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const tournaments = await this.tournamentService.getActiveTournaments();
      return res.json({ tournaments, count: tournaments.length });
    });

    this.router.get('/tournaments/:id', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const tourn = await this.tournamentService.getTournamentById(req.params.id);
      if (!tourn) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Tournament not found' });
      const entries = await this.tournamentService.getTournamentEntries(req.params.id);
      return res.json({ tournament: tourn, entries });
    });

    this.router.post('/tournaments/:id/register', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { vehicleId } = req.body;
      const entry = await this.tournamentService.registerDriver(req.params.id, verify.payload.sub, vehicleId);
      return res.status(HttpStatus.CREATED).json(entry);
    });

    // Leaderboards
    this.router.get('/leaderboards', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const category = (req.query.category as string) || 'TOP_SPEED_GLOBAL';
      const scores = await this.leaderboardService.getLeaderboard(category);
      return res.json({ category, scores, count: scores.length });
    });

    this.router.post('/leaderboards', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { category, score, formattedScore, vehicleName, district } = req.body;
      const entry = await this.leaderboardService.submitScore(
        verify.payload.sub,
        category,
        score,
        formattedScore,
        vehicleName,
        district
      );
      return res.status(HttpStatus.CREATED).json(entry);
    });

    // Tracks
    this.router.get('/tracks', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const district = req.query.district as string;
      const tracks = await this.trackService.getPublishedTracks(district);
      return res.json({ tracks, count: tracks.length });
    });

    this.router.post('/tracks', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const track = await this.trackService.createTrack(verify.payload.sub, verify.payload.username, req.body);
      return res.status(HttpStatus.CREATED).json(track);
    });
  }

  private extractToken(req: CustomHttpRequest): string | null {
    const authHeader = req.headers['authorization'] as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    if (req.cookies && req.cookies['token']) {
      return req.cookies['token'];
    }
    return null;
  }
}
