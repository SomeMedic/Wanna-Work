import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../store/settingsStore';
import { TaskHeader } from './TaskHeader';
import { TaskMetadata } from './TaskMetadata';
import { TaskTags } from '../features/TaskTags';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { compactView, showTaskId } = useSettingsStore();
  const { updateSubtask, deleteTask } = useBoardStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.status === 'done'
  ).length;
  const progress = subtasks.length
    ? Math.round((completedSubtasks / subtasks.length) * 100)
    : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      deleteTask(task.id);
    } else {
      setShowDeleteConfirm(true);
      // Автоматически скрываем подтверждение через 3 секунды
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onEdit(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        'task-card select-none touch-none',
        'hover:ring-2 hover:ring-accent-primary/20 dark:hover:ring-accent-primary/10',
        isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab',
        compactView ? 'p-2' : 'p-4'
      )}
    >
      <button
        onClick={handleDelete}
        className={cn(
          'absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200',
          'opacity-0 group-hover:opacity-100',
          showDeleteConfirm 
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
        )}
      >
        <Trash2 size={16} />
      </button>

      <TaskHeader
        title={task.title}
        id={task.id}
        priority={task.priority}
        showId={showTaskId}
        compact={compactView}
      />

      {!compactView && (
        <>
          <p className="mt-2 mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {task.description}
          </p>
          
          {task.tags.length > 0 && (
            <div className="mb-3">
              <TaskTags tags={task.tags} size="sm" />
            </div>
          )}

          {subtasks.length > 0 && (
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Подзадачи</span>
                <span>{completedSubtasks} из {subtasks.length}</span>
              </div>
              
              <div className="space-y-1">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="group flex items-center gap-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSubtask(task.id, subtask.id, {
                        status: subtask.status === 'done' ? 'todo' : 'done',
                      });
                    }}
                  >
                    <button
                      className={`flex-shrink-0 transition-colors ${
                        subtask.status === 'done'
                          ? 'text-emerald-500 hover:text-emerald-600'
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {subtask.status === 'done' ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Circle size={14} />
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

              <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}
      
      <TaskMetadata 
        assignee={task.assignee}
        dueDate={task.dueDate}
      />
    </div>
  );
}