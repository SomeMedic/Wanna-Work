import { formatDistanceToNow } from 'date-fns';
import { Activity } from '../../types';

interface TaskActivityProps {
  activities: Activity[];
}

export function TaskActivity({ activities = [] }: TaskActivityProps) {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No activity yet
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="glass-card p-3 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {activity.user}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}