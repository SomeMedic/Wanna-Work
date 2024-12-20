import { useState, useEffect } from 'react';
import { Play, Pause, Timer } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Task, TimeEntry } from '../../types';
import { formatDuration } from '../../lib/utils';

interface TaskTimerProps {
  task: Task;
}

export function TaskTimer({ task }: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState('');
  
  const updateTask = useBoardStore((state) => state.updateTask);
  const updateTimeTracking = useBoardStore((state) => state.updateTimeTracking);
  const { username } = useSettingsStore();

  useEffect(() => {
    let interval: number;
    
    if (isRunning && currentEntry) {
      interval = window.setInterval(() => {
        const start = new Date(currentEntry.startTime).getTime();
        const now = Date.now();
        setElapsed(now - start);
      }, 1000);
    }

    return () => window.clearInterval(interval);
  }, [isRunning, currentEntry]);

  const startTimer = () => {
    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      taskId: task.id,
      user: username || 'Аноним',
      startTime: new Date().toISOString(),
    };
    
    setCurrentEntry(entry);
    setIsRunning(true);
    
    updateTimeTracking(task.id, entry);
  };

  const stopTimer = () => {
    if (!currentEntry) return;
    
    const endTime = new Date().toISOString();
    const duration = elapsed;
    
    const updatedEntry: TimeEntry = {
      ...currentEntry,
      endTime,
      duration,
      description
    };
    
    updateTimeTracking(task.id, updatedEntry);
    
    setIsRunning(false);
    setCurrentEntry(null);
    setElapsed(0);
    setDescription('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between glass-card p-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-accent-primary" />
          <div>
            <h3 className="font-mono font-medium text-gray-900 dark:text-white">
              Учет времени
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Всего: {formatDuration(task.timeSpent || 0)}
            </p>
          </div>
        </div>
        
        <button
          onClick={isRunning ? stopTimer : startTimer}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm
                   transition-all duration-200 ${
                     isRunning
                       ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                       : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                   }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Остановить
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Начать
            </>
          )}
        </button>
      </div>

      {isRunning && (
        <div className="glass-card p-4 border-l-4 border-accent-primary">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
              Текущая сессия
            </span>
            <span className="font-mono text-lg text-accent-primary">
              {formatDuration(elapsed)}
            </span>
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Над чем вы работаете?"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 
                     dark:border-gray-700 bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100"
          />
        </div>
      )}

      <div className="space-y-2">
        {(task.timeEntries || [])
          .filter(entry => entry.endTime)
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .map(entry => (
            <div 
              key={entry.id}
              className="glass-card p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-mono text-gray-900 dark:text-white">
                  {new Date(entry.startTime).toLocaleDateString()}
                </p>
                <span className="font-mono text-accent-primary">
                  {formatDuration(entry.duration || 0)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {entry.description || 'Нет описания'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
} 