import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Status, Task } from '../types';
import TaskCard from './TaskCard';
import { cn } from '../lib/utils';

interface ColumnProps {
  status: Status;
  tasks: Task[];
}

const statusConfig = {
  todo: { title: 'To Do', icon: '📋' },
  'in-progress': { title: 'In Progress', icon: '⚡' },
  done: { title: 'Done', icon: '✅' },
};

export default function Column({ status, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span>{statusConfig[status].icon}</span>
        <h2 className="text-lg font-semibold">{statusConfig[status].title}</h2>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[200px] transition-colors',
          'flex flex-col gap-2'
        )}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}