import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
          'disabled:opacity-50 disabled:pointer-events-none',
          
          // Варианты
          variant === 'default' && [
            'bg-accent-primary text-white',
            'hover:bg-accent-primary/90',
            'active:bg-accent-primary/80',
          ],
          variant === 'outline' && [
            'border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800',
            'hover:bg-gray-100/50 dark:hover:bg-gray-700/50',
            'active:bg-gray-200/50 dark:active:bg-gray-600/50',
          ],
          variant === 'ghost' && [
            'bg-transparent',
            'hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
            'active:bg-gray-200/50 dark:active:bg-gray-700/50',
          ],
          variant === 'link' && [
            'bg-transparent underline-offset-4',
            'hover:underline',
            'active:underline',
          ],

          // Размеры
          size === 'sm' && 'h-8 px-3 text-sm rounded-md',
          size === 'md' && 'h-10 px-4 rounded-lg',
          size === 'lg' && 'h-12 px-6 rounded-lg',

          className
        )}
        {...props}
      />
    );
  }
); 