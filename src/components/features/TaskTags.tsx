import { Tag as TagIcon } from 'lucide-react';
import { Tag } from '../../types';
import { cn } from '../../lib/utils';

// Predefined tag categories with their respective styles
const tagCategories = {
  bug: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', icon: '🐛' },
  feature: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', icon: '✨' },
  documentation: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', icon: '📚' },
  design: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', icon: '🎨' },
  testing: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: '🧪' },
};

// Default style for custom tags
const defaultTagStyle = {
  bg: 'bg-gray-100 dark:bg-gray-800',
  text: 'text-gray-700 dark:text-gray-300',
  icon: '🏷️',
};

interface TaskTagsProps {
  tags: Tag[];
  size?: 'sm' | 'md';
  onClick?: (tag: Tag) => void;
}

export function TaskTags({ tags, size = 'md', onClick }: TaskTagsProps) {
  const getTagStyle = (tag: Tag) => {
    return tagCategories[tag as keyof typeof tagCategories] || defaultTagStyle;
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const style = getTagStyle(tag);
        return (
          <button
            key={tag}
            onClick={() => onClick?.(tag)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full font-medium',
              'transition-all duration-200',
              'hover:ring-2 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-900',
              'hover:ring-opacity-50 focus:outline-none focus:ring-2',
              style.bg,
              style.text,
              sizeClasses[size],
              onClick && 'cursor-pointer'
            )}
          >
            <span className="text-xs">{style.icon}</span>
            <span>{tag}</span>
          </button>
        );
      })}
    </div>
  );
}