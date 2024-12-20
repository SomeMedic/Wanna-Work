import { useState } from 'react';
import { useBoardsStore } from '../../store/boardsStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { BoardType } from '../../types';
import { KanbanSquare, GanttChartSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BoardFormProps {
  onClose: () => void;
}

export function BoardForm({ onClose }: BoardFormProps) {
  const { addBoard } = useBoardsStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<BoardType>('kanban');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBoard({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Тип доски
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setType('kanban')}
            onKeyDown={(e) => e.key === 'Enter' && setType('kanban')}
            className={cn(
              'flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer',
              'hover:border-accent-primary/50',
              type === 'kanban' 
                ? 'border-accent-primary bg-accent-primary/5' 
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <KanbanSquare className="w-8 h-8 mb-2 text-accent-primary" />
            <span className="font-medium">Канбан</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Классическое представление задач по колонкам
            </span>
          </div>
          
          <div
            role="button"
            tabIndex={0}
            onClick={() => setType('gantt')}
            onKeyDown={(e) => e.key === 'Enter' && setType('gantt')}
            className={cn(
              'flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer',
              'hover:border-accent-primary/50',
              type === 'gantt' 
                ? 'border-accent-primary bg-accent-primary/5' 
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <GanttChartSquare className="w-8 h-8 mb-2 text-accent-primary" />
            <span className="font-medium">Диаграмма Ганта</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Временная шкала с зависимостями
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Название доски
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название доски"
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
          placeholder="Добавьте описание доски"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          Создать
        </Button>
      </div>
    </form>
  );
}