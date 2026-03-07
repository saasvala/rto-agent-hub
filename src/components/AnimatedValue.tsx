import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency } from '@/lib/helpers';

interface AnimatedValueProps {
  value: number;
  isCurrency?: boolean;
  className?: string;
}

export default function AnimatedValue({ value, isCurrency = false, className }: AnimatedValueProps) {
  const animated = useCountUp(value);
  return (
    <span className={className}>
      {isCurrency ? formatCurrency(animated) : animated}
    </span>
  );
}
