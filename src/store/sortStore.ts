import { create } from 'zustand';

type SortBy = 'createdAt' | 'dueDate' | 'priority';

interface SortState {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

export const useSortStore = create<SortState>((set) => ({
  sortBy: 'createdAt',
  setSortBy: (sortBy) => set({ sortBy }),
}));