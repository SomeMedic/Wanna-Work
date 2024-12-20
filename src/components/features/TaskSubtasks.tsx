import { useState } from 'react';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { Task } from '../../types';
import { useBoardStore } from '../../store/boardStore';

interface TaskSubtasksProps {
  task: Task;
}

export function TaskSubtasks({ task }: TaskSubtasksProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const { addSubtask, updateSubtask, deleteSubtask } = useBoardStore();

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    addSubtask(task.id, {
      title: newSubtaskTitle,
      description: '',
      status: 'todo',
      priority: 'medium',
      tags: [],
      timeEntries: [],
      timeSpent: 0,
      comments: [],
      activities: [],
      dependencies: [],
      subtasks: [],
      attachments: [],
      progress: 0,
    });

    setNewSubtaskTitle('');
  };

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.status === 'done'
  ).length;
  const progress = subtasks.length
    ? Math.round((completedSubtasks / subtasks.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          {isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          Подзадачи ({subtasks.length})
        </h3>
        {subtasks.length > 0 && (
          <span className="text-sm text-gray-500">
            {completedSubtasks} из {subtasks.length} выполнено ({progress}%)
          </span>
        )}
      </div>

      {isExpanded && (
        <>
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Добавить подзадачу..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 
                     dark:border-gray-700 bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim()}
              className="p-2 text-white bg-indigo-600 rounded-lg 
                     hover:bg-indigo-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
            </button>
          </form>

          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-3 p-3 bg-gray-50 
                        dark:bg-gray-800/50 rounded-lg group"
              >
                <input
                  type="checkbox"
                  checked={subtask.status === 'done'}
                  onChange={(e) =>
                    updateSubtask(task.id, subtask.id, {
                      status: e.target.checked ? 'done' : 'todo',
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 
                          text-indigo-600 focus:ring-indigo-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    subtask.status === 'done'
                      ? 'line-through text-gray-500'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  onClick={() => deleteSubtask(task.id, subtask.id)}
                  className="p-1 text-gray-400 hover:text-red-500 
                          transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 