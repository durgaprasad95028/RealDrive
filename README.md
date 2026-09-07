# REALDRIVE — Realistic Car Life Simulator & 3D Driving Engine

RealDrive is a realistic car-life and driving simulation platform built with **React 18, TypeScript, Three.js WebGL, Tailwind CSS, and the Web Audio API**.

---

## 🎮 Game Flow
```
LOGIN (/) ──► DASHBOARD (/dashboard) ──► CAR SELECTION (/cars) ──► 3D DRIVING GAME (/game)
```

1. **Login Page (`/login` & `/`)**: Edge-to-edge full-screen login with cinematic supercar background and 1-click demo fillers.
2. **Dashboard (`/dashboard`)**: Central launchpad displaying driver stats, wallet balance, active car specs, and navigation options.
3. **Car Selection & Garage (`/cars`)**: Showroom with full multi-class fleet (Compact, Sedan, Sports Coupe, SUV, Taxi, Bus, Truck), specifications, purchase system, and active vehicle selector.
4. **3D Driving World (`/game`)**: Real-time Three.js WebGL driving simulation featuring first-person cockpit view with physical animated steering wheel, moving two-way AI traffic, motorcycles with riders, 3D traffic lights, GPS radar, and the Airport Taxi mission.

---

## 🕹️ Driving Controls

| Action | Primary Key | Secondary Key |
|---|---|---|
| **Accelerate** | `W` | `Up Arrow (↑)` |
| **Brake / Reverse** | `S` | `Down Arrow (↓)` |
| **Steer Left** | `A` | `Left Arrow (←)` |
| **Steer Right** | `D` | `Right Arrow (→)` |
| **Handbrake** | `Spacebar` | — |
| **Camera View** | `C` | `V` (Cockpit $\leftrightarrow$ Chase) |
| **Headlights** | `H` | — |
| **Time of Day** | `T` | — |
| **Pause Menu** | `Esc` | `P` |

---

## 🔑 Demo Credentials
- **Driver Account**: `player` / `player123`
- **Admin Console**: `admin` / `admin123`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/durgaprasad95028/RealDrive.git
cd RealDrive

# Switch to the frontend branch
git checkout frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```