import { Calendar, User } from 'lucide-react';

interface TaskMetadataProps {
  assignee?: string;
  dueDate?: string;
}

export function TaskMetadata({ assignee, dueDate }: TaskMetadataProps) {
  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      {assignee && (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <User size={14} />
          <span className="font-mono text-sm">{assignee}</span>
        </div>
      )}
      {dueDate && (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <Calendar size={14} />
          <span className="font-mono text-sm">
            {new Date(dueDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}