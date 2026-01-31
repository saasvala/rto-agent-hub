import React from 'react';
import { FileStatus } from '@/types';
import { getStatusLabel, getStatusColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: FileStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        getStatusColor(status),
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
