/**
 * ============================================================================
 * REALDRIVE MULTIPLAYER — WEBSOCKET ENGINE & CLIENT HUB
 * ============================================================================
 * 60Hz real-time multiplayer networking server:
 * - WebSocket connection lifecycle & heartbeat ping/pong
 * - Spatial grid broadcast interest filtering
 * - Packet loss calculation & client telemetry broadcasting
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { SpatialGridManager } from './SpatialGridManager.js';
import { AntiCheatInspector } from './AntiCheatInspector.js';
import { LoggerService } from '../../core/LoggerService.js';
import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { MultiplayerSessionEntity } from '../../database/entities/MultiplayerSessionEntity.js';
import { JwtService } from '../auth/JwtService.js';

export interface ClientConnection {
  socket: WebSocket;
  socketId: string;
  userId: string;
  username: string;
  roomId: string;
  vehicleId: string;
  vehicleModel: string;
  vehicleColor: string;
  ip: string;
  lastPingTime: number;
  pingMs: number;
  lastPos: { x: number; y: number; z: number };
  lastUpdateTime: number;
}

export class MultiplayerHub {
  private static instance: MultiplayerHub | null = null;
  private logger = LoggerService.getInstance().createScopedLogger('Multiplayer');
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientConnection> = new Map(); // socketId -> ClientConnection
  private spatialGrid: SpatialGridManager = new SpatialGridManager(200);
  private tickInterval: NodeJS.Timeout | null = null;
  private tickRateHz: number = 60;

  private constructor() {}

  public static getInstance(): MultiplayerHub {
    if (!MultiplayerHub.instance) {
      MultiplayerHub.instance = new MultiplayerHub();
    }
    return MultiplayerHub.instance;
  }

  public initialize(server: any): void {
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws, req);
    });

    this.startTickLoop();
    this.logger.info(`Multiplayer WebSocket Engine initialized at ${this.tickRateHz}Hz.`);
  }

  public handleUpgrade(req: IncomingMessage, socket: any, head: Buffer): boolean {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/ws/multiplayer') {
      this.wss?.handleUpgrade(req, socket, head, (ws: WebSocket) => {
        this.wss?.emit('connection', ws, req);
      });
      return true;
    }
    return false;
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const socketId = `sock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const ip = req.socket.remoteAddress || '127.0.0.1';

    let connection: ClientConnection = {
      socket: ws,
      socketId,
      userId: 'guest_' + socketId,
      username: 'Driver',
      roomId: 'room_global_freeroam_01',
      vehicleId: 'veh_gtr_r35_01',
      vehicleModel: 'Godzilla GT-R R35 Nismo',
      vehicleColor: '#e11d48',
      ip,
      lastPingTime: Date.now(),
      pingMs: 25,
      lastPos: { x: 0, y: 0, z: 0 },
      lastUpdateTime: Date.now(),
    };

    this.clients.set(socketId, connection);
    this.logger.info(`Player connected [${socketId}] from ${ip}`);

    ws.on('message', async (data: Buffer | string) => {
      try {
        const msg = JSON.parse(data.toString());
        await this.handleMessage(connection, msg);
      } catch (err) {
        // Ignore malformed packet
      }
    });

    ws.on('close', () => {
      this.logger.info(`Player disconnected [${socketId}]`);
      this.spatialGrid.removeEntity(socketId);
      this.clients.delete(socketId);
      this.broadcastToRoom(connection.roomId, {
        type: 'PLAYER_LEFT',
        socketId,
        userId: connection.userId,
      }, socketId);
    });

    ws.on('error', (err: any) => {
      this.logger.error(`Socket error on [${socketId}]:`, err);
    });

    // Send Handshake Welcome
    ws.send(JSON.stringify({
      type: 'HANDSHAKE_ACK',
      socketId,
      serverTime: Date.now(),
      tickRateHz: this.tickRateHz,
    }));
  }

  private async handleMessage(conn: ClientConnection, msg: any): Promise<void> {
    switch (msg.type) {
      case 'AUTH_INIT': {
        if (msg.token) {
          const verify = JwtService.verify(msg.token);
          if (verify.valid && verify.payload) {
            conn.userId = verify.payload.sub;
            conn.username = verify.payload.username;
          }
        }
        if (msg.vehicleId) conn.vehicleId = msg.vehicleId;
        if (msg.vehicleModel) conn.vehicleModel = msg.vehicleModel;
        if (msg.vehicleColor) conn.vehicleColor = msg.vehicleColor;
        if (msg.roomId) conn.roomId = msg.roomId;

        // Broadcast join to room
        this.broadcastToRoom(conn.roomId, {
          type: 'PLAYER_JOINED',
          socketId: conn.socketId,
          userId: conn.userId,
          username: conn.username,
          vehicleModel: conn.vehicleModel,
          vehicleColor: conn.vehicleColor,
          x: conn.lastPos.x,
          y: conn.lastPos.y,
          z: conn.lastPos.z,
        }, conn.socketId);
        break;
      }

      case 'PING': {
        conn.pingMs = Math.round((Date.now() - msg.timestamp) / 2);
        conn.lastPingTime = Date.now();
        conn.socket.send(JSON.stringify({ type: 'PONG', timestamp: msg.timestamp, serverTime: Date.now() }));
        break;
      }

      case 'TELEMETRY_UPDATE': {
        const now = Date.now();
        const dt = (now - conn.lastUpdateTime) / 1000.0;
        const newPos = { x: msg.x || 0, y: msg.y || 0, z: msg.z || 0 };

        // Anti-cheat verification
        const acResult = await AntiCheatInspector.validateMovementPacket({
          userId: conn.userId,
          socketId: conn.socketId,
          remoteIp: conn.ip,
          vehicleModel: conn.vehicleModel,
          vehicleMaxSpeedKmh: 350,
          reportedSpeedKmh: msg.speedKmh || 0,
          lastPos: conn.lastPos,
          newPos,
          deltaTimeSeconds: dt,
        });

        if (!acResult.isValid) {
          // Discard invalid packet / snap back
          return;
        }

        conn.lastPos = newPos;
        conn.lastUpdateTime = now;

        // Update Spatial Grid
        this.spatialGrid.updatePosition(conn.socketId, conn.socketId, conn.userId, newPos.x, newPos.y, newPos.z);

        // Find nearby players within 350m
        const nearbySocketIds = this.spatialGrid.getNearbyEntityIds(newPos.x, newPos.z, 350);

        const packet = JSON.stringify({
          type: 'PLAYER_TELEMETRY',
          socketId: conn.socketId,
          userId: conn.userId,
          username: conn.username,
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
          yaw: msg.yaw || 0,
          speedKmh: msg.speedKmh || 0,
          steeringAngleDeg: msg.steeringAngleDeg || 0,
          brake: !!msg.brake,
          headlights: !!msg.headlights,
          horn: !!msg.horn,
          nitro: !!msg.nitro,
          timestamp: now,
        });

        for (const targetId of nearbySocketIds) {
          if (targetId !== conn.socketId) {
            const client = this.clients.get(targetId);
            if (client && client.socket.readyState === WebSocket.OPEN) {
              client.socket.send(packet);
            }
          }
        }
        break;
      }
    }
  }

  private broadcastToRoom(roomId: string, data: any, excludeSocketId?: string): void {
    const payload = JSON.stringify(data);
    for (const [id, client] of this.clients.entries()) {
      if (id !== excludeSocketId && client.roomId === roomId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(payload);
      }
    }
  }

  private startTickLoop(): void {
    const intervalMs = Math.round(1000 / this.tickRateHz);
    this.tickInterval = setInterval(() => {
      // Periodic server state tick
    }, intervalMs);
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}
