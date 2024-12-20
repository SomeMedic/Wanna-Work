import { 
  BarChart2, 
  Clock, 
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { useSettingsStore } from '../../store/settingsStore';

export function Dashboard() {
  const { tasks } = useBoardStore();
  const { username } = useSettingsStore();

  // Расчет метрик
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const urgentTasks = tasks.filter(t => t.priority === 'high').length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Получаем задачи с дедлайном на сегодня
  const today = new Date().toISOString().split('T')[0];
  const dueTodayTasks = tasks.filter(t => t.dueDate === today);

  // Последние активности
  const recentActivities = tasks
    .flatMap(task => task.activities.map(activity => ({
      ...activity,
      taskTitle: task.title
    })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Общая статистика */}
      <div className="glass-card p-4 hover:ring-2 hover:ring-accent-primary/20 dark:hover:ring-accent-primary/10 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="font-medium">Общая статистика</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Всего задач</span>
            <span className="font-mono">{totalTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Выполнено</span>
            <span className="font-mono">{completedTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Процент выполнения</span>
            <span className="font-mono">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Текущий прогресс */}
      <div className="glass-card p-4 hover:ring-2 hover:ring-accent-primary/20 dark:hover:ring-accent-primary/10 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="font-medium">Текущий прогресс</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">В работе</span>
            <span className="font-mono">{inProgressTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Срочных</span>
            <span className="font-mono">{urgentTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">На сегодня</span>
            <span className="font-mono">{dueTodayTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Дедлайны */}
      <div className="glass-card p-4 hover:ring-2 hover:ring-accent-primary/20 dark:hover:ring-accent-primary/10 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Calendar className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="font-medium">Дедлайны</h3>
        </div>
        <div className="space-y-2">
          {dueTodayTasks.length > 0 ? (
            dueTodayTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                  {task.title}
                </span>
                <span className="text-xs font-mono text-yellow-500 ml-2">Сегодня</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Нет задач на сегодня
            </div>
          )}
        </div>
      </div>

      {/* Последние активности */}
      <div className="glass-card p-4 hover:ring-2 hover:ring-accent-primary/20 dark:hover:ring-accent-primary/10 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="font-medium">Последние активности</h3>
        </div>
        <div className="space-y-2">
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0">
                  {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-600 dark:text-gray-300">
                    {activity.user === username ? 'Вы' : activity.user}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 ml-1">
                    {activity.description}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Нет активностей
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 