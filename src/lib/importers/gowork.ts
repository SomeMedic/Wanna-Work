import { Task } from '../../types';

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

export function validateGoWorkFile(data: any): data is GoWorkData {
  return (
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    typeof data.exportDate === 'string' &&
    Array.isArray(data.tasks) &&
    typeof data.metadata === 'object' &&
    typeof data.metadata.totalTasks === 'number' &&
    typeof data.metadata.totalTimeSpent === 'number' &&
    typeof data.metadata.totalComments === 'number' &&
    typeof data.metadata.totalTimeEntries === 'number'
  );
}

export async function importGoWorkFile(file: File): Promise<Task[]> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!validateGoWorkFile(data)) {
      throw new Error('Invalid .gowork file format');
    }

    return data.tasks;
  } catch (error) {
    throw new Error('Failed to import .gowork file: ' + (error as Error).message);
  }
} 