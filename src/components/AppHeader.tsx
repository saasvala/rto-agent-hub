import React from 'react';
import { useApp } from '@/context/AppContext';
import { Car, Bell, User } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const { user } = useApp();

  return (
    <header className="govt-header px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold">
              {title || 'RTO Agent'}
            </h1>
            <p className="text-xs opacity-80">{user?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
