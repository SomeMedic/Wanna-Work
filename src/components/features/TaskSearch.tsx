import { Search } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';

export function TaskSearch() {
  const { searchTerm, setSearchTerm } = useSearchStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-200 
                 dark:border-gray-700 bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}