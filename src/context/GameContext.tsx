import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  DriverProfile, 
  Vehicle, 
  Job, 
  Mission, 
  Wallet, 
  Transaction, 
  Violation, 
  ConsequenceEvent, 
  ActivePolicy, 
  Achievement, 
  AppNotification, 
  UserSettings, 
  WeatherCondition, 
  TimePeriod,
  CareerLevel,
  VehicleCustomization,
  VehicleHealth
} from '../types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_JOBS, 
  INITIAL_MISSIONS, 
  INITIAL_WEATHER_CONDITIONS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CONSEQUENCES, 
  INITIAL_VIOLATIONS,
  INITIAL_INSURANCE_PLANS
} from '../data/mockData';
import { 
  DEFAULT_USER, 
  DEFAULT_ADMIN,
  DEFAULT_DRIVER_PROFILE, 
  DEFAULT_WALLET, 
  DEFAULT_SETTINGS,
  DEFAULT_POLICIES 
} from '../data/defaultState';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';

interface GameContextType {
  // Auth & Profile
  user: User | null;
  driver: DriverProfile | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => { success: boolean; message?: string };
  register: (data: { fullName: string; username: string; email: string; mobile: string; password: string }) => { success: boolean; message?: string };
  logout: () => void;
  updateDriverProfile: (data: Partial<DriverProfile>) => void;
  completeOnboarding: (name: string, avatar: string, exp: DriverProfile['experienceLevel'], transmission: 'Automatic' | 'Manual', starterCarId: string) => void;

  // Vehicles & Garage
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  selectVehicle: (id: string) => void;
  buyVehicle: (id: string) => { success: boolean; message: string };
  sellVehicle: (id: string) => { success: boolean; message: string };
  customizeVehicle: (id: string, customization: VehicleCustomization, cost: number) => { success: boolean; message: string };
  serviceVehicle: (id: string, part: keyof VehicleHealth | 'full', cost: number) => { success: boolean; message: string };
  refuelVehicle: (id: string, liters: number, cost: number) => { success: boolean; message: string };

  // Jobs & Missions
  jobs: Job[];
  activeJob: Job | null;
  acceptJob: (id: string) => void;
  completeJob: (id: string, safeDrivingBonus: boolean, violationPenalty?: boolean) => void;
  cancelJob: (id: string) => void;
  missions: Mission[];
  claimMission: (id: string) => void;

  // Economy & Wallet
  wallet: Wallet;
  transactions: Transaction[];
  addTransaction: (type: 'INCOME' | 'EXPENSE', category: Transaction['category'], amount: number, description: string) => void;

  // World, Weather & Time
  currentWeather: WeatherCondition;
  setWeather: (type: WeatherCondition['type']) => void;
  timeOfDay: TimePeriod;
  gameTime: string;
  advanceTime: (minutes: number) => void;

  // Violations & Police
  violations: Violation[];
  consequences: ConsequenceEvent[];
  issueViolation: (type: Violation['violationType'], fine: number, points: number, speed?: number, limit?: number) => void;
  payViolation: (id: string) => void;

  // Insurance
  policies: ActivePolicy[];
  purchaseInsurance: (vehicleId: string, planId: string) => void;

