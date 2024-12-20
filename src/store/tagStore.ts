import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag } from '../types';

interface TagState {
  customTags: Tag[];
  addCustomTag: (tag: Tag) => void;
  removeCustomTag: (tag: Tag) => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      customTags: [],
      addCustomTag: (tag) =>
        set((state) => ({
          customTags: state.customTags.includes(tag)
            ? state.customTags
            : [...state.customTags, tag],
        })),
      removeCustomTag: (tag) =>
        set((state) => ({
          customTags: state.customTags.filter((t) => t !== tag),
        })),
    }),
    {
      name: 'tag-storage',
    }
  )
);