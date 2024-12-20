import { SortAsc } from 'lucide-react';
import { useSortStore } from '../../store/sortStore';

export function TaskSort() {
  const { sortBy, setSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-2">
      <SortAsc className="w-4 h-4 text-gray-500" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as any)}
        className="px-3 py-2 rounded-lg border border-gray-200 
                 dark:border-gray-700 bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-gray-100"
      >
        <option value="createdAt">Created Date</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}