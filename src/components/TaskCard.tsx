import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white p-4 rounded-lg shadow-sm cursor-grab',
        'hover:shadow-md transition-shadow',
        isDragging && 'opacity-50',
      )}
    >
      <h3 className="font-medium mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          'px-2 py-1 rounded-full text-xs',
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>

        <div className="flex items-center gap-3">
          {task.assignee && (
            <div className="flex items-center gap-1 text-gray-600">
              <User size={14} />
              <span>{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}