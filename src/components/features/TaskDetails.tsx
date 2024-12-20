import { useState } from 'react';
import { Clock, Link, MessageSquare, History, ListTodo, Paperclip, Trash2 } from 'lucide-react';
import { Task } from '../../types';
import { TaskComments } from './TaskComments';
import { TaskActivity } from './TaskActivity';
import { TaskDependencies } from './TaskDependencies';
import { TaskTimer } from './TaskTimer';
import { TaskProgress } from './TaskProgress';
import { TaskSubtasks } from './TaskSubtasks';
import { TaskAttachments } from './TaskAttachments';
import { useBoardStore } from '../../store/boardStore';
import { cn } from '../../lib/utils';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task: initialTask, onClose }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState<
    'comments' | 'activity' | 'time' | 'dependencies' | 'subtasks' | 'attachments'
  >('comments');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteTask } = useBoardStore();
  
  const task = useBoardStore(
    (state) => state.tasks.find((t) => t.id === initialTask.id) || initialTask
  );

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteTask(task.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const tabs = [
    { id: 'comments', label: 'Комментарии', icon: MessageSquare },
    { id: 'activity', label: 'Активность', icon: History },
    { id: 'time', label: 'Время', icon: Clock },
    { id: 'dependencies', label: 'Зависимости', icon: Link },
    { id: 'subtasks', label: 'Подзадачи', icon: ListTodo },
    { id: 'attachments', label: 'Вложения', icon: Paperclip },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TaskProgress task={task} />
        
        <button
          onClick={handleDelete}
          className={cn(
            'px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200',
            showDeleteConfirm 
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          )}
        >
          <Trash2 size={16} />
          <span className="text-sm font-medium">
            {showDeleteConfirm ? 'Подтвердить удаление' : 'Удалить задачу'}
          </span>
        </button>
      </div>
      
      <div className="border-b border-gray-200/20 dark:border-gray-700/30">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm
                         border-b-2 transition-all -mb-px whitespace-nowrap
                         ${activeTab === tab.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'comments' && <TaskComments taskId={task.id} comments={task.comments} />}
        {activeTab === 'activity' && <TaskActivity activities={task.activities} />}
        {activeTab === 'time' && <TaskTimer task={task} />}
        {activeTab === 'dependencies' && <TaskDependencies task={task} />}
        {activeTab === 'subtasks' && <TaskSubtasks task={task} />}
        {activeTab === 'attachments' && <TaskAttachments task={task} />}
      </div>
    </div>
  );
}