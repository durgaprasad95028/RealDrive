/**
 * ============================================================================
 * REALDRIVE MULTIPLAYER — MULTIPLAYER CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - GET  /api/v1/multiplayer/rooms
 * - GET  /api/v1/multiplayer/rooms/:id
 * - POST /api/v1/multiplayer/rooms/create
 * - GET  /api/v1/multiplayer/stats
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { MultiplayerRoomEntity } from '../../database/entities/MultiplayerRoomEntity.js';
import { MultiplayerHub } from './MultiplayerHub.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';

export class MultiplayerController {
  private router: RouterRegistry;
  private database: DatabaseClient;
  private hub: MultiplayerHub;

  constructor(database: DatabaseClient = db) {
    this.router = new RouterRegistry('/multiplayer');
    this.database = database;
    this.hub = MultiplayerHub.getInstance();
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // List open rooms
    this.router.get('/rooms', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const rooms = await this.database.findMany<MultiplayerRoomEntity>('multiplayer_rooms');
      return res.json({ rooms, count: rooms.length });
    });

    // Room details
    this.router.get('/rooms/:id', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const room = await this.database.findById<MultiplayerRoomEntity>('multiplayer_rooms', req.params.id);
      if (!room) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Room not found' });
      return res.json(room);
    });

    // Create room
    this.router.post('/rooms/create', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { name, district, mode, maxPlayers, pvpCollisionsEnabled } = req.body;
      const room = await this.database.insert<MultiplayerRoomEntity>('multiplayer_rooms', {
        roomCode: `ROOM-${Date.now().toString().slice(-4)}-${Math.floor(10 + Math.random() * 90)}`,
        name: name || 'Custom Lobby',
        hostUserId: verify.payload.sub,
        district: district || 'DOWNTOWN_METROPOLIS',
        mode: mode || 'FREE_ROAM',
        maxPlayers: maxPlayers || 16,
        currentPlayersCount: 1,
        tickRateHz: 60,
        isPasswordProtected: false,
        pvpCollisionsEnabled: pvpCollisionsEnabled !== false,
        trafficAiEnabled: true,
        weatherSyncEnabled: true,
        status: 'OPEN',
      });

      return res.status(HttpStatus.CREATED).json(room);
    });

    // Multiplayer stats
    this.router.get('/stats', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      return res.json({
        activeSockets: this.hub.getConnectedClientsCount(),
        serverTickRateHz: 60,
        networkEngine: 'RealDrive 60Hz Binary WebSocket Hub',
      });
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
