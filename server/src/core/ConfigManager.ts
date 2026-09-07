/**
 * ConfigManager — Environment Configuration & Secrets Management for RealDrive Backend
 */

export interface ServerConfig {
  env: 'development' | 'production' | 'test';
  httpPort: number;
  wsPort: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
  redisUrl: string;
  corsOrigins: string[];
  maxPayloadSizeMb: number;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
  multiplayerTickRateHz: number;
  physicsTickRateHz: number;
  spatialGridBucketSizeM: number;
  enableAntiCheatValidation: boolean;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ServerConfig;

  private constructor() {
    this.config = {
      env: (process.env.NODE_ENV as any) || 'development',
      httpPort: parseInt(process.env.PORT || '8080', 10),
      wsPort: parseInt(process.env.WS_PORT || '8081', 10),
      jwtSecret: process.env.JWT_SECRET || 'realdrive_super_secret_jwt_signing_key_2026_apex',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
      databaseUrl: process.env.DATABASE_URL || 'postgresql://realdrive:password@localhost:5432/realdrivedb',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
      maxPayloadSizeMb: 10,
      rateLimitMaxRequests: 1000,
      rateLimitWindowMs: 60000,
      multiplayerTickRateHz: 60,
      physicsTickRateHz: 60,
      spatialGridBucketSizeM: 200,
      enableAntiCheatValidation: true,
    };
  }

  public static getInstance(): ConfigManager {
    if (!this.instance) {
      this.instance = new ConfigManager();
    }
    return this.instance;
  }

  public get<K extends keyof ServerConfig>(key: K): ServerConfig[K] {
    return this.config[key];
  }

  public getAll(): ServerConfig {
    return { ...this.config };
  }
}

export const configManager = ConfigManager.getInstance();
