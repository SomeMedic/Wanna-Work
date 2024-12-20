import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white px-3 py-2',
            'dark:border-gray-700 dark:bg-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none',
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

Textarea.displayName = 'Textarea';