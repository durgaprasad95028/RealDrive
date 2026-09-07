import { User, DriverProfile, Wallet, UserSettings, ActivePolicy } from '../types';

export const DEFAULT_USER: User = {
  id: 'usr-player',
  username: 'player',
  email: 'driver@realdrive.sim',
  fullName: 'Alex Reynolds',
  mobile: '+1 (555) 019-2834',
  role: 'player',
  avatar: '🏎️',
  createdAt: '2026-09-01',
  hasCompletedOnboarding: true,
};

export const DEFAULT_ADMIN: User = {
  id: 'usr-admin',
  username: 'admin',
  email: 'admin@realdrive.sim',
  fullName: 'System Administrator',
  mobile: '+1 (555) 000-9999',
  role: 'admin',
  avatar: '🛡️',
  createdAt: '2026-01-01',
  hasCompletedOnboarding: true,
};

export const DEFAULT_DRIVER_PROFILE: DriverProfile = {
  id: 'drv-alex-01',
  userId: 'usr-player',
  name: 'Alex Reynolds',
  avatar: '🏎️',
  experienceLevel: 'Learner',
  preferences: {
    transmission: 'Automatic',
    units: 'metric',
    assists: {
      abs: true,
      esp: true,
      traction: true,
      steeringAssist: true,
      autoBrake: false,
    },
  },
  license: {
    licenseNumber: 'RD-8849-2026',
    driverName: 'Alex Reynolds',
    issueDate: '2026-09-01',
    expiryDate: '2030-09-01',
    licenseClass: 'Class L (Learner)',
    penaltyPoints: 0,
    status: 'VALID',
    pointsHistory: [],
  },
  stats: {
    totalDistanceKm: 48.5,
    drivingHours: 3.2,
    jobsCompleted: 4,
    missionsCompleted: 2,
    safeDrivingScore: 92,
    fuelEfficiencyKmPerL: 15.2,
    accidentsCount: 0,
    trafficViolationsCount: 1,
    carsOwnedCount: 1,
    topSpeedAchievedKmH: 195,
    racesWon: 1,
  },
  reputation: 88,
  careerLevel: 'LEARNER',
  xp: 450,
  nextLevelXp: 1000,
  currentLocation: 'City Center - Grand Plaza',
};

export const DEFAULT_WALLET: Wallet = {
  balance: 4850,
  todayIncome: 1500,
  todayExpenses: 370,
  totalEarnings: 8200,
  totalSpent: 3350,
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  soundEnabled: true,
  soundVolume: 80,
  engineVolume: 75,
  uiVolume: 70,
  measurementUnit: 'metric',
  transmission: 'Automatic',
  cameraView: 'cockpit',
  graphicQuality: 'high',
  showMinimap: true,
  showTelemetry: true,
  showSpeedLimitAlert: true,
  autoBrakeAssist: false,
  reducedMotion: false,
  trafficDensity: 'medium',
  dynamicWeather: true,
};

export const DEFAULT_POLICIES: ActivePolicy[] = [
  {
    id: 'pol-1',
    vehicleId: 'veh-falcon-s',
    vehicleName: 'Falcon S',
    planId: 'ins-standard',
    planName: 'Standard',
    monthlyPremium: 160,
    coveragePct: 80,
    startDate: '2026-09-01',
    expiryDate: '2026-10-01',
    status: 'ACTIVE',
  },
];
