export type Role = 'player' | 'admin';

export type ExperienceLevel = 'Learner' | 'Beginner' | 'Experienced';

export type CareerLevel = 'LEARNER' | 'NEW DRIVER' | 'PROFESSIONAL' | 'EXPERT' | 'MASTER DRIVER';

export type LicenseStatus = 'VALID' | 'WARNING' | 'SUSPENDED';

export type LicenseClass = 'Class L (Learner)' | 'Class C (Standard)' | 'Class PRO (Commercial)' | 'Class R (Master)';

export interface DrivingPreferences {
  transmission: 'Automatic' | 'Manual';
  units: 'metric' | 'imperial';
  assists: {
    abs: boolean;
    esp: boolean;
    traction: boolean;
    steeringAssist: boolean;
    autoBrake: boolean;
  };
}

export interface DriverLicense {
  licenseNumber: string;
  driverName: string;
  issueDate: string;
  expiryDate: string;
  licenseClass: LicenseClass;
  penaltyPoints: number; // max 12
  status: LicenseStatus;
  pointsHistory: Array<{ date: string; points: number; reason: string }>;
}

export interface DriverStats {
  totalDistanceKm: number;
  drivingHours: number;
  jobsCompleted: number;
  missionsCompleted: number;
  safeDrivingScore: number; // 0 - 100
  fuelEfficiencyKmPerL: number;
  accidentsCount: number;
  trafficViolationsCount: number;
  carsOwnedCount: number;
  topSpeedAchievedKmH: number;
  racesWon: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  mobile: string;
  role: Role;
  avatar: string;
  createdAt: string;
  hasCompletedOnboarding: boolean;
}

export interface DriverProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  experienceLevel: ExperienceLevel;
  preferences: DrivingPreferences;
  license: DriverLicense;
  stats: DriverStats;
  reputation: number; // 0 - 100
  careerLevel: CareerLevel;
  xp: number;
  nextLevelXp: number;
  currentLocation: string;
}

export type VehicleCategory = 'Hatchback' | 'Sedan' | 'SUV' | 'Sports' | 'Electric' | 'Utility';

export interface VehicleHealth {
  engine: number; // 0 - 100
  brakes: number;
  tyres: number;
  transmission: number;
  suspension: number;
  battery: number;
  body: number;
  fuel: number;
}

export interface VehicleCustomization {
  exterior: {
    paintColor: string;
    finish: 'gloss' | 'matte' | 'metallic';
    wheels: string;
    wheelColor: string;
    tintLevel: 'none' | 'light' | 'medium' | 'dark';
    spoiler: string;
    bodyKit: string;
    neonGlow: string;
  };
  performance: {
    engineLevel: number;      // 1 - 5
    transmissionLevel: number;
    brakesLevel: number;
    suspensionLevel: number;
    tyresLevel: number;
    ecuTuneLevel: number;
  };
}

export interface VehicleServiceLog {
  id: string;
  date: string;
  type: string;
  cost: number;
  parts: string[];
  mileage: number;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  modelYear: number;
  category: VehicleCategory;
  price: number;
  powerHp: number;
  topSpeedKmH: number;
  acceleration0To100: number; // in seconds
  mileageKm: number;
  fuelCurrentL: number;
  fuelCapacityL: number;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'Premium 98';
  fuelEconomyKmPerL: number;
  overallCondition: number; // 0 - 100
  value: number;
  health: VehicleHealth;
  customization: VehicleCustomization;
  serviceLogs: VehicleServiceLog[];
  isStarterCar?: boolean;
  isOwned?: boolean;
  isSelected?: boolean;
  color: string;
  badge?: string;
  description: string;
}

export type JobCategory = 'TAXI' | 'DELIVERY' | 'BUS' | 'EMERGENCY' | 'TRANSPORT';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  description: string;
  pickup: string;
  destination: string;
  distanceKm: number;
  timeLimitMin: number;
  reward: number;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  recommendedVehicleType: string;
  passengerRating?: number;
  passengerCount?: number;
  urgency?: 'Low' | 'Standard' | 'Urgent' | 'Critical';
  busStops?: string[];
  cargoType?: string;
  packageWeightKg?: number;
  requiredLevel: CareerLevel;
  isAccepted?: boolean;
  isCompleted?: boolean;
}

