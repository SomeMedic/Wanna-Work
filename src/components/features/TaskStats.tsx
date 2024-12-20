import { CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

export function TaskStats() {
  const tasks = useBoardStore((state) => state.tasks);
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length
  };

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
        <ListTodo className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300">Total: {stats.total}</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
        <Clock className="w-4 h-4 text-yellow-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300">In Progress: {stats.inProgress}</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300">Completed: {stats.completed}</span>
      </div>
    </div>
  );
}