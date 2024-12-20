import { create } from 'zustand';
import { Task, Activity, Comment, Attachment } from '../types';

type NewTask = Omit<Task, 'id' | 'createdAt' | 'comments' | 'order' | 'activities' | 'dependencies' | 'subtasks' | 'attachments'>;
type NewSubtask = Omit<NewTask, 'parentTaskId'>;

interface BoardState {
  tasks: Task[];
  addTask: (task: NewTask & { subtasks?: NewSubtask[] }) => void;
  moveTask: (taskId: string, status: Task['status']) => void;
  reorderTasks: (status: Task['status'], taskIds: string[]) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  clearTasks: () => void;
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addSubtask: (parentId: string, subtask: NewSubtask) => void;
  updateSubtask: (parentId: string, subtaskId: string, updates: Partial<Task>) => void;
  deleteSubtask: (parentId: string, subtaskId: string) => void;
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  importTasks: (tasks: Task[]) => void;
  exportTasks: () => Task[];
}

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: [],
  addTask: (task) =>
    set((state) => {
      const tasksInStatus = state.tasks.filter((t) => t.status === task.status);
      const maxOrder = Math.max(0, ...tasksInStatus.map((t) => t.order));

      const createTask = (baseTask: NewTask | NewSubtask, parentId?: string): Task => ({
        ...baseTask,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        comments: [],
        order: maxOrder + 1,
        activities: [],
        timeEntries: baseTask.timeEntries || [],
        dependencies: [],
        subtasks: [],
        attachments: [],
        progress: baseTask.progress || 0,
        parentTaskId: parentId,
        tags: baseTask.tags || [],
        timeSpent: baseTask.timeSpent || 0,
      });

      const newTask = createTask(task);

      // Создаем подзадачи, если они есть
      if (task.subtasks && task.subtasks.length > 0) {
        newTask.subtasks = task.subtasks.map((subtask) => createTask(subtask, newTask.id));
        
        // Добавляем активность о создании подзадач
        newTask.activities.push({
          id: crypto.randomUUID(),
          taskId: newTask.id,
          type: 'subtask_added',
          user: 'System',
          description: `Added ${task.subtasks.length} subtasks`,
          createdAt: new Date().toISOString(),
          metadata: { count: task.subtasks.length }
        });
      }

      return {
        tasks: [...state.tasks, newTask],
      };
    }),
  moveTask: (taskId, status) =>
    set((state) => {
      const tasksInNewStatus = state.tasks.filter(t => t.status === status);
      const maxOrder = Math.max(0, ...tasksInNewStatus.map(t => t.order));
      
      return {
        tasks: state.tasks.map((task) =>
          task.id === taskId 
            ? { ...task, status, order: maxOrder + 1 }
            : task
        ),
      };
    }),
  reorderTasks: (status, taskIds) =>
    set((state) => {
      const updatedTasks = [...state.tasks];
      
      taskIds.forEach((id, index) => {
        const taskIndex = updatedTasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            order: index,
          };
        }
      });
      
      return { tasks: updatedTasks };
    }),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  clearTasks: () => set({ tasks: [] }),
  addComment: (taskId, comment) =>
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId 
          ? {
              ...task,
              comments: [...task.comments, {
                ...comment,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
              }],
              activities: [...task.activities, {
                id: crypto.randomUUID(),
                taskId: task.id,
                type: 'comment',
                user: comment.author,
                description: `Added a comment: "${comment.content.slice(0, 50)}${comment.content.length > 50 ? '...' : ''}"`,
                createdAt: new Date().toISOString(),
                metadata: { comment: comment.content }
              }]
            }
          : task
      )
    })),
  addSubtask: (parentId, subtask) =>
    set((state) => {
      const parent = state.tasks.find(t => t.id === parentId);
      if (!parent) return state;

      const newSubtask: Task = {
        ...subtask,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        comments: [],
        order: (parent.subtasks?.length || 0) + 1,
        activities: [],
        timeEntries: [],
        dependencies: [],
        subtasks: [],
        attachments: [],
        progress: 0,
        parentTaskId: parentId,
      } as Task;

      const activity: Activity = {
        id: crypto.randomUUID(),
        taskId: parentId,
        type: 'subtask_added',
        user: subtask.assignee || 'System',
        description: `Added subtask: ${subtask.title}`,
        createdAt: new Date().toISOString(),
        metadata: { subtaskId: newSubtask.id }
      };

      return {
        tasks: state.tasks.map(task =>
          task.id === parentId
            ? {
                ...task,
                subtasks: [...(task.subtasks || []), newSubtask],
                activities: [...task.activities, activity]
              }
            : task
        )
      };
    }),
  updateSubtask: (parentId, subtaskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === parentId
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId
                  ? { ...subtask, ...updates }
                  : subtask
              )
            }
          : task
      )
    })),
  deleteSubtask: (parentId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === parentId
          ? {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            }
          : task
      )
    })),
  addAttachment: (taskId, attachment) =>
    set((state) => {
      const newAttachment: Attachment = {
        ...attachment,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      const activity: Activity = {
        id: crypto.randomUUID(),
        taskId,
        type: 'attachment_added',
        user: attachment.createdBy,
        description: `Added attachment: ${attachment.filename}`,
        createdAt: new Date().toISOString(),
        metadata: { attachmentId: newAttachment.id }
      };

      return {
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                attachments: [...(task.attachments || []), newAttachment],
                activities: [...task.activities, activity]
              }
            : task
        )
      };
    }),
  removeAttachment: (taskId, attachmentId) =>
    set((state) => {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return state;

      const attachment = task.attachments.find(a => a.id === attachmentId);
      if (!attachment) return state;

      const activity: Activity = {
        id: crypto.randomUUID(),
        taskId,
        type: 'attachment_removed',
        user: 'System',
        description: `Removed attachment: ${attachment.filename}`,
        createdAt: new Date().toISOString(),
        metadata: { attachmentId }
      };

      return {
        tasks: state.tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                attachments: task.attachments.filter(a => a.id !== attachmentId),
                activities: [...task.activities, activity]
              }
            : task
        )
      };
    }),
  importTasks: (tasks) => {
    // Добавляем активность об импорте для каждой задачи
    const tasksWithImportActivity = tasks.map(task => ({
      ...task,
      activities: [
        ...task.activities,
        {
          id: crypto.randomUUID(),
          taskId: task.id,
          type: 'update' as const,
          user: 'System',
          description: 'Task imported from file',
          createdAt: new Date().toISOString(),
          metadata: { importDate: new Date().toISOString() }
        }
      ]
    })) as Task[];

    set({ tasks: tasksWithImportActivity });
  },
  exportTasks: () => {
    return get().tasks;
  },
}));