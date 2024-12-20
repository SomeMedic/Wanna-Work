import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Tag } from '../../types';
import { useTagStore } from '../../store/tagStore';
import { cn } from '../../lib/utils';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagInput({ selectedTags, onTagsChange }: TagInputProps) {
  const [newTag, setNewTag] = useState('');
  const { customTags, addCustomTag } = useTagStore();

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const tag = newTag.toLowerCase().replace(/\s+/g, '-');
    addCustomTag(tag);
    onTagsChange([...selectedTags, tag]);
    setNewTag('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const defaultTags = ['bug', 'feature', 'documentation', 'design', 'testing'];
  const allTags = [...new Set([...defaultTags, ...customTags])];

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add custom tag..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 
                   dark:border-gray-700 bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="p-2 text-white bg-indigo-600 rounded-lg 
                   hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => 
              selectedTags.includes(tag) 
                ? removeTag(tag)
                : onTagsChange([...selectedTags, tag])
            }
            className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors',
              selectedTags.includes(tag)
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            )}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <X size={14} className="hover:text-indigo-900" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}