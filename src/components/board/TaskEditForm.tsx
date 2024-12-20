import { useState } from 'react';
import { Calendar, GitCommit, User } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { Task, Tag } from '../../types';
import { TagInput } from '../features/TagInput';
import { TaskDetails } from '../features/TaskDetails';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

interface TaskEditFormProps {
  task: Task;
  onClose: () => void;
}

export function TaskEditForm({ task, onClose }: TaskEditFormProps) {
  const updateTask = useBoardStore((state) => state.updateTask);
  
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignee: task.assignee || '',
    dueDate: task.dueDate || '',
    tags: task.tags,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(task.id, formData);
    onClose();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          icon={<GitCommit size={16} />}
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title..."
        />

        <Textarea
          label="Description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the task..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({
              ...formData,
              priority: e.target.value as 'low' | 'medium' | 'high',
            })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />

          <Input
            label="Assignee"
            icon={<User size={16} />}
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            placeholder="Assign to..."
          />

          <div className="col-span-2">
            <Input
              type="date"
              label="Due Date"
              icon={<Calendar size={16} />}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <TagInput
              selectedTags={formData.tags}
              onTagsChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-mono text-gray-700 dark:text-gray-300
                     bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                     border border-gray-200/50 dark:border-gray-700/50
                     rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50
                     transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-mono text-white
                     bg-accent-primary hover:bg-accent-primary/90
                     rounded-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>

      <div className="border-t border-gray-200/20 dark:border-gray-700/30 pt-8">
        <TaskDetails task={task} />
      </div>
    </div>
  );
}