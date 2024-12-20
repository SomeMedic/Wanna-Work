import { useEffect, useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  DragOverEvent,
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from './store/boardStore';
import { useBoardsStore } from './store/boardsStore';
import { useTheme } from './hooks/useTheme';
import { Task, Status } from './types/index';
import { Column } from './components/board/Column';
import { TaskCard } from './components/board/TaskCard';
import { TaskForm } from './components/board/TaskForm';
import { BoardForm } from './components/board/BoardForm';
import { Modal } from './components/ui/Modal';
import { useFilteredTasks } from './hooks/useFilteredTasks';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TaskEditForm } from './components/board/TaskEditForm';
import { Dashboard } from './components/features/Dashboard';
import { GanttChart } from './components/gantt/GanttChart';

const STATUSES: Status[] = ['todo', 'in-progress', 'done'];

export default function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, moveTask, reorderTasks } = useBoardStore();
  const filteredTasks = useFilteredTasks();
  const { theme } = useTheme();
  const { boards, currentBoard } = useBoardsStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);
    
    if (!activeTask) return;

    if (overTask) {
      const activeStatus = activeTask.status;
      const overStatus = overTask.status;
      
      if (activeStatus === overStatus) {
        const activeItems = tasks
          .filter(t => t.status === activeStatus)
          .sort((a, b) => a.order - b.order);
          
        const oldIndex = activeItems.findIndex(t => t.id === activeId);
        const newIndex = activeItems.findIndex(t => t.id === overId);
        
        if (oldIndex !== newIndex) {
          const newItems = arrayMove(activeItems, oldIndex, newIndex);
          reorderTasks(activeStatus, newItems.map(t => t.id));
        }
      } else {
        moveTask(activeId as string, overStatus);
      }
    } else if (STATUSES.includes(overId as Status)) {
      const newStatus = overId as Status;
      if (activeTask.status !== newStatus) {
        moveTask(activeId as string, newStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    if (active.id !== over.id) {
      const activeId = active.id;
      const overId = over.id;
      
      if (STATUSES.includes(overId as Status)) {
        moveTask(activeId as string, overId as Status);
      }
    }
    
    setActiveTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const renderBoard = () => {
    if (!currentBoard) return null;

    if (currentBoard.type === 'gantt') {
      return (
        <div className="max-w-[1400px] mx-auto space-y-8">
          <Dashboard />
          <GanttChart 
            tasks={tasks}
            onEditTask={handleEditTask}
          />
        </div>
      );
    }

    return (
      <div className="max-w-[1400px] mx-auto space-y-8">
        <Dashboard />
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex justify-center gap-8 min-h-[600px]">
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={tasks.filter((task) => task.status === status)}
                onEditTask={handleEditTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} onEdit={handleEditTask} />}
          </DragOverlay>
        </DndContext>
      </div>
    );
  };

  if (boards.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Добро пожаловать в Task Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Создайте свою первую доску для начала работы
          </p>
          <Modal
            isOpen={true}
            onClose={() => {}}
            title="Создание первой доски"
          >
            <BoardForm onClose={() => {}} />
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewTask={() => setIsFormOpen(true)} />

        <main className="flex-1 overflow-auto p-4">
          {renderBoard()}
        </main>

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Создать новую задачу"
        >
          <TaskForm onClose={() => setIsFormOpen(false)} />
        </Modal>

        <Modal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          title={editingTask ? `Редактировать задачу: ${editingTask.title}` : ''}
          size="2xl"
        >
          {editingTask && (
            <TaskEditForm 
              task={editingTask}
              onClose={() => setEditingTask(null)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}