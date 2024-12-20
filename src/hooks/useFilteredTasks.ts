import { useMemo } from 'react';
import { Task } from '../types';
import { useBoardStore } from '../store/boardStore';
import { useSearchStore } from '../store/searchStore';
import { useSortStore } from '../store/sortStore';
import { useFilterStore } from '../store/filterStore';

export function useFilteredTasks() {
  const tasks = useBoardStore((state) => state.tasks);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const sortBy = useSortStore((state) => state.sortBy);
  const { priorityFilter, tagFilter } = useFilterStore();

  return useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Apply tag filter
    if (tagFilter) {
      filtered = filtered.filter((task) => task.tags.includes(tagFilter));
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
        case 'priority': {
          const priority = { low: 0, medium: 1, high: 2 };
          return priority[b.priority] - priority[a.priority];
        }
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tasks, searchTerm, sortBy, priorityFilter, tagFilter]);
}