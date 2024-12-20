import { LayoutGrid, GanttChart } from 'lucide-react';
import { BoardType } from '../../types';

interface BoardTypeSelectProps {
  value: BoardType;
  onChange: (type: BoardType) => void;
}

export function BoardTypeSelect({ value, onChange }: BoardTypeSelectProps) {
  const types = [
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
    { id: 'gantt', label: 'Gantt Chart', icon: GanttChart },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 
                     transition-all ${
                       value === type.id
                         ? 'border-accent-primary bg-accent-primary/10'
                         : 'border-gray-200 dark:border-gray-700 hover:border-accent-primary/50'
                     }`}
          >
            <Icon className={`w-8 h-8 ${
              value === type.id ? 'text-accent-primary' : 'text-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              value === type.id ? 'text-accent-primary' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  );
} 