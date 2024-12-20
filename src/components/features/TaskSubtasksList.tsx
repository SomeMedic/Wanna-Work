import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../../types';
import { useBoardStore } from '../../store/boardStore';

interface TaskSubtasksListProps {
  task: Task;
  compact?: boolean;
}

export function TaskSubtasksList({ task, compact = false }: TaskSubtasksListProps) {
  const { updateSubtask } = useBoardStore();
  
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.status === 'done'
  ).length;
  const progress = subtasks.length
    ? Math.round((completedSubtasks / subtasks.length) * 100)
    : 0;

  if (subtasks.length === 0) return null;

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      {!compact && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Подзадачи</span>
          <span>
            {completedSubtasks} из {subtasks.length} ({progress}%)
          </span>
        </div>
      )}

      <div className={`space-y-${compact ? '1' : '2'}`}>
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className={`group flex items-center gap-2 ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            <button
              onClick={() =>
                updateSubtask(task.id, subtask.id, {
                  status: subtask.status === 'done' ? 'todo' : 'done',
                })
              }
              className={`flex-shrink-0 transition-colors ${
                subtask.status === 'done'
                  ? 'text-emerald-500 hover:text-emerald-600'
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              {subtask.status === 'done' ? (
                <CheckCircle2 size={compact ? 16 : 18} />
              ) : (
                <Circle size={compact ? 16 : 18} />
              )}
            </button>
            <span
              className={`flex-1 truncate transition-colors ${
                subtask.status === 'done'
                  ? 'text-gray-400 line-through'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {subtask.title}
            </span>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
} 