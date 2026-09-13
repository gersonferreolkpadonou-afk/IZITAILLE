import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'terracotta' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.98]';

    const variants = {
      primary: 'bg-primary-900 text-white hover:bg-primary-950 shadow-sm',
      terracotta: 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-md shadow-terracotta-500/20',
      secondary: 'bg-coton-100 text-coton-900 border border-coton-200 hover:bg-coton-200',
      outline: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-900/5',
      danger: 'bg-jauge-rouge text-white hover:bg-red-700 shadow-sm',
      ghost: 'text-coton-700 hover:bg-coton-200/60',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm',
      default: 'h-[52px] px-6 text-base', // 52px pour ergonomie mobile immédiate
      lg: 'h-14 px-8 text-lg font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
