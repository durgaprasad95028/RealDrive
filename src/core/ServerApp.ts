/**
 * ============================================================================
 * REALDRIVE SERVER CORE — MAIN SERVER APPLICATION CONTAINER
 * ============================================================================
 * Production Node.js HTTP/WebSocket server orchestration container:
 * - High concurrency request pipeline
 * - Graceful shutdown & connection draining
 * - Realtime WebSocket multiplexing
 * - Health check & Prometheus-compatible metrics probe
 * - Dynamic route mounting
 */

import http, { IncomingMessage, ServerResponse } from 'http';
import { ConfigManager } from './ConfigManager.js';
import { LoggerService, ScopedLogger } from './LoggerService.js';
import { CustomHttpRequest, CustomHttpResponse, MiddlewareHandler, HttpStatus } from './HttpTypes.js';
import { RouterRegistry } from './RouterRegistry.js';
import { MiddlewareRegistry } from './MiddlewareRegistry.js';
import { EventBus } from './EventBus.js';

export interface ServerAppOptions {
  port?: number;
  host?: string;
  enableCors?: boolean;
  enableRateLimiting?: boolean;
  enableCompression?: boolean;
}

export class ServerApp {
  private server: http.Server | null = null;
  private logger: ScopedLogger;
  private config: ConfigManager;
  private router: RouterRegistry;
  private eventBus: EventBus;
  private isShuttingDown: boolean = false;
  private activeSockets: Set<any> = new Set();
  private wsUpgradeHandlers: Array<(req: IncomingMessage, socket: any, head: Buffer) => boolean> = [];
  private backgroundTasks: Array<{ name: string; interval: NodeJS.Timeout }> = [];

  constructor(options: ServerAppOptions = {}) {
    this.logger = LoggerService.getInstance().createScopedLogger('ServerApp');
    this.config = ConfigManager.getInstance();
    this.router = new RouterRegistry();
    this.eventBus = EventBus.getInstance();

    this.setupCoreMiddlewares(options);
    this.setupDiagnosticRoutes();
  }

  private setupCoreMiddlewares(options: ServerAppOptions): void {
    // 1. Request ID and timing
    this.router.use(MiddlewareRegistry.requestId());

    // 2. Response object enhancer (.json, .status, .send)
    this.router.use(MiddlewareRegistry.responseEnhancer());

    // 3. Security headers (Helmet)
    this.router.use(MiddlewareRegistry.securityHeaders());

    // 4. CORS
    if (options.enableCors !== false) {
      this.router.use(MiddlewareRegistry.cors({
        origin: this.config.corsOrigins,
        credentials: true,
      }));
    }

    // 5. Rate Limiting
    if (options.enableRateLimiting !== false) {
      this.router.use(MiddlewareRegistry.rateLimiter({
        windowMs: 60000,
        maxRequests: 600,
      }));
    }

    // 6. Request Logger
    this.router.use(MiddlewareRegistry.loggerMiddleware());

    // 7. Body Parser
    this.router.use(MiddlewareRegistry.bodyParser({ maxBodySize: 20 * 1024 * 1024 }));
  }

