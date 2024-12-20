import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}