import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { AppShell } from '../../components/layout/AppShell';

// Features
import { LandingPage } from '../../features/landing/LandingPage';
import { LoginPage } from '../../features/auth/LoginPage';
import { RegisterPage } from '../../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../../features/auth/ForgotPasswordPage';
import { DriverOnboardingPage } from '../../features/onboarding/DriverOnboardingPage';
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { CarsSelectionPage } from '../../features/cars/CarsSelectionPage';
import { ProfilePage } from '../../features/profile/ProfilePage';
import { VehiclesPage } from '../../features/vehicles/VehiclesPage';
import { GaragePage } from '../../features/garage/GaragePage';
import { Driving3DPage } from '../../features/driving/game3d/Driving3DPage';
import { DrivingGamePage } from '../../features/driving/game/DrivingGamePage';
import { MapPage } from '../../features/map/MapPage';
import { JobsPage } from '../../features/jobs/JobsPage';
import { MissionsPage } from '../../features/missions/MissionsPage';
import { WalletPage } from '../../features/economy/WalletPage';
import { FuelPage } from '../../features/fuel/FuelPage';
import { MaintenancePage } from '../../features/maintenance/MaintenancePage';
import { InsurancePage } from '../../features/insurance/InsurancePage';
import { PolicePage } from '../../features/police/PolicePage';
import { MarketplacePage } from '../../features/marketplace/MarketplacePage';
import { CareerPage } from '../../features/career/CareerPage';
import { AchievementsPage } from '../../features/achievements/AchievementsPage';
import { LeaderboardPage } from '../../features/leaderboard/LeaderboardPage';
import { NotificationsPage } from '../../features/notifications/NotificationsPage';
import { SettingsPage } from '../../features/settings/SettingsPage';
import { AdminPage } from '../../features/admin/AdminPage';
import { NotFoundPage } from '../../features/error/NotFoundPage';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useGame();
  
  // Read initial path from window.location.pathname or default to '/'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    return path && path !== '/' ? path : '/';
  });

  // Sync with browser history and popstate
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Public Unauthenticated Pages
  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/register') {
    return <RegisterPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/forgot-password') {
    return <ForgotPasswordPage onNavigate={navigateTo} />;
  }

  if (currentPath === '/landing') {
    return <LandingPage onNavigate={navigateTo} />;
  }

  // Root path: If not authenticated, immediately show the full-screen Login Page
  if (currentPath === '/') {
    if (!isAuthenticated) {
      return <LoginPage onNavigate={navigateTo} />;
    }
  }

  // Onboarding Wizard
  if (currentPath === '/onboarding') {
    return <DriverOnboardingPage onNavigate={navigateTo} />;
  }

  // Protected Route Check: If not logged in, strictly redirect to /login
  if (!isAuthenticated) {
    return <LoginPage onNavigate={navigateTo} />;
  }

  // Full-Screen Dedicated 3D Driving Gameplay Route (Protected)
  if (currentPath === '/drive/game' || currentPath === '/drive' || currentPath === '/game') {
    return <Driving3DPage onNavigate={navigateTo} />;
  }

  // Render Protected Pages inside AppShell
  const renderProtectedContent = () => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case '/cars':
        return <CarsSelectionPage onNavigate={navigateTo} />;
      case '/profile':
        return <ProfilePage onNavigate={navigateTo} />;
      case '/vehicles':
        return <CarsSelectionPage onNavigate={navigateTo} />;
      case '/garage':
        return <GaragePage onNavigate={navigateTo} />;
      case '/map':
        return <MapPage onNavigate={navigateTo} />;
      case '/jobs':
        return <JobsPage onNavigate={navigateTo} />;
      case '/missions':
        return <MissionsPage onNavigate={navigateTo} />;
      case '/wallet':
        return <WalletPage onNavigate={navigateTo} />;
      case '/fuel':
        return <FuelPage onNavigate={navigateTo} />;
      case '/maintenance':
        return <MaintenancePage onNavigate={navigateTo} />;
      case '/insurance':
        return <InsurancePage onNavigate={navigateTo} />;
      case '/police':
        return <PolicePage onNavigate={navigateTo} />;
      case '/marketplace':
        return <MarketplacePage onNavigate={navigateTo} />;
      case '/career':
        return <CareerPage onNavigate={navigateTo} />;
      case '/achievements':
        return <AchievementsPage onNavigate={navigateTo} />;
      case '/leaderboard':
        return <LeaderboardPage onNavigate={navigateTo} />;
      case '/notifications':
        return <NotificationsPage onNavigate={navigateTo} />;
      case '/settings':
        return <SettingsPage onNavigate={navigateTo} />;
      case '/admin':
        return <AdminPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <AppShell activePath={currentPath === '/' ? '/dashboard' : currentPath} onNavigate={navigateTo}>
      {renderProtectedContent()}
    </AppShell>
  );
};
