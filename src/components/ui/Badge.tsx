import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
}

const variantStyles = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-blue-400/30',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 ring-yellow-400/30',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-red-400/30',
};

export function Badge({ variant = 'medium', children }: BadgeProps) {
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-mono',
      'ring-1 ring-inset',
      variantStyles[variant]
    )}>
      {children}
    </span>
  );
}