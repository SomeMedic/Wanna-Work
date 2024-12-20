import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  onChange: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, onChange, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-white px-3 py-2',
          'dark:border-gray-700 dark:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';