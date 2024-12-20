import { useBoardStore } from '../../store/boardStore';
import { Task } from '../../types';

interface TaskProgressProps {
  task: Task;
}

export function TaskProgress({ task }: TaskProgressProps) {
  const updateTask = useBoardStore((state) => state.updateTask);
  const progress = task.progress ?? 0; // Ensure progress has a default value

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-mono text-gray-700 dark:text-gray-300">
          Progress
        </label>
        <span className="text-sm font-mono text-accent-primary">
          {progress}%
        </span>
      </div>
      
      <div className="relative h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-accent-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => updateTask(task.id, { progress: Number(e.target.value) })}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}