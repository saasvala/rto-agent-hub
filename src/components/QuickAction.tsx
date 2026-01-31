import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}

export default function QuickAction({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'quick-action-btn',
        variant === 'primary' && 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center',
        variant === 'primary' 
          ? 'bg-primary-foreground/20' 
          : 'bg-secondary'
      )}>
        <Icon className={cn(
          'w-6 h-6',
          variant === 'primary' ? 'text-primary-foreground' : 'text-primary'
        )} />
      </div>
      <span className={cn(
        'text-xs font-medium',
        variant === 'default' && 'text-foreground'
      )}>
        {label}
      </span>
    </button>
  );
}
