import { useState } from 'react';
import {
  ChevronLeft,
  LayoutDashboard,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useBoardsStore } from '../../store/boardsStore';
import { BoardForm } from '../board/BoardForm';
import { Modal } from '../ui/Modal';
import { SettingsModal } from '../settings/SettingsModal';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { boards, currentBoardId, setCurrentBoard, deleteBoard } = useBoardsStore();

  return (
    <>
      <div
        className={cn(
          'h-screen glass-panel border-r border-gray-200/20 dark:border-gray-700/30',
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200/20 dark:border-gray-700/30">
          {!isCollapsed && (
            <h2 className="font-mono font-semibold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Wanna Work?
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 
                     transition-colors"
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 text-gray-500 transition-transform duration-300',
                isCollapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        <div className="p-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className={cn(
              'w-full flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors'
            )}
          >
            <Plus className="w-5 h-5 text-accent-primary" />
            {!isCollapsed && <span className="font-mono">Новая доска</span>}
          </button>

          <div className="mt-4 space-y-1">
            {boards.map((board) => (
              <div
                key={board.id}
                className={cn(
                  'w-full flex items-center gap-2 p-2 rounded-lg transition-all',
                  'hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
                  'group relative',
                  currentBoardId === board.id && 
                  'bg-accent-primary/10 text-accent-primary ring-1 ring-accent-primary/20'
                )}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="flex-1 flex items-center gap-2 cursor-pointer"
                  onClick={() => setCurrentBoard(board.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setCurrentBoard(board.id)}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate font-mono">{board.title}</span>
                  )}
                </div>
                
                {!isCollapsed && boards.length > 1 && (
                  <button
                    onClick={() => deleteBoard(board.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 
                             hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
                             rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200/20 dark:border-gray-700/30">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-2 p-2 text-gray-700 
                     dark:text-gray-300 hover:bg-gray-100/50 
                     dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-accent-secondary" />
            {!isCollapsed && <span className="font-mono">Настройки</span>}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Создание новой доски"
      >
        <BoardForm onClose={() => setIsFormOpen(false)} />
      </Modal>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}