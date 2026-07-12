import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Route, Brain, FileText,
  Target, Users, Briefcase, Settings, LogOut, Menu, X,
  Bell, ChevronDown, GraduationCap, Microscope, TrendingUp,
  Shield, BookOpen, BarChart3, Sparkles,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const navItems = {
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/chat' },
    { icon: Route, label: 'Roadmap', path: '/roadmap' },
    { icon: Brain, label: 'Recommendations', path: '/recommendations' },
    { icon: FileText, label: 'Resume', path: '/resume' },
    { icon: Target, label: 'Skill Gaps', path: '/skill-gaps' },
    { icon: Briefcase, label: 'Interviews', path: '/interviews' },
    { icon: TrendingUp, label: 'Market Insights', path: '/market' },
    { icon: GraduationCap, label: 'Learning', path: '/learning' },
    { icon: Microscope, label: 'Knowledge Graph', path: '/knowledge-graph' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: BookOpen, label: 'Resources', path: '/admin/resources' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ],
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const role = user?.role || 'STUDENT';
  const items = role === 'SUPER_ADMIN' || role === 'ADMIN'
    ? [...navItems.student, ...navItems.admin]
    : navItems.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">CareerPilot</h1>
                <p className="text-[10px] text-muted-foreground">AI Career OS</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[200px] rounded-lg border border-border bg-card p-1 shadow-lg animate-in" sideOffset={5}>
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <Settings className="w-4 h-4" /> Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary cursor-pointer text-red-400" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors" onClick={() => navigate('/notifications')}>
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Admin' : 'Student'}
            </Badge>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
