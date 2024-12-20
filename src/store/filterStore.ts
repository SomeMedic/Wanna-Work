import { create } from 'zustand';
import { Priority, Tag } from '../types';

interface FilterState {
  priorityFilter: Priority | null;
  tagFilter: Tag | null;
  setPriorityFilter: (priority: Priority | null) => void;
  setTagFilter: (tag: Tag | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  priorityFilter: null,
  tagFilter: null,
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setTagFilter: (tag) => set({ tagFilter: tag }),
}));