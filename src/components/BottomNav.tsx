import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FolderOpen, Users, CreditCard, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/files', icon: FolderOpen, label: 'Files' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/more', icon: Menu, label: 'More' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/dashboard' && location.pathname === '/');
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors touch-target',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-1', isActive && 'stroke-[2.5px]')} />
              <span className={cn('text-xs', isActive && 'font-medium')}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
