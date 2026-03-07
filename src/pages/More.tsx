import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import BackupRestore from '@/components/BackupRestore';
import { 
  ArrowLeft, 
  Settings, 
  FileText, 
  CreditCard, 
  Receipt, 
  BarChart2, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  User,
  Shield,
  Bell
} from 'lucide-react';

export default function More() {
  const navigate = useNavigate();
  const { logout, user } = useApp();

  const isAssistant = user?.role === 'assistant';

  const menuItems = [
    ...(isAssistant ? [] : [{ icon: Settings, label: 'Services & Pricing', path: '/services' }]),
    { icon: FileText, label: 'All Files', path: '/files' },
    { icon: CreditCard, label: 'Payment History', path: '/payments' },
    ...(isAssistant ? [] : [{ icon: Receipt, label: 'Expenses', path: '/expenses' }]),
    ...(isAssistant ? [] : [{ icon: BarChart2, label: 'Daily Summary', path: '/summary' }]),
  ];

  const settingsItems = [
    { icon: User, label: 'Profile Settings', path: '/profile' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Shield, label: 'License & Device', path: '/license' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">More</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* User Info */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-success">License Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Quick Access
          </h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Settings
          </h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            {settingsItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Backup & Restore */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Data Management
          </h3>
          <BackupRestore />
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 bg-destructive/10 rounded-xl border border-destructive/20 hover:bg-destructive/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="flex-1 text-left font-medium text-destructive">Logout</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          RTO Agent v1.0.0 • Offline Ready
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