  // Achievements & Notifications
  achievements: Achievement[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type'], actionUrl?: string) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;

  // Simulation Telemetry
  recordDriveSession: (distanceKm: number, maxSpeed: number, fuelUsedL: number, healthWear: Partial<VehicleHealth>) => void;
  resetAllDemoData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load State from storage with fallbacks
  const [user, setUser] = useState<User | null>(() => storageService.get<User | null>('user', DEFAULT_USER));
  const [driver, setDriver] = useState<DriverProfile | null>(() => storageService.get<DriverProfile | null>('driver', DEFAULT_DRIVER_PROFILE));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => storageService.get<Vehicle[]>('vehicles', INITIAL_VEHICLES));
  const [jobs, setJobs] = useState<Job[]>(() => storageService.get<Job[]>('jobs', INITIAL_JOBS));
  const [activeJobId, setActiveJobId] = useState<string | null>(() => storageService.get<string | null>('active_job_id', null));
  const [missions, setMissions] = useState<Mission[]>(() => storageService.get<Mission[]>('missions', INITIAL_MISSIONS));
  const [wallet, setWallet] = useState<Wallet>(() => storageService.get<Wallet>('wallet', DEFAULT_WALLET));
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.get<Transaction[]>('transactions', [
    { id: 'txn-1', date: '2026-09-06 18:30', type: 'INCOME', category: 'JOB_PAYOUT', amount: 850, description: 'Completed Airport VIP transfer job', receiptId: 'REC-89021' },
    { id: 'txn-2', date: '2026-09-06 19:15', type: 'EXPENSE', category: 'FUEL', amount: 65, description: 'Refueled 38.5L Premium Petrol at OctanePrime', receiptId: 'REC-89022' },
    { id: 'txn-3', date: '2026-09-05 14:00', type: 'EXPENSE', category: 'INSURANCE', amount: 160, description: 'Monthly Standard Insurance Policy Premium', receiptId: 'REC-89020' },
  ]));
  const [violations, setViolations] = useState<Violation[]>(() => storageService.get<Violation[]>('violations', INITIAL_VIOLATIONS));
  const [consequences, setConsequences] = useState<ConsequenceEvent[]>(() => storageService.get<ConsequenceEvent[]>('consequences', INITIAL_CONSEQUENCES));
  const [policies, setPolicies] = useState<ActivePolicy[]>(() => storageService.get<ActivePolicy[]>('policies', DEFAULT_POLICIES));
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.get<Achievement[]>('achievements', INITIAL_ACHIEVEMENTS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storageService.get<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS));
  const [settings, setSettings] = useState<UserSettings>(() => storageService.get<UserSettings>('settings', DEFAULT_SETTINGS));
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition>(() => storageService.get<WeatherCondition>('weather', INITIAL_WEATHER_CONDITIONS[0]));
  const [timeOfDay, setTimeOfDay] = useState<TimePeriod>(() => storageService.get<TimePeriod>('timeOfDay', 'AFTERNOON'));
  const [gameTime, setGameTime] = useState<string>(() => storageService.get<string>('gameTime', '14:35'));

  // Sync to Storage on changes
  useEffect(() => { storageService.set('user', user); }, [user]);
  useEffect(() => { storageService.set('driver', driver); }, [driver]);
  useEffect(() => { storageService.set('vehicles', vehicles); }, [vehicles]);
  useEffect(() => { storageService.set('jobs', jobs); }, [jobs]);
  useEffect(() => { storageService.set('active_job_id', activeJobId); }, [activeJobId]);
  useEffect(() => { storageService.set('missions', missions); }, [missions]);
  useEffect(() => { storageService.set('wallet', wallet); }, [wallet]);
  useEffect(() => { storageService.set('transactions', transactions); }, [transactions]);
  useEffect(() => { storageService.set('violations', violations); }, [violations]);
  useEffect(() => { storageService.set('consequences', consequences); }, [consequences]);
  useEffect(() => { storageService.set('policies', policies); }, [policies]);
  useEffect(() => { storageService.set('achievements', achievements); }, [achievements]);
  useEffect(() => { storageService.set('notifications', notifications); }, [notifications]);
  useEffect(() => { 
    storageService.set('settings', settings); 
    audioService.setMuted(!settings.soundEnabled);
  }, [settings]);
  useEffect(() => { storageService.set('weather', currentWeather); }, [currentWeather]);
  useEffect(() => { storageService.set('timeOfDay', timeOfDay); }, [timeOfDay]);
  useEffect(() => { storageService.set('gameTime', gameTime); }, [gameTime]);

  const selectedVehicle = vehicles.find(v => v.isSelected && v.isOwned) || vehicles.find(v => v.isOwned) || vehicles[0];
  const activeJob = jobs.find(j => j.id === activeJobId) || null;

  // Add Notification Helper
  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'], actionUrl?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      isRead: false,
      timestamp: 'Just now',
      actionUrl,
    };
    setNotifications(prev => [newNotif, ...prev]);
    audioService.playAlert();
  }, []);

  // Add Transaction Helper
  const addTransaction = useCallback((type: 'INCOME' | 'EXPENSE', category: Transaction['category'], amount: number, description: string) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      date: formattedDate,
      type,
      category,
      amount,
      description,
      receiptId: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setTransactions(prev => [newTxn, ...prev]);
    setWallet(prev => {
      const newBal = type === 'INCOME' ? prev.balance + amount : prev.balance - amount;
      return {
        ...prev,
        balance: Math.max(0, newBal),
        todayIncome: type === 'INCOME' ? prev.todayIncome + amount : prev.todayIncome,
        todayExpenses: type === 'EXPENSE' ? prev.todayExpenses + amount : prev.todayExpenses,
        totalEarnings: type === 'INCOME' ? prev.totalEarnings + amount : prev.totalEarnings,
        totalSpent: type === 'EXPENSE' ? prev.totalSpent + amount : prev.totalSpent,
      };
    });

    if (type === 'INCOME') {
      audioService.playCash();
    }
  }, []);

  // Auth Methods
  const login = (username: string, pass: string) => {
    audioService.playClick();
    if ((username === 'player' && pass === 'player123') || (username === 'player@realdrive.sim' && pass === 'player123')) {
      setUser(DEFAULT_USER);
      setDriver(DEFAULT_DRIVER_PROFILE);
      return { success: true };
    }
    if ((username === 'admin' && pass === 'admin123') || (username === 'admin@realdrive.sim' && pass === 'admin123')) {
      setUser(DEFAULT_ADMIN);
      return { success: true };
    }
    // Check if custom registered
    const storedUser = storageService.get<User | null>('custom_user', null);
    if (storedUser && (storedUser.username === username || storedUser.email === username)) {
      setUser(storedUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password. Use demo player (player/player123) or admin (admin/admin123).' };
  };

  const register = (data: { fullName: string; username: string; email: string; mobile: string; password: string }) => {
    audioService.playClick();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      mobile: data.mobile,
      role: 'player',
      avatar: '🏎️',
      createdAt: new Date().toISOString().split('T')[0],
      hasCompletedOnboarding: false,
    };
    storageService.set('custom_user', newUser);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    audioService.playClick();
    setUser(null);
  };

  const updateDriverProfile = (data: Partial<DriverProfile>) => {
    setDriver(prev => prev ? { ...prev, ...data } : null);
  };

  const completeOnboarding = (name: string, avatar: string, exp: DriverProfile['experienceLevel'], transmission: 'Automatic' | 'Manual', starterCarId: string) => {
    const updatedVehicles = vehicles.map(v => {
      if (v.id === starterCarId) {
        return { ...v, isOwned: true, isSelected: true };
      }
      return { ...v, isSelected: false };
    });

    const newProfile: DriverProfile = {
      id: `drv-${Date.now()}`,
      userId: user?.id || 'usr-player',
      name,
      avatar,
      experienceLevel: exp,
      preferences: {
        transmission,
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
        licenseNumber: `RD-${Math.floor(1000 + Math.random() * 9000)}-2026`,
        driverName: name,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '2030-09-01',
        licenseClass: exp === 'Experienced' ? 'Class C (Standard)' : 'Class L (Learner)',
        penaltyPoints: 0,
        status: 'VALID',
        pointsHistory: [],
      },
      stats: {
        totalDistanceKm: 0,
        drivingHours: 0,
        jobsCompleted: 0,
        missionsCompleted: 0,
        safeDrivingScore: 100,
        fuelEfficiencyKmPerL: 15.0,
        accidentsCount: 0,
        trafficViolationsCount: 0,
        carsOwnedCount: 1,
        topSpeedAchievedKmH: 0,
        racesWon: 0,
      },
      reputation: 85,
      careerLevel: 'LEARNER',
      xp: 0,
      nextLevelXp: 500,
      currentLocation: 'City Center',
    };

    setVehicles(updatedVehicles);
    setDriver(newProfile);
    if (user) {
      setUser({ ...user, hasCompletedOnboarding: true, fullName: name, avatar });
    }
    addNotification('Driver License Issued', `Welcome to RealDrive, ${name}! Your driver license and starter car are ready.`, 'LEVEL_UP', '/profile');
    audioService.playCash();
  };

  // Vehicle Management
  const selectVehicle = (id: string) => {
    audioService.playClick();
    setVehicles(prev => prev.map(v => ({
      ...v,
      isSelected: v.id === id,
    })));
  };

  const buyVehicle = (id: string) => {
    const target = vehicles.find(v => v.id === id);
    if (!target) return { success: false, message: 'Vehicle not found' };
    if (target.isOwned) return { success: false, message: 'Vehicle already owned' };
    if (wallet.balance < target.price) return { success: false, message: 'Insufficient funds in wallet' };

    addTransaction('EXPENSE', 'CAR_PURCHASE', target.price, `Purchased ${target.brand} ${target.name}`);
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, isOwned: true, isSelected: true } : { ...v, isSelected: false }));
    setDriver(prev => prev ? { ...prev, stats: { ...prev.stats, carsOwnedCount: prev.stats.carsOwnedCount + 1 } } : null);
    addNotification('Vehicle Purchased', `Congratulations on purchasing the ${target.name}! It is now in your garage.`, 'SYSTEM', '/garage');
    return { success: true, message: `Successfully purchased ${target.name}!` };
  };

  const sellVehicle = (id: string) => {
    const target = vehicles.find(v => v.id === id);
    if (!target || !target.isOwned) return { success: false, message: 'Vehicle not owned' };
    const ownedCount = vehicles.filter(v => v.isOwned).length;
    if (ownedCount <= 1) return { success: false, message: 'You must own at least one vehicle' };

    const sellPrice = Math.floor(target.value * (target.overallCondition / 100));
    addTransaction('INCOME', 'BONUS', sellPrice, `Sold ${target.brand} ${target.name}`);
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, isOwned: false, isSelected: false } : v));
    setDriver(prev => prev ? { ...prev, stats: { ...prev.stats, carsOwnedCount: Math.max(1, prev.stats.carsOwnedCount - 1) } } : null);
    return { success: true, message: `Vehicle sold for ₹${sellPrice.toLocaleString()}` };
  };

  const customizeVehicle = (id: string, customization: VehicleCustomization, cost: number) => {
    if (wallet.balance < cost) return { success: false, message: 'Insufficient funds for customization' };
    if (cost > 0) {
      addTransaction('EXPENSE', 'UPGRADE', cost, `Performance & visual upgrades on vehicle`);
    }
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        // Boost performance stats with upgrade levels
        const powerBoost = (customization.performance.engineLevel - 1) * 25 + (customization.performance.ecuTuneLevel - 1) * 15;
        const speedBoost = (customization.performance.transmissionLevel - 1) * 8 + (customization.performance.engineLevel - 1) * 10;
        const accelImprovement = (customization.performance.engineLevel - 1) * 0.4 + (customization.performance.tyresLevel - 1) * 0.3;
        
        return {
          ...v,
          customization,
          powerHp: targetBaseHp(v.id) + powerBoost,
          topSpeedKmH: targetBaseSpeed(v.id) + speedBoost,
          acceleration0To100: Math.max(2.2, targetBaseAccel(v.id) - accelImprovement),
        };
      }
      return v;
    }));
    audioService.playClick();
    return { success: true, message: 'Customization applied successfully!' };
  };

  const targetBaseHp = (id: string) => INITIAL_VEHICLES.find(v => v.id === id)?.powerHp || 150;
  const targetBaseSpeed = (id: string) => INITIAL_VEHICLES.find(v => v.id === id)?.topSpeedKmH || 180;
  const targetBaseAccel = (id: string) => INITIAL_VEHICLES.find(v => v.id === id)?.acceleration0To100 || 8.0;

  const serviceVehicle = (id: string, part: keyof VehicleHealth | 'full', cost: number) => {
    if (wallet.balance < cost) return { success: false, message: 'Insufficient funds for repair' };
    addTransaction('EXPENSE', 'REPAIR', cost, `Workshop service: ${part === 'full' ? 'Complete Overhaul' : `${String(part).toUpperCase()} repair`}`);

    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        const newHealth: VehicleHealth = { ...v.health };
        if (part === 'full') {
          newHealth.engine = 100;
          newHealth.brakes = 100;
          newHealth.tyres = 100;
          newHealth.transmission = 100;
          newHealth.suspension = 100;
          newHealth.battery = 100;
          newHealth.body = 100;
        } else {
          newHealth[part] = 100;
        }

        const avg = Math.round((newHealth.engine + newHealth.brakes + newHealth.tyres + newHealth.transmission + newHealth.suspension + newHealth.battery + newHealth.body) / 7);
        const log = {
          id: `srv-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: part === 'full' ? 'Full Overhaul Service' : `${String(part).toUpperCase()} Maintenance`,
          cost,
          parts: [String(part)],
          mileage: v.mileageKm,
        };

        return {
          ...v,
          health: newHealth,
          overallCondition: avg,
          serviceLogs: [log, ...v.serviceLogs],
        };
      }
      return v;
    }));

    audioService.playClick();
    return { success: true, message: 'Vehicle service completed!' };
  };

  const refuelVehicle = (id: string, liters: number, cost: number) => {
    if (wallet.balance < cost) return { success: false, message: 'Insufficient funds for refueling' };
    addTransaction('EXPENSE', 'FUEL', cost, `Refueled ${liters.toFixed(1)}L fuel at OctanePrime`);

    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        const newFuel = Math.min(v.fuelCapacityL, v.fuelCurrentL + liters);
        const fuelPct = Math.round((newFuel / v.fuelCapacityL) * 100);
        return {
          ...v,
          fuelCurrentL: newFuel,
          health: { ...v.health, fuel: fuelPct },
        };
      }
      return v;
    }));
    audioService.playCash();
    return { success: true, message: `Refueled ${liters.toFixed(1)}L successfully!` };
  };

  // Job Actions
  const acceptJob = (id: string) => {
    setActiveJobId(id);
    audioService.playClick();
    addNotification('Job Accepted', 'Your active navigation route and timer are now engaged.', 'JOB', '/drive');
  };

  const cancelJob = (id: string) => {
    if (activeJobId === id) {
      setActiveJobId(null);
    }
  };

  const completeJob = (id: string, safeDrivingBonus: boolean, violationPenalty: boolean = false) => {
    const targetJob = jobs.find(j => j.id === id);
    if (!targetJob) return;

    let payout = targetJob.reward;
    if (safeDrivingBonus) payout += Math.round(targetJob.reward * 0.15); // 15% safe driving bonus

    addTransaction('INCOME', 'JOB_PAYOUT', payout, `Completed: ${targetJob.title}${safeDrivingBonus ? ' (includes Safe Driving Bonus)' : ''}`);

    // Award driver XP
    let xp = targetJob.xpReward;
    if (safeDrivingBonus) xp += 50;
    awardXp(xp);

    // Update Driver Stats
    setDriver(prev => {
      if (!prev) return null;
      const safeScoreDelta = violationPenalty ? -4 : (safeDrivingBonus ? 1 : 0);
      return {
        ...prev,
        reputation: Math.min(100, Math.max(10, prev.reputation + (violationPenalty ? -2 : 2))),
        stats: {
          ...prev.stats,
          jobsCompleted: prev.stats.jobsCompleted + 1,
          totalDistanceKm: Number((prev.stats.totalDistanceKm + targetJob.distanceKm).toFixed(1)),
          safeDrivingScore: Math.min(100, Math.max(20, prev.stats.safeDrivingScore + safeScoreDelta)),
        },
      };
    });

    // Update Vehicle wear & fuel
    if (selectedVehicle) {
      const fuelUsed = Number((targetJob.distanceKm / selectedVehicle.fuelEconomyKmPerL).toFixed(1));
      setVehicles(prev => prev.map(v => {
        if (v.id === selectedVehicle.id) {
          const newFuelL = Math.max(0, v.fuelCurrentL - fuelUsed);
          const fuelPct = Math.round((newFuelL / v.fuelCapacityL) * 100);
          return {
            ...v,
            mileageKm: v.mileageKm + Math.round(targetJob.distanceKm),
            fuelCurrentL: newFuelL,
            health: {
              ...v.health,
              fuel: fuelPct,
              tyres: Math.max(10, v.health.tyres - 1),
              brakes: Math.max(10, v.health.brakes - 1),
            },
          };
        }
        return v;
      }));
    }

    setActiveJobId(null);
    addNotification('Job Completed!', `Earned ₹${payout.toLocaleString()} and +${xp} Driver XP.`, 'JOB', '/wallet');
  };

  const awardXp = (amount: number) => {
    setDriver(prev => {
      if (!prev) return null;
      const totalXp = prev.xp + amount;
      if (totalXp >= prev.nextLevelXp) {
        // Level up!
        const nextRank = getNextCareerLevel(prev.careerLevel);
        addNotification('Career Level Up!', `Congratulations! You have reached ${nextRank} rank!`, 'LEVEL_UP', '/career');
        return {
          ...prev,
          careerLevel: nextRank,
          xp: totalXp - prev.nextLevelXp,
          nextLevelXp: Math.round(prev.nextLevelXp * 1.6),
        };
      }
      return { ...prev, xp: totalXp };
    });
  };

  const getNextCareerLevel = (cur: CareerLevel): CareerLevel => {
    switch (cur) {
      case 'LEARNER': return 'NEW DRIVER';
      case 'NEW DRIVER': return 'PROFESSIONAL';
      case 'PROFESSIONAL': return 'EXPERT';
      case 'EXPERT': return 'MASTER DRIVER';
      default: return 'MASTER DRIVER';
    }
  };

  const claimMission = (id: string) => {
    const target = missions.find(m => m.id === id);
    if (!target || target.state !== 'COMPLETED') return;

    addTransaction('INCOME', 'MISSION_REWARD', target.rewardMoney, `Mission reward: ${target.title}`);
    awardXp(target.rewardXp);
    setMissions(prev => prev.map(m => m.id === id ? { ...m, state: 'COMPLETED' } : m));
    setDriver(prev => prev ? { ...prev, stats: { ...prev.stats, missionsCompleted: prev.stats.missionsCompleted + 1 } } : null);
    addNotification('Mission Reward Claimed', `Received ₹${target.rewardMoney.toLocaleString()} and ${target.rewardXp} XP.`, 'MISSION');
  };

  // Violations & Consequences
  const issueViolation = (type: Violation['violationType'], fine: number, points: number, speed?: number, limit?: number) => {
    const newViolation: Violation = {
      id: `vio-${Date.now()}`,
      violationType: type,
      fineAmount: fine,
      penaltyPoints: points,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      location: 'Metropolitan Expressway / Zone B',
      isPaid: false,
      detectedSpeedKmh: speed,
      speedLimitKmh: limit,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    const newConsequence: ConsequenceEvent = {
      id: `csq-${Date.now()}`,
      title: `${type} Violation Citation`,
      action: speed ? `Clocked at ${speed} km/h in ${limit} km/h zone` : `Traffic offense recorded by automated camera`,
      consequences: [
        `₹${fine} citation issued`,
        `${points} penalty points assessed to license`,
        `Safe driving score reduced`,
        `Insurance risk tier reassessed`,
      ],
      impactType: 'NEGATIVE',
      date: new Date().toISOString().split('T')[0],
      metricDeltas: {
        money: -fine,
        points: points,
        reputation: -3,
        insuranceRisk: '+3%',
      },
    };

    setViolations(prev => [newViolation, ...prev]);
    setConsequences(prev => [newConsequence, ...prev]);

    // Update Driver License Points
    setDriver(prev => {
      if (!prev) return null;
      const newPoints = prev.license.penaltyPoints + points;
      const status = newPoints >= 12 ? 'SUSPENDED' : (newPoints >= 6 ? 'WARNING' : 'VALID');
      return {
        ...prev,
        reputation: Math.max(10, prev.reputation - 4),
        license: {
          ...prev.license,
          penaltyPoints: newPoints,
          status,
          pointsHistory: [
            ...prev.license.pointsHistory,
            { date: new Date().toISOString().split('T')[0], points, reason: `${type} violation` }
          ]
        },
        stats: {
          ...prev.stats,
          trafficViolationsCount: prev.stats.trafficViolationsCount + 1,
          safeDrivingScore: Math.max(10, prev.stats.safeDrivingScore - 6),
        },
      };
    });

    addNotification('Traffic Citation Issued', `Camera recorded ${type}. Fine: ₹${fine}, Penalty Points: +${points}`, 'FINE', '/police');
  };

  const payViolation = (id: string) => {
    const target = violations.find(v => v.id === id);
    if (!target || target.isPaid) return;
    if (wallet.balance < target.fineAmount) {
      addNotification('Payment Failed', 'Insufficient funds in wallet to pay citation fine.', 'FINE');
      return;
    }

    addTransaction('EXPENSE', 'FINE', target.fineAmount, `Paid traffic ticket #${target.ticketNumber}`);
    setViolations(prev => prev.map(v => v.id === id ? { ...v, isPaid: true } : v));
    addNotification('Fine Settled', `Citation #${target.ticketNumber} marked as paid.`, 'SYSTEM', '/police');
  };

  const purchaseInsurance = (vehicleId: string, planId: string) => {
    const plan = INITIAL_INSURANCE_PLANS.find(p => p.id === planId);
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!plan || !veh) return;
    if (wallet.balance < plan.monthlyPremium) {
      addNotification('Insurance Failed', 'Insufficient funds for insurance premium.', 'INSURANCE');
      return;
    }

    addTransaction('EXPENSE', 'INSURANCE', plan.monthlyPremium, `Purchased ${plan.name} insurance policy for ${veh.name}`);
    const newPolicy: ActivePolicy = {
      id: `pol-${Date.now()}`,
      vehicleId,
      vehicleName: veh.name,
      planId: plan.id,
      planName: plan.name,
      monthlyPremium: plan.monthlyPremium,
      coveragePct: plan.coveragePct,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    setPolicies(prev => [newPolicy, ...prev.filter(p => p.vehicleId !== vehicleId)]);
    addNotification('Insurance Policy Active', `${plan.name} coverage is now active for ${veh.name}.`, 'INSURANCE', '/insurance');
  };

  const recordDriveSession = (distanceKm: number, maxSpeed: number, fuelUsedL: number, healthWear: Partial<VehicleHealth>) => {
    if (!selectedVehicle) return;

    setVehicles(prev => prev.map(v => {
      if (v.id === selectedVehicle.id) {
        const newFuel = Math.max(0, v.fuelCurrentL - fuelUsedL);
        const fuelPct = Math.round((newFuel / v.fuelCapacityL) * 100);
        return {
          ...v,
          mileageKm: v.mileageKm + Math.round(distanceKm),
          fuelCurrentL: newFuel,
          health: {
            ...v.health,
            fuel: fuelPct,
            engine: Math.max(10, v.health.engine - (healthWear.engine || 0)),
            brakes: Math.max(10, v.health.brakes - (healthWear.brakes || 0)),
            tyres: Math.max(10, v.health.tyres - (healthWear.tyres || 0)),
            transmission: Math.max(10, v.health.transmission - (healthWear.transmission || 0)),
            suspension: Math.max(10, v.health.suspension - (healthWear.suspension || 0)),
            battery: Math.max(10, v.health.battery - (healthWear.battery || 0)),
            body: Math.max(10, v.health.body - (healthWear.body || 0)),
          }
        };
      }
      return v;
    }));

    setDriver(prev => {
      if (!prev) return null;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalDistanceKm: Number((prev.stats.totalDistanceKm + distanceKm).toFixed(1)),
          drivingHours: Number((prev.stats.drivingHours + distanceKm / 60).toFixed(1)),
          topSpeedAchievedKmH: Math.max(prev.stats.topSpeedAchievedKmH, maxSpeed),
        }
      };
    });
  };

  const setWeather = (type: WeatherCondition['type']) => {
    const match = INITIAL_WEATHER_CONDITIONS.find(w => w.type === type) || INITIAL_WEATHER_CONDITIONS[0];
    setCurrentWeather(match);
  };

  const advanceTime = (minutes: number) => {
    const [hStr, mStr] = gameTime.split(':');
    let h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10) + minutes;
    while (m >= 60) {
      m -= 60;
      h = (h + 1) % 24;
    }
    const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    setGameTime(formatted);

    if (h >= 6 && h < 12) setTimeOfDay('MORNING');
    else if (h >= 12 && h < 17) setTimeOfDay('AFTERNOON');
    else if (h >= 17 && h < 21) setTimeOfDay('EVENING');
    else setTimeOfDay('NIGHT');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetAllDemoData = () => {
    storageService.clearAll();
    setUser(DEFAULT_USER);
    setDriver(DEFAULT_DRIVER_PROFILE);
    setVehicles(INITIAL_VEHICLES);
    setJobs(INITIAL_JOBS);
    setActiveJobId(null);
    setMissions(INITIAL_MISSIONS);
    setWallet(DEFAULT_WALLET);
    setViolations(INITIAL_VIOLATIONS);
    setConsequences(INITIAL_CONSEQUENCES);
    setPolicies(DEFAULT_POLICIES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(DEFAULT_SETTINGS);
    setCurrentWeather(INITIAL_WEATHER_CONDITIONS[0]);
    setTimeOfDay('AFTERNOON');
    setGameTime('14:35');
  };

  return (
    <GameContext.Provider
      value={{
        user,
        driver,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateDriverProfile,
        completeOnboarding,
        vehicles,
        selectedVehicle,
        selectVehicle,
        buyVehicle,
        sellVehicle,
        customizeVehicle,
        serviceVehicle,
        refuelVehicle,
        jobs,
        activeJob,
        acceptJob,
        completeJob,
        cancelJob,
        missions,
        claimMission,
        wallet,
        transactions,
        addTransaction,
        currentWeather,
        setWeather,
        timeOfDay,
        gameTime,
        advanceTime,
        violations,
        consequences,
        issueViolation,
        payViolation,
        policies,
        purchaseInsurance,
        achievements,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        settings,
        updateSettings,
        recordDriveSession,
        resetAllDemoData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
