import * as React from 'react';
import { cn } from './button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, suffix, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-coton-900 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full h-[52px] px-4 rounded-xl border bg-white text-coton-900 placeholder:text-coton-400 text-base font-medium shadow-xs transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500',
              'disabled:bg-coton-100 disabled:opacity-60 disabled:cursor-not-allowed',
              error
                ? 'border-jauge-rouge focus:ring-jauge-rouge'
                : 'border-coton-300 hover:border-coton-400',
              suffix ? 'pr-12' : '',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 text-sm font-bold text-coton-500 pointer-events-none select-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-sm font-medium text-jauge-rouge">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-coton-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
