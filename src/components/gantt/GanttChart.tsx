import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface GanttChartProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const ZOOM_LEVELS = {
  days: { cellWidth: 35, format: 'd' },
  weeks: { cellWidth: 70, format: 'wo' },
  months: { cellWidth: 140, format: 'MMM' },
};

type ZoomLevel = keyof typeof ZOOM_LEVELS;

export function GanttChart({ tasks, onEditTask }: GanttChartProps) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { locale: ru });
  });

  const [endDate, setEndDate] = useState(() => {
    return endOfWeek(addDays(startDate, 30), { locale: ru });
  });

  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('days');
  const containerRef = useRef<HTMLDivElement>(null);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Сортируем задачи по startDate
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const handlePrevPeriod = () => {
    setStartDate(prev => addDays(prev, -14));
    setEndDate(prev => addDays(prev, -14));
  };

  const handleNextPeriod = () => {
    setStartDate(prev => addDays(prev, 14));
    setEndDate(prev => addDays(prev, 14));
  };

  const handleZoomIn = () => {
    const levels: ZoomLevel[] = ['days', 'weeks', 'months'];
    const currentIndex = levels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      setZoomLevel(levels[currentIndex - 1]);
    }
  };

  const handleZoomOut = () => {
    const levels: ZoomLevel[] = ['days', 'weeks', 'months'];
    const currentIndex = levels.indexOf(zoomLevel);
    if (currentIndex < levels.length - 1) {
      setZoomLevel(levels[currentIndex + 1]);
    }
  };

  const getTaskPosition = (task: Task) => {
    if (!task.startDate || !task.endDate) return null;

    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    if (!isWithinInterval(taskStart, { start: startDate, end: endDate }) &&
        !isWithinInterval(taskEnd, { start: startDate, end: endDate })) {
      return null;
    }

    const start = Math.max(differenceInDays(taskStart, startDate), 0);
    const duration = Math.min(
      differenceInDays(taskEnd, taskStart) + 1,
      differenceInDays(endDate, taskStart) + 1
    );

    return {
      left: `${start * ZOOM_LEVELS[zoomLevel].cellWidth}px`,
      width: `${duration * ZOOM_LEVELS[zoomLevel].cellWidth}px`,
    };
  };

  const getTaskColor = (task: Task) => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-400 dark:bg-red-500';
      case 'medium':
        return 'bg-yellow-400 dark:bg-yellow-500';
      case 'low':
        return 'bg-green-400 dark:bg-green-500';
      default:
        return 'bg-blue-400 dark:bg-blue-500';
    }
  };

  return (
    <div className="glass-panel p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Диаграмма Ганта</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevPeriod}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel === 'days'}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel === 'months'}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPeriod}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-full" ref={containerRef}>
          {/* Заголовок с датами */}
          <div className="sticky top-0 z-20 flex bg-white dark:bg-gray-800">
            {/* Заголовок колонки задач */}
            <div className="sticky left-0 z-30 w-[180px] shrink-0 border-b border-r border-gray-200 dark:border-gray-700">
              <div className="h-10 flex items-center px-3 font-medium text-sm">
                Задачи
              </div>
            </div>
            
            {/* Заголовки дат */}
            <div className="flex">
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "w-[35px] shrink-0 border-b border-r border-gray-200 dark:border-gray-700",
                    format(day, 'i') === '6' || format(day, 'i') === '0' 
                      ? 'bg-gray-50/50 dark:bg-gray-800/50' 
                      : ''
                  )}
                >
                  <div className="h-10 px-1 py-1 text-center">
                    <div className="text-[10px] text-gray-500">
                      {format(day, 'EEE', { locale: ru })}
                    </div>
                    <div className="text-xs font-medium">
                      {format(day, ZOOM_LEVELS[zoomLevel].format, { locale: ru })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Строки задач */}
          <div className="relative">
            {sortedTasks.map((task) => (
              <div key={task.id} className="flex">
                {/* Название задачи */}
                <div className="sticky left-0 z-10 w-[180px] shrink-0 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700">
                  <div className="h-12 flex items-center px-3 font-medium text-sm">
                    <span className="truncate">{task.title}</span>
                  </div>
                </div>

                {/* Временная шкала для задачи */}
                <div className="relative flex">
                  {days.map((day) => (
                    <div
                      key={`${task.id}-${day.toISOString()}`}
                      className={cn(
                        "w-[35px] shrink-0 border-b border-r border-gray-200 dark:border-gray-700",
                        format(day, 'i') === '6' || format(day, 'i') === '0' 
                          ? 'bg-gray-50/50 dark:bg-gray-800/50' 
                          : ''
                      )}
                    >
                      <div className="h-12" />
                    </div>
                  ))}

                  {/* Полоса задачи */}
                  {(() => {
                    const position = getTaskPosition(task);
                    if (!position) return null;

                    return (
                      <div
                        className={cn(
                          "absolute h-8 top-2 rounded-lg shadow-sm",
                          getTaskColor(task),
                          "cursor-pointer hover:opacity-90",
                          "transition-all duration-200"
                        )}
                        style={position}
                        onClick={() => onEditTask(task)}
                      >
                        <div className="px-2 h-full flex items-center">
                          <div className="w-full">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium truncate text-white">
                                {task.title}
                              </span>
                              <span className="text-[10px] text-white/90 ml-1">
                                {task.progress}%
                              </span>
                            </div>
                            <div className="w-full h-1 bg-black/10 rounded-full mt-0.5">
                              <div 
                                className="h-full bg-white/30 rounded-full"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}