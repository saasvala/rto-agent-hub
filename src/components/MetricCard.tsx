import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  subtitle?: string;
  onClick?: () => void;
  pulse?: boolean;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  subtitle,
  onClick,
  pulse,
  delay = 0,
}: MetricCardProps) {
  const variantClasses = {
    default: 'bg-card text-foreground',
    primary: 'metric-card-primary',
    accent: 'metric-card-accent',
    success: 'metric-card-success',
    warning: 'metric-card-warning',
  };

  const iconBgClasses = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-primary-foreground/20 text-primary-foreground',
    accent: 'bg-accent-foreground/20 text-accent-foreground',
    success: 'bg-success-foreground/20 text-success-foreground',
    warning: 'bg-warning-foreground/20 text-warning-foreground',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'metric-card cursor-pointer animate-scale-in',
        variantClasses[variant],
        pulse && 'pulse-pending'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-xs font-medium mb-1',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {title}
          </p>
          <p className="text-2xl font-bold counter-animate">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-xs mt-1',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBgClasses[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
