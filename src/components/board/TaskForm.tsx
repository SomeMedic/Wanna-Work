import React, { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useBoardsStore } from '../../store/boardsStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Priority, Status, Task, Subtask, BaseTask } from '../../types';
import { cn } from '../../lib/utils';
import { X, Plus, Trash } from 'lucide-react';

interface TaskFormProps {
  onClose: () => void;
  editTask?: Task;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

interface Tag {
  id: string;
  name: string;
  color: string;
}

const TAG_COLORS = [
  'bg-red-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

export function TaskForm({ onClose, editTask }: TaskFormProps) {
  const { addTask, updateTask } = useBoardStore();
  const { currentBoard } = useBoardsStore();
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [priority, setPriority] = useState<Priority>(editTask?.priority || 'medium');
  const [status, setStatus] = useState<Status>(editTask?.status || 'todo');
  const [startDate, setStartDate] = useState<Date | null>(editTask?.startDate ? new Date(editTask.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(editTask?.endDate ? new Date(editTask.endDate) : null);
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    editTask?.subtasks?.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status === 'done' ? 'done' : 'todo'
    })) || []
  );
  const [tags, setTags] = useState<Tag[]>(editTask?.tags || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');
  const [progress, setProgress] = useState(editTask?.progress || 0);
  const [timeEstimate, setTimeEstimate] = useState(editTask?.timeEstimate || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const baseTask: BaseTask = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tags,
      timeEntries: [],
      timeSpent: 0,
      progress: calculateProgress(),
    };

    if (editTask) {
      updateTask(editTask.id, {
        ...baseTask,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        timeEstimate,
        subtasks: subtasks.map(subtask => ({
          ...baseTask,
          id: subtask.id,
          title: subtask.title,
          description: '',
          status: subtask.status === 'done' ? 'done' : 'todo',
          priority: 'medium',
          tags: [],
          timeEntries: [],
          timeSpent: 0,
          progress: subtask.status === 'done' ? 100 : 0,
          createdAt: new Date().toISOString(),
          comments: [],
          order: 0,
          dependencies: [],
          activities: [],
          attachments: [],
          subtasks: [],
          parentTaskId: editTask.id,
        })),
      });
    } else {
      addTask({
        ...baseTask,
        subtasks: subtasks.map(subtask => ({
          ...baseTask,
          title: subtask.title,
          description: '',
          status: subtask.status === 'done' ? 'done' : 'todo',
          priority: 'medium',
          tags: [],
          timeEntries: [],
          timeSpent: 0,
          progress: subtask.status === 'done' ? 100 : 0,
          subtasks: [],
        })),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        timeEstimate,
      });
    }
    onClose();
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: crypto.randomUUID(), title: newSubtask.trim(), status: 'todo' }
    ]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, status: subtask.status === 'todo' ? 'done' : 'todo' } : subtask
    ));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    setTags([
      ...tags,
      { id: crypto.randomUUID(), name: newTag.trim(), color }
    ]);
    setNewTag('');
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const calculateProgress = () => {
    if (subtasks.length === 0) return progress;
    return Math.round((subtasks.filter(s => s.status === 'done').length / subtasks.length) * 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Название
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название задачи"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Описание
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Добавьте описание задачи"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Приоритет
          </label>
          <Select
            value={priority}
            onChange={(value) => setPriority(value as Priority)}
            options={PRIORITIES.map((p) => ({ value: p, label: p }))}
          />
        </div>

        {currentBoard?.type === 'kanban' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Статус
            </label>
            <Select
              value={status}
              onChange={(value) => setStatus(value as Status)}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ]}
            />
          </div>
        )}
      </div>

      {currentBoard?.type === 'gantt' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Дата начала
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Выберите дату начала"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Дата окончания
            </label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Выберите дату окончания"
              minDate={startDate || undefined}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Подзадачи
        </label>
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subtask.status === 'done'}
                onChange={() => handleToggleSubtask(subtask.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn(
                "flex-1 text-sm",
                subtask.status === 'done' && "line-through text-gray-500"
              )}>
                {subtask.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSubtask(subtask.id)}
              >
                <Trash className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Добавить подзадачу"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
            />
            <Button type="button" onClick={handleAddSubtask}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Теги
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs text-white",
                tag.color
              )}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Добавить тег"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" onClick={handleAddTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Прогресс
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right">{progress}%</div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Оценка времени (часы)
          </label>
          <Input
            type="number"
            min="0"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(parseInt(e.target.value) || 0)}
            placeholder="Введите оценку времени"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {editTask ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}