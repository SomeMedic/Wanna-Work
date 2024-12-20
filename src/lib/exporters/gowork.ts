import { Task, TimeEntry, Comment, Activity } from '../../types';

interface GoWorkData {
  version: string;
  exportDate: string;
  tasks: Task[];
  metadata: {
    totalTasks: number;
    totalTimeSpent: number;
    totalComments: number;
    totalTimeEntries: number;
  };
}

export function createGoWorkExport(tasks: Task[]): GoWorkData {
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const totalComments = tasks.reduce((acc, task) => acc + task.comments.length, 0);
  const totalTimeEntries = tasks.reduce((acc, task) => acc + task.timeEntries.length, 0);

  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    tasks,
    metadata: {
      totalTasks: tasks.length,
      totalTimeSpent,
      totalComments,
      totalTimeEntries
    }
  };
} 