// Task status type
export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type BoardType = 'kanban' | 'gantt';

export interface Attachment {
  id: string;
  taskId: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
  createdBy: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export type ActivityType = 
  | 'create'
  | 'update'
  | 'comment'
  | 'status'
  | 'assign'
  | 'attachment_added'
  | 'attachment_removed'
  | 'subtask_added'
  | 'subtask_completed'
  | 'dependency_added'
  | 'dependency_removed'
  | 'time_tracked';

export interface Activity {
  id: string;
  taskId: string;
  type: ActivityType;
  user: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  user: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  description?: string;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: 'blocks' | 'blocked-by' | 'relates-to';
}

// Базовые поля задачи, необходимые при создании
export interface BaseTask {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: Tag[];
  timeEntries: TimeEntry[];
  timeSpent: number;
  progress: number;
}

// Полный тип задачи, включая все поля
export interface Task extends BaseTask {
  id: string;
  createdAt: string;
  assignee?: string;
  dueDate?: string;
  comments: Comment[];
  order: number;
  timeEstimate?: number;
  dependencies: TaskDependency[];
  activities: Activity[];
  parentTaskId?: string;
  subtasks: Task[];
  attachments: Attachment[];
  startDate?: string;
  endDate?: string;
}

export interface Subtask {
  id: string;
  title: string;
  status: 'todo' | 'done';
}

export interface Board {
  id: string;
  title: string;
  type: BoardType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}