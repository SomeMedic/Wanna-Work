import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { cn } from '../../lib/utils';
import { CheckCircle2, CircleDashed, Timer } from 'lucide-react';

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const statusConfig = {
  todo: { 
    title: 'To Do',
    icon: CircleDashed,
    color: 'text-todo-light',
    columnClass: 'column-todo'
  },
  'in-progress': { 
    title: 'In Progress',
    icon: Timer,
    color: 'text-progress-light',
    columnClass: 'column-progress'
  },
  done: { 
    title: 'Done',
    icon: CheckCircle2,
    color: 'text-done-light',
    columnClass: 'column-done'
  },
};

export function Column({ status, tasks, onEditTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    }
  });
  
  const Icon = statusConfig[status].icon;
  const config = statusConfig[status];

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  const taskIds = sortedTasks.map(task => task.id);

  return (
    <div className="w-96 shrink-0">
      <div className={cn(
        'glass-panel p-4',
        'column-neon min-h-[600px]',
        config.columnClass
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Icon className={cn('w-5 h-5', config.color)} />
          <h2 className={cn('column-header text-lg', config.color)}>
            {config.title}
          </h2>
          <span className="glass-card px-2 py-0.5 rounded-full text-sm font-mono">
            {tasks.length}
          </span>
        </div>

        <div
          ref={setNodeRef}
          className={cn(
            "min-h-[calc(100%-2rem)] flex flex-col gap-3 rounded-lg transition-colors duration-200",
            isOver && "bg-accent-primary/5"
          )}
        >
          <SortableContext 
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={onEditTask}
              />
            ))}
            {tasks.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className={cn(
                  "w-12 h-12 mb-4 rounded-full flex items-center justify-center",
                  "bg-gray-100 dark:bg-gray-800",
                  config.color
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 text-center">
                  Перетащите задачу сюда
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 text-center">
                  или создайте новую
                </p>
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}