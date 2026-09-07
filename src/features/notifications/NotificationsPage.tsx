import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Fuel, 
  Wrench, 
  Briefcase, 
  Target, 
  AlertTriangle, 
  ShieldCheck, 
  Award, 
  Flame, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { NotificationType, AppNotification } from '../../types';

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, clearNotifications } = useGame();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'FUEL': return <Fuel className="w-5 h-5 text-amber-400" />;
      case 'SERVICE': return <Wrench className="w-5 h-5 text-purple-400" />;
      case 'JOB': return <Briefcase className="w-5 h-5 text-sky-400" />;
      case 'MISSION': return <Target className="w-5 h-5 text-emerald-400" />;
      case 'FINE': return <AlertTriangle className="w-5 h-5 text-danger" />;
      case 'INSURANCE': return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'ACHIEVEMENT': return <Award className="w-5 h-5 text-amber-400" />;
      case 'LEVEL_UP': return <Flame className="w-5 h-5 text-orange-400" />;
      default: return <Bell className="w-5 h-5 text-sky-400" />;
    }
  };

  const markAllRead = () => {
    notifications.forEach(n => markNotificationRead(n.id));
  };

  return (
    <PageContainer>
      <PageHeader
        title="Simulation Notification Center"
        subtitle="Automotive telemetry alerts, service schedules, violation citations, and career updates"
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CheckCheck className="w-4 h-4" />}
                onClick={markAllRead}
              >
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={clearNotifications}
              >
                Clear All
              </Button>
            )}
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: 'ALL', label: 'All Alerts', count: notifications.length },
          { id: 'UNREAD', label: 'Unread Only', count: unreadCount },
        ]}
        activeTab={filter}
        onChange={(f) => setFilter(f as any)}
      />

      <div className="space-y-3">
        {filteredNotifications.map(notif => (
          <Card
            key={notif.id}
            variant={notif.isRead ? 'default' : 'glow-blue'}
            className="p-4 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-app-border">
                  {getNotifIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-primary-text">{notif.title}</h4>
                    {!notif.isRead && <Badge variant="accent" size="sm" dot>NEW</Badge>}
                    <Badge variant="blue" size="sm">{notif.type}</Badge>
                  </div>
                  <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] font-mono text-muted-text mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    Mark Read
                  </Button>
                )}
                {notif.actionUrl && (
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      onNavigate(notif.actionUrl!);
                    }}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="py-16 text-center text-secondary-text text-sm font-mono">
            No notifications currently available.
          </div>
        )}
      </div>
    </PageContainer>
  );
};
