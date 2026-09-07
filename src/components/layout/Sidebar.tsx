import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  Map, 
  Briefcase, 
  Target, 
  Wallet, 
  Fuel, 
  ShieldCheck, 
  ShieldAlert, 
  ShoppingBag, 
  Award, 
  Trophy, 
  User as UserIcon, 
  Settings, 
  Gauge, 
  Bell, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert as AdminIcon,
  Flame
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Badge } from '../common/Badge';

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, driver, activeJob, notifications, violations, logout } = useGame();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unpaidFinesCount = violations.filter(v => !v.isPaid).length;

  const navGroups: Array<{
    group: string;
    items: Array<{
      path: string;
      label: string;
      icon: any;
      badge?: string;
      badgeVariant?: 'blue' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';
    }>;
  }> = [
    {
      group: 'DRIVING & OPERATIONS',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/drive', label: '3D Drive Game', icon: Gauge, badge: activeJob ? 'ACTIVE' : '3D', badgeVariant: 'blue' },
        { path: '/vehicles', label: 'Fleet Catalog', icon: Car },
        { path: '/garage', label: 'Garage & Tuning', icon: Wrench },
        { path: '/map', label: 'World Map', icon: Map },
        { path: '/jobs', label: 'Job Center', icon: Briefcase, badge: activeJob ? '1' : undefined, badgeVariant: 'blue' },
        { path: '/missions', label: 'Missions', icon: Target },
      ],
    },
    {
      group: 'ECONOMY & SERVICES',
      items: [
        { path: '/wallet', label: 'Wallet & Ledger', icon: Wallet },
        { path: '/fuel', label: 'Fuel Station', icon: Fuel },
        { path: '/maintenance', label: 'Maintenance Hub', icon: Wrench },
        { path: '/insurance', label: 'Insurance', icon: ShieldCheck },
        { path: '/police', label: 'Police & Fines', icon: ShieldAlert, badge: unpaidFinesCount > 0 ? `${unpaidFinesCount}` : undefined, badgeVariant: 'danger' },
        { path: '/marketplace', label: 'Dealership', icon: ShoppingBag },
      ],
    },
    {
      group: 'CAREER & SOCIAL',
      items: [
        { path: '/career', label: 'Career Ladder', icon: Flame },
        { path: '/achievements', label: 'Achievements', icon: Award },
        { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        { path: '/profile', label: 'Driver License', icon: UserIcon },
        { path: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? `${unreadCount}` : undefined, badgeVariant: 'warning' },
        { path: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  if (user?.role === 'admin') {
    navGroups.push({
      group: 'ADMINISTRATION',
      items: [
        { path: '/admin', label: 'Admin Console', icon: AdminIcon, badge: 'ADMIN', badgeVariant: 'purple' },
      ],
    });
  }

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#0D1117]/95 border-r border-[#1F2937] transition-all duration-300 relative z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-muted-text uppercase mb-2">
                {grp.group}
              </p>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-primary-blue text-white shadow-glow-blue font-semibold'
                      : 'text-secondary-text hover:text-primary-text hover:bg-surface-elevated/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant={item.badgeVariant || 'blue'} size="sm">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Active bar indicator for collapsed */}
                  {isActive && isCollapsed && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 bg-white rounded-l" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Driver Quick Badge / Footer */}
      <div className="p-3 border-t border-app-border bg-background-secondary/80">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface/60 border border-app-border">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-base">
                {driver?.avatar || '🏎️'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary-text truncate">{driver?.name || user?.fullName || 'Driver'}</p>
                <p className="text-[10px] font-mono text-accent font-semibold">{driver?.careerLevel || 'ROOKIE'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-secondary-text hover:text-danger hover:bg-red-950/40 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-secondary-text hover:text-danger hover:bg-red-950/40 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="mt-2 w-full py-1 text-muted-text hover:text-primary-text flex items-center justify-center text-xs gap-1 border-t border-app-border/40 pt-2"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px]">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
