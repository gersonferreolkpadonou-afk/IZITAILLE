import * as React from 'react';
import { cn } from './button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'terracotta' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-primary-900/10 text-primary-900 border-primary-900/20',
    success: 'bg-jauge-vert-bg text-jauge-vert border-jauge-vert/30',
    warning: 'bg-jauge-orange-bg text-jauge-orange border-jauge-orange/30',
    danger: 'bg-jauge-rouge-bg text-jauge-rouge border-jauge-rouge/30',
    terracotta: 'bg-terracotta-100 text-terracotta-700 border-terracotta-300',
    outline: 'border-coton-300 text-coton-700 bg-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
