import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Sparkles, TrendingUp, Target, Award, Brain, Route } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notification';
import { Notification } from '../types';
import { formatDate, formatTime } from '../lib/utils';
import toast from 'react-hot-toast';

const iconMap: Record<string, any> = {
  ROADMAP_UPDATED: Route,
  SKILL_RECOMMENDED: Brain,
  MARKET_CHANGE: TrendingUp,
  MILESTONE: Award,
  READINESS_IMPROVED: Target,
  INTERVIEW_PERFORMANCE: Sparkles,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch { console.error('Failed to fetch notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { toast.error('Failed to mark as read'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Stay updated on your career journey</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <Card
                key={n.id}
                className={`glass-hover cursor-pointer ${!n.isRead ? 'border-primary/30 bg-primary/5' : ''}`}
                onClick={() => handleMarkRead(n.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    n.isRead ? 'bg-secondary' : 'bg-primary/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${n.isRead ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </p>
                      {!n.isRead && <Badge className="text-[10px]">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(n.createdAt)} at {formatTime(n.createdAt)}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{n.type.replace('_', ' ')}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
