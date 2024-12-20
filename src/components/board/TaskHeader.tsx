import { GitCommit } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface TaskHeaderProps {
  title: string;
  id: string;
  priority: 'low' | 'medium' | 'high';
  showId?: boolean;
  compact?: boolean;
}

export function TaskHeader({ title, id, priority, showId, compact }: TaskHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <GitCommit size={14} className="text-accent-primary" />
        <h3 className={cn(
          'font-mono text-gray-900 dark:text-white',
          compact ? 'text-sm' : 'text-base'
        )}>
          {title}
          {showId && (
            <span className="ml-2 font-mono text-xs text-gray-400">
              #{id.slice(0, 7)}
            </span>
          )}
        </h3>
      </div>
      <Badge variant={priority}>
        {priority}
      </Badge>
    </div>
  );
}