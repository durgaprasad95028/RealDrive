# 🏎️ RealDrive — Realistic Car Life Simulator & 3D Driving Engine

RealDrive is an enterprise full-stack automotive platform featuring a **React 18 + Three.js WebGL 3D Driving Simulation Client** and a high-performance **TypeScript Microservice Backend** with CFD aerodynamics, Pacejka '96 tire models, and 60Hz multiplayer synchronization.

---

## 🎮 Application Flow

```
LOGIN (/) ──► DASHBOARD (/dashboard) ──► CAR SELECTION (/cars) ──► 3D DRIVING GAME (/game)
```

1. **Login Page (`/login` & `/`)**: Edge-to-edge full-screen dark automotive login with credential validation (`player` / `player123`).
2. **Dashboard (`/dashboard`)**: Central driver hub with telemetry stats, wallet balance, active vehicle status, and navigation launchpad.
3. **Car Selection & Garage (`/cars`)**: Multi-class showroom (Compact, Sedan, Supercar, SUV, Taxi, Bus, Truck), specifications, purchase system, and active vehicle selector.
4. **3D Driving World (`/game`)**: Real-time Three.js WebGL driving simulation with First-Person Cockpit driver view, animated steering wheel, two-way AI traffic, traffic lights, and Airport Taxi mission.

---

## 🔑 Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Driver Account** | `player` | `player123` *(or click "🚗 Fill Demo Driver")* |
| **Admin Console** | `admin` | `admin123` |

---

## 🕹️ Driving Controls

| Action | Primary Key | Secondary Key |
| :--- | :--- | :--- |
| **Accelerate** | `W` | `Up Arrow (↑)` |
| **Brake / Reverse** | `S` | `Down Arrow (↓)` |
| **Steer Left** | `A` | `Left Arrow (←)` |
| **Steer Right** | `D` | `Right Arrow (→)` |
| **Handbrake** | `Spacebar` | — |
| **Camera View** | `C` | `V` *(Cockpit $\leftrightarrow$ Chase)* |
| **Headlights** | `H` | — |
| **Time of Day** | `T` | — *(Day $\rightarrow$ Sunset $\rightarrow$ Night)* |
| **Pause Menu** | `Esc` | `P` |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ or v20+)
* npm

### 🎨 Frontend (3D WebGL Driving Client)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
# or
npm start
```

### ⚙️ Backend (TypeScript Microservices & Multiplayer Engine)

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Start backend development server
npm run dev

# Production build & start
npm run build
npm start
```

---

## 🌿 Git Structure & Branches

* **`main`**: Full-stack integration branch with full pull request merge history.
* **`frontend`**: Dedicated frontend WebGL driving simulation client.
* **`backend`**: Dedicated TypeScript backend microservices & physics simulation engines.
* **Feature Branches**:
  * `feature/authentication`: Driver authentication flow and route guards.
  * `feature/dashboard`: Driver dashboard and telemetry analytics.
  * `feature/car-selection`: Vehicle showroom and fleet catalog.
  * `feature/driving-game`: 3D WebGL driving simulation, cockpit camera, and IDM traffic.
  * `feature/backend-architecture`: Microservices, ACID ORM, and 60Hz multiplayer hub.