  private setupDiagnosticRoutes(): void {
    // Health check endpoint
    this.router.get('/health', (req, res) => {
      const memoryUsage = process.memoryUsage();
      return res.json({
        status: 'UP',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: this.config.nodeEnv,
        memory: {
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        },
      });
    });

    // Version endpoint
    this.router.get('/version', (req, res) => {
      return res.json({
        service: 'realdrive-backend',
        version: '1.0.0-PROD',
        engine: 'Node.js ' + process.version,
        timestamp: new Date().toISOString(),
      });
    });

    // Prometheus-style metrics endpoint
    this.router.get('/metrics', (req, res) => {
      const logMetrics = LoggerService.getInstance().getMetrics();
      const mem = process.memoryUsage();
      const lines = [
        '# HELP realdrive_uptime_seconds Process uptime in seconds',
        '# TYPE realdrive_uptime_seconds gauge',
        `realdrive_uptime_seconds ${process.uptime()}`,
        '# HELP realdrive_memory_heap_used_bytes Memory heap used in bytes',
        '# TYPE realdrive_memory_heap_used_bytes gauge',
        `realdrive_memory_heap_used_bytes ${mem.heapUsed}`,
        '# HELP realdrive_memory_rss_bytes Resident set size in bytes',
        '# TYPE realdrive_memory_rss_bytes gauge',
        `realdrive_memory_rss_bytes ${mem.rss}`,
      ];

      for (const [key, count] of Object.entries(logMetrics)) {
        lines.push(`realdrive_log_${key} ${count}`);
      }

      res.setHeader('Content-Type', 'text/plain; version=0.0.4');
      return res.send(lines.join('\n'));
    });
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  public mountModule(prefix: string, subRouter: RouterRegistry): this {
    this.router.mount(prefix, subRouter);
    this.logger.info(`Mounted sub-router at prefix "${prefix}" (${subRouter.getRoutes().length} endpoints)`);
    return this;
  }

  public onWsUpgrade(handler: (req: IncomingMessage, socket: any, head: Buffer) => boolean): void {
    this.wsUpgradeHandlers.push(handler);
  }

  public registerBackgroundTask(name: string, intervalMs: number, task: () => void | Promise<void>): void {
    const timer = setInterval(async () => {
      try {
        await task();
      } catch (err) {
        this.logger.error(`Error in background task "${name}":`, err);
      }
    }, intervalMs);

    this.backgroundTasks.push({ name, interval: timer });
    this.logger.info(`Registered background task "${name}" (interval: ${intervalMs}ms)`);
  }

  public async start(port?: number, host?: string): Promise<http.Server> {
    const listenPort = port || this.config.port;
    const listenHost = host || this.config.host;

    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
        if (this.isShuttingDown) {
          res.writeHead(HttpStatus.SERVICE_UNAVAILABLE, { 'Connection': 'close' });
          res.end(JSON.stringify({ error: 'Server is currently shutting down.' }));
          return;
        }

        try {
          await this.router.handle(req as CustomHttpRequest, res as CustomHttpResponse);
        } catch (error) {
          const errorHandler = MiddlewareRegistry.errorHandler();
          errorHandler(error, req as CustomHttpRequest, res as CustomHttpResponse, () => {});
        }
      });

      // Socket tracking for graceful connection draining
      this.server.on('connection', (socket) => {
        this.activeSockets.add(socket);
        socket.on('close', () => {
          this.activeSockets.delete(socket);
        });
      });

      // WebSocket Upgrade handling
      this.server.on('upgrade', (req: IncomingMessage, socket: any, head: Buffer) => {
        let handled = false;
        for (const handler of this.wsUpgradeHandlers) {
          if (handler(req, socket, head)) {
            handled = true;
            break;
          }
        }
        if (!handled) {
          socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
          socket.destroy();
        }
      });

      this.server.on('error', (err) => {
        this.logger.fatal('Fatal HTTP server socket error:', err);
        reject(err);
      });

      this.server.listen(listenPort, listenHost, () => {
        this.logger.info(`================================================================`);
        this.logger.info(`REALDRIVE MULTIPLAYER & MICROSERVICE BACKEND ENGINE ONLINE`);
        this.logger.info(`HTTP Server listening on http://${listenHost}:${listenPort}`);
        this.logger.info(`Environment: ${this.config.nodeEnv.toUpperCase()}`);
        this.logger.info(`Registered Endpoints: ${this.router.getRoutes().length}`);
        this.logger.info(`================================================================`);
        this.setupSignalHandlers();
        resolve(this.server!);
      });
    });
  }

  private setupSignalHandlers(): void {
    const handleShutdown = async (signal: string) => {
      this.logger.warn(`Received ${signal}. Initiating graceful shutdown...`);
      await this.stop();
      process.exit(0);
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  }

  public async stop(): Promise<void> {
    this.isShuttingDown = true;
    this.logger.info('Stopping background tasks...');
    for (const task of this.backgroundTasks) {
      clearInterval(task.interval);
    }
    this.backgroundTasks = [];

    // Close all open sockets
    this.logger.info(`Draining ${this.activeSockets.size} active TCP sockets...`);
    for (const socket of this.activeSockets) {
      socket.destroy();
    }
    this.activeSockets.clear();

    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => {
          this.logger.info('HTTP Server stopped successfully.');
          resolve();
        });
      });
      this.server = null;
    }

    LoggerService.getInstance().destroy();
  }

  public getHttpServer(): http.Server | null {
    return this.server;
  }
}
