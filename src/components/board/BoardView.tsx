import { Board, Task } from '../../types';
import { KanbanBoard } from './KanbanBoard';
import { GanttChart } from '../gantt/GanttChart';
import { useBoardsStore } from '../../store/boardsStore';

interface BoardViewProps {
  board: Board;
  tasks: Task[];
}

export function BoardView({ board, tasks }: BoardViewProps) {
  console.log('Board type:', board.type);
  
  const isBoardTypeGantt = board.type === 'gantt';
  console.log('Is Gantt board:', isBoardTypeGantt);

  if (isBoardTypeGantt) {
    return <GanttChart tasks={tasks} />;
  }

  return <KanbanBoard tasks={tasks} />;
} 