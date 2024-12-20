export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardWithStats {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedCount: number;
}