export type MissionType = 'Driving' | 'Career' | 'Vehicle' | 'Exploration' | 'Skill' | 'Challenge';
export type MissionState = 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'LOCKED';

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  description: string;
  objective: string;
  rewardMoney: number;
  rewardXp: number;
  state: MissionState;
  progress: number;
  maxProgress: number;
  unit: string;
  unlockRequirement?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 
  | 'JOB_PAYOUT' 
  | 'MISSION_REWARD' 
  | 'RACE_WIN' 
  | 'BONUS' 
  | 'FUEL' 
  | 'REPAIR' 
  | 'INSURANCE' 
  | 'FINE' 
  | 'CAR_PURCHASE' 
  | 'UPGRADE'
  | 'TEST_DRIVE';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  receiptId: string;
  referenceId?: string;
}

export interface Wallet {
  balance: number;
  todayIncome: number;
  todayExpenses: number;
  totalEarnings: number;
  totalSpent: number;
}

export type POICategory = 'HOME' | 'GARAGE' | 'FUEL' | 'SERVICE' | 'POLICE' | 'HOSPITAL' | 'JOB_HUB' | 'PARKING' | 'RACE' | 'DEALERSHIP';
export type CityZone = 'City Center' | 'Residential' | 'Industrial Area' | 'Highway' | 'Airport' | 'Suburbs' | 'Mountain Road';

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  zone: CityZone;
  x: number; // 0 - 100 percentage in map SVG
  y: number;
  description: string;
  address: string;
}

export type WeatherType = 'SUNNY' | 'CLOUDY' | 'RAIN' | 'HEAVY_RAIN' | 'FOG';
export type TimePeriod = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export interface WeatherCondition {
  type: WeatherType;
  name: string;
  temperatureC: number;
  visibilityPct: number;
  roadGripPct: number;
  rainIntensityPct: number;
  windKmh: number;
  advisory: string;
  icon: string;
}

export interface TrafficZone {
  id: string;
  roadName: string;
  zone: CityZone;
  trafficLevel: 'LOW' | 'MODERATE' | 'HEAVY' | 'BLOCKED';
  avgSpeedKmh: number;
  incident?: string;
  alternativeRoute?: string;
}

export interface Violation {
  id: string;
  violationType: 'Speeding' | 'Red Light' | 'Illegal Parking' | 'Wrong Way' | 'Dangerous Driving';
  fineAmount: number;
  penaltyPoints: number;
  date: string;
  location: string;
  isPaid: boolean;
  detectedSpeedKmh?: number;
  speedLimitKmh?: number;
  ticketNumber: string;
}

export interface ConsequenceEvent {
  id: string;
  title: string;
  action: string;
  consequences: string[];
  impactType: 'POSITIVE' | 'NEGATIVE';
  date: string;
  metricDeltas: {
    reputation?: number;
    money?: number;
    points?: number;
    insuranceRisk?: string;
  };
}

export interface InsurancePlan {
  id: string;
  name: 'Basic' | 'Standard' | 'Premium';
  monthlyPremium: number;
  deductible: number;
  coveragePct: number;
  roadAssist: boolean;
  theftProtection: boolean;
  replacementVehicle: boolean;
  accidentForgiveness: boolean;
  recommendedFor: string;
}

export interface ActivePolicy {
  id: string;
  vehicleId: string;
  vehicleName: string;
  planId: string;
  planName: 'Basic' | 'Standard' | 'Premium';
  monthlyPremium: number;
  coveragePct: number;
  startDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'WARNING';
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'DRIVING' | 'CAREER' | 'COLLECTION' | 'CHALLENGE';
  icon: string;
  xpReward: number;
  cashReward: number;
  state: 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED';
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  playerName: string;
  avatar: string;
  careerLevel: CareerLevel;
  reputation: number;
  totalDistanceKm: number;
  jobsCompleted: number;
  safeDrivingScore: number;
  isCurrentPlayer?: boolean;
}

export type NotificationType = 
  | 'FUEL' 
  | 'SERVICE' 
  | 'JOB' 
  | 'MISSION' 
  | 'FINE' 
  | 'INSURANCE' 
  | 'ACHIEVEMENT' 
  | 'DAMAGE' 
  | 'LEVEL_UP' 
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface UserSettings {
  theme: 'dark';
  soundEnabled: boolean;
  soundVolume: number; // 0 - 100
  engineVolume: number;
  uiVolume: number;
  measurementUnit: 'metric' | 'imperial';
  transmission: 'Automatic' | 'Manual';
  cameraView: 'hood' | 'cockpit' | 'chase' | 'top';
  graphicQuality: 'low' | 'medium' | 'high' | 'ultra';
  showMinimap: boolean;
  showTelemetry: boolean;
  showSpeedLimitAlert: boolean;
  autoBrakeAssist: boolean;
  reducedMotion: boolean;
  trafficDensity: 'low' | 'medium' | 'high';
  dynamicWeather: boolean;
}
