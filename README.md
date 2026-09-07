# 🏎️ RealDrive — High-Performance Backend & Physics Engine

RealDrive Backend is an enterprise-grade TypeScript backend architecture powering real-time 60Hz multiplayer synchronization, telemetry flight recording, ACID in-memory ORM database, virtual dyno simulation, RDFX stock exchange, and computational physics solvers.

---

## 🌟 Core Backend Subsystems

### 1. 🖧 Micro-Framework & Network Infrastructure (`src/core/`)
* **`ServerApp`**: Lifecycle orchestrator with graceful shutdown hooks and signal handlers.
* **`RouterRegistry` & `MiddlewareRegistry`**: High-throughput REST & WebSocket request routing, token verification, and payload validators.
* **`EventBus`**: High-performance asynchronous decoupled pub/sub event dispatcher.
* **`LoggerService`**: Structured ISO-timestamped logging with log levels (`DEBUG`, `INFO`, `WARN`, `ERROR`).

### 2. 🗄️ ACID In-Memory ORM Database (`src/database/`)
* **`DatabaseClient` & `QueryBuilder`**: Schema enforcement, composite index lookups, relational join emulation, and transaction rollbacks.
* **32 Normalized Entity Schemas**: Users, Vehicles, ModParts, Garages, BankAccounts, StockTickers, OrderBooks, RaceSessions, TelemetryLogs, CareerContracts, PoliceWarrants, RadarFines, and Achievements.
* **Extensive Procedural Datasets**: Over 1,500 aftermarket performance parts, 300+ exotic supercars, 20 international racing circuit splines, and 10-year historical OHLCV candlesticks.

### 3. 🔬 Deep Mathematical Simulation Solvers (`src/simulations/physics/`)
* **Aerodynamics CFD**: Thin-airfoil lift/drag polars, ground-effect venturi equations, active DRS flaps.
* **Pacejka '96 Tire Dynamics**: Longitudinal/lateral slip curves, thermal graining/blistering models, NASA hydroplaning equations.
* **Powertrain & Combustion**: Wiebe function flame propagation, P-V indicator diagrams, compressor map efficiency curves.
* **Chassis & Active Dynamics**: 3D beam structural FEA, Skyhook adaptive suspension, electronic stability control with asymmetric yaw torque vectoring.

### 4. 🌐 Multiplayer & Real-Time Telemetry (`src/modules/multiplayer/`, `src/simulations/telemetry/`)
* **60Hz Spatial Hashing Grid**: Near-zero collision search overhead in multi-grid city coordinates.
* **Delta Binary Compression**: Bandwidth-optimized delta frame serialization for low-latency vehicle state sync.
* **BlackBox Flight Recorder**: 120Hz high-frequency circular telemetry buffer for anti-cheat verification and ghost replays.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v20+
* npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```