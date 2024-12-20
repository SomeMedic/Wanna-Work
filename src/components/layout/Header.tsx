import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBoardsStore } from '../../store/boardsStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TaskSearch } from '../features/TaskSearch';
import { TaskSort } from '../features/TaskSort';
import { TaskStats } from '../features/TaskStats';
import { Board } from '../../types';

interface HeaderProps {
  onNewTask: () => void;
}

export function Header({ onNewTask }: HeaderProps) {
  const { boards, currentBoardId } = useBoardsStore();
  const currentBoard = boards.find((b: Board) => b.id === currentBoardId);

  return (
    <header className="glass-panel border-b border-gray-200/20 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            {currentBoard?.title || 'Выберите доску'}
          </h1>
          <div className="flex items-center gap-4">
            <TaskSearch />
            <TaskSort />
            <ThemeToggle />
            <button
              onClick={onNewTask}
              className="flex items-center gap-2 px-4 py-2 glass-card 
                       hover:ring-2 hover:ring-accent-primary/20 
                       dark:hover:ring-accent-primary/10 transition-all"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>
        <div className="mt-4">
          <TaskStats />
        </div>
      </div>
    </header>
  );
}