import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white px-3 py-2',
            'dark:border-gray-700 dark:bg-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 dark:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';