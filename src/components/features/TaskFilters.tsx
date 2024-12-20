import { Filter } from 'lucide-react';
import { Priority, Tag } from '../../types';
import { useFilterStore } from '../../store/filterStore';

export function TaskFilters() {
  const { priorityFilter, tagFilter, setPriorityFilter, setTagFilter } = useFilterStore();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-500" />
        <select
          value={priorityFilter || ''}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | null)}
          className="px-3 py-2 rounded-lg border border-gray-200 
                   dark:border-gray-700 bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <select
        value={tagFilter || ''}
        onChange={(e) => setTagFilter(e.target.value as Tag | null)}
        className="px-3 py-2 rounded-lg border border-gray-200 
                 dark:border-gray-700 bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-gray-100"
      >
        <option value="">All Tags</option>
        <option value="bug">Bug</option>
        <option value="feature">Feature</option>
        <option value="documentation">Documentation</option>
        <option value="design">Design</option>
        <option value="testing">Testing</option>
      </select>
    </div>
  );
}