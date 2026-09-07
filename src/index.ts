/**
 * ============================================================================
 * REALDRIVE SERVER — MAIN ENTRY POINT & APPLICATION BOOTSTRAP
 * ============================================================================
 * Master Server Bootstrap:
 * - Initializes DatabaseClient and registers 32 entity schemas
 * - Seeds initial state (default users, vehicle catalog, dealerships, stock tickers)
 * - Mounts REST API modules under /api/v1
 * - Initializes 60Hz Binary WebSocket Multiplayer Hub & Spatial Grid
 * - Schedules background simulation ticks (Stock market GBM, Weather, Traffic AI)
 * - Handles graceful termination and connection draining
 */

import { ServerApp } from './core/ServerApp.js';
import { ConfigManager } from './core/ConfigManager.js';
import { LoggerService } from './core/LoggerService.js';
import { DatabaseClient } from './database/DatabaseClient.js';
import { DatabaseSeeder } from './database/DatabaseSeeder.js';

// Module Controllers
import { AuthController } from './modules/auth/AuthController.js';
import { VehicleController } from './modules/vehicles/VehicleController.js';
import { CareerController } from './modules/career/CareerController.js';
import { EconomyController } from './modules/economy/EconomyController.js';
import { RacingController } from './modules/racing/RacingController.js';
import { PoliceController } from './modules/police/PoliceController.js';
import { MultiplayerController } from './modules/multiplayer/MultiplayerController.js';

// Realtime & Simulation Engines
import { MultiplayerHub } from './modules/multiplayer/MultiplayerHub.js';
import { StockExchangeTickEngine } from './modules/economy/StockExchangeTickEngine.js';
import { DynamicWeatherEngine } from './simulations/DynamicWeatherEngine.js';
import { TrafficAiCoordinator } from './simulations/TrafficAiCoordinator.js';

async function bootstrap() {
  const logger = LoggerService.getInstance().createScopedLogger('Bootstrap');
  const config = ConfigManager.getInstance();

  logger.info('================================================================');
  logger.info(`Starting RealDrive High-Performance Backend v1.0.0...`);
  logger.info(`Node Environment: ${config.nodeEnv}`);
  logger.info('================================================================');

  // 1. Connect & Initialize Database
  const db = DatabaseClient.getInstance();
  await db.connect();
  DatabaseSeeder.registerAllSchemas(db);
  await DatabaseSeeder.seedAll(db);

  // 2. Initialize Core Server Application
  const app = new ServerApp({
    port: config.port,
    host: config.host,
    enableCors: true,
    enableRateLimiting: true,
  });

  // 3. Mount Microservice API Controllers
  const authController = new AuthController();
  const vehicleController = new VehicleController();
  const careerController = new CareerController();
  const economyController = new EconomyController();
  const racingController = new RacingController();
  const policeController = new PoliceController();
  const multiplayerController = new MultiplayerController(db);

  app.mountModule('/api/v1', authController.getRouter());
  app.mountModule('/api/v1', vehicleController.getRouter());
  app.mountModule('/api/v1', careerController.getRouter());
  app.mountModule('/api/v1', economyController.getRouter());
  app.mountModule('/api/v1', racingController.getRouter());
  app.mountModule('/api/v1', policeController.getRouter());
  app.mountModule('/api/v1', multiplayerController.getRouter());

  // 4. Initialize Multiplayer Hub & WebSocket Upgrade
  const multiplayerHub = MultiplayerHub.getInstance();
  app.onWsUpgrade((req, socket, head) => {
    return multiplayerHub.handleUpgrade(req, socket, head);
  });

  // 5. Initialize Server Simulations
  const stockEngine = new StockExchangeTickEngine(db);
  const weatherEngine = new DynamicWeatherEngine();
  const trafficAi = new TrafficAiCoordinator();
  trafficAi.spawnInitialTraffic();

  // Background Tasks
  // Stock market ticks every 10 seconds
  app.registerBackgroundTask('StockExchangeTick', 10000, async () => {
    await stockEngine.tickMarket();
  });

  // Weather simulation step every 2 seconds
  app.registerBackgroundTask('WeatherStep', 2000, () => {
    weatherEngine.step(2.0);
  });

  // Traffic AI coordinator step every 100ms
  app.registerBackgroundTask('TrafficAiStep', 100, () => {
    trafficAi.step(0.1);
  });

  // 6. Start Server
  const httpServer = await app.start(config.port, config.host);
  multiplayerHub.initialize(httpServer);

  logger.info(`RealDrive Full-Stack Backend initialized successfully.`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during RealDrive backend bootstrap:', err);
  process.exit(1);
});
