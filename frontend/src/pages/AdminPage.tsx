import React, { useEffect, useState } from 'react';
import { Users, BarChart3, BookOpen, Settings, Shield, Trash2, UserCog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch { console.error('Failed to fetch analytics'); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch { console.error('Failed to fetch users'); }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchAnalytics(), fetchUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This action is irreversible.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    ...(isSuperAdmin ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your CareerPilot AI platform</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="w-3 h-3" /> {isSuperAdmin ? 'Super Admin' : 'Admin'}
        </Badge>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{analytics.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-400">{analytics.verifiedUsers}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">{analytics.totalResumes}</p>
              <p className="text-xs text-muted-foreground">Resumes Uploaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{analytics.totalChats}</p>
              <p className="text-xs text-muted-foreground">Total Chats</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{analytics.totalInterviews}</p>
              <p className="text-xs text-muted-foreground">Interviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-400">{analytics.totalRoadmaps}</p>
              <p className="text-xs text-muted-foreground">Roadmaps</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg glass-hover">
                  <div>
                    <p className="text-sm font-medium">{u.fullName}</p>
                    <p className="text-xs text-muted-foreground">{u.email} · Joined {formatDate(u.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === 'SUPER_ADMIN' ? 'default' : u.role === 'ADMIN' ? 'secondary' : 'outline'}>
                      {u.role}
                    </Badge>
                    {isSuperAdmin && (
                      <>
                        <select
                          className="h-8 text-xs rounded border border-input bg-background px-2"
                          value={u.role}
                          onChange={e => handleUpdateRole(u.id, e.target.value)}
                        >
                          <option value="STUDENT">Student</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-1 hover:bg-destructive/20 rounded text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
