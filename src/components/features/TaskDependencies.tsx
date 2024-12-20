import { useState } from 'react';
import { Link, Plus } from 'lucide-react';
import { Task, TaskDependency } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { Select } from '../ui/Select';

interface TaskDependenciesProps {
  task: Task;
}

export function TaskDependencies({ task }: TaskDependenciesProps) {
  const [dependencyType, setDependencyType] = useState<TaskDependency['type']>('blocks');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  
  const { tasks, updateTask } = useBoardStore();
  const availableTasks = tasks.filter(t => t.id !== task.id);

  const addDependency = () => {
    if (!selectedTaskId) return;

    const newDependency: TaskDependency = {
      id: crypto.randomUUID(),
      taskId: task.id,
      dependsOnTaskId: selectedTaskId,
      type: dependencyType,
    };

    updateTask(task.id, {
      dependencies: [...task.dependencies, newDependency],
    });

    setSelectedTaskId('');
  };

  const removeDependency = (dependencyId: string) => {
    updateTask(task.id, {
      dependencies: task.dependencies.filter(d => d.id !== dependencyId),
    });
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Type"
            value={dependencyType}
            onChange={(e) => setDependencyType(e.target.value as TaskDependency['type'])}
            options={[
              { value: 'blocks', label: 'Blocks' },
              { value: 'blocked-by', label: 'Blocked by' },
              { value: 'relates-to', label: 'Relates to' },
            ]}
          />
          
          <Select
            label="Task"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            options={[
              { value: '', label: 'Select a task...' },
              ...availableTasks.map(t => ({
                value: t.id,
                label: t.title,
              })),
            ]}
          />
        </div>

        <button
          onClick={addDependency}
          disabled={!selectedTaskId}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 
                   text-sm font-mono text-white bg-accent-primary 
                   hover:bg-accent-primary/90 rounded-lg transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Add Dependency
        </button>
      </div>

      <div className="space-y-2">
        {task.dependencies.map((dependency) => {
          const dependentTask = tasks.find(t => t.id === dependency.dependsOnTaskId);
          if (!dependentTask) return null;

          return (
            <div
              key={dependency.id}
              className="glass-card p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Link size={16} className="text-accent-primary" />
                <span className="text-sm font-mono">
                  {dependency.type}
                </span>
                <span className="text-sm">
                  {dependentTask.title}
                </span>
              </div>
              <button
                onClick={() => removeDependency(dependency.id)}
                className="p-1 text-gray-400 hover:text-red-500 
                         transition-colors rounded-lg"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}