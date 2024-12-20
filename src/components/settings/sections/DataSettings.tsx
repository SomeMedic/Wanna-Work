import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useBoardStore } from '../../../store/boardStore';
import { useBoardsStore } from '../../../store/boardsStore';
import { Toast } from '../../ui/Toast';

export function DataSettings() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { clearTasks, exportTasks, importTasks } = useBoardStore();
  const { boards, activeBoard, deleteAllBoards } = useBoardsStore();

  const handleClearData = () => {
    if (confirmDelete) {
      clearTasks();
      deleteAllBoards();
      setConfirmDelete(false);
      setToast({
        message: 'Все данные успешно удалены',
        type: 'success'
      });
    }
  };

  const handleExport = () => {
    try {
      const boardData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        board: boards.find(b => b.id === activeBoard),
        tasks: exportTasks()
      };

      const blob = new Blob([JSON.stringify(boardData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardData.board?.name || 'board'}.work`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast({
        message: 'Доска успешно экспортирована',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Ошибка при экспорте доски',
        type: 'error'
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.work';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.version === '1.0' && Array.isArray(data.tasks)) {
          importTasks(data.tasks);
          setToast({
            message: 'Доска успешно импортирована',
            type: 'success'
          });
        } else {
          setToast({
            message: 'Неверный формат файла',
            type: 'error'
          });
        }
      } catch (error) {
        setToast({
          message: 'Ошибка при импорте файла',
          type: 'error'
        });
      }
    };
    input.click();
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Управление данными
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Экспорт и импорт
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Сохраните или загрузите данные в формате .work
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                       text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
                       border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Download size={16} />
                Экспорт
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                       text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
                       border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Upload size={16} />
                Импорт
              </button>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
              Опасная зона
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              Эти действия нельзя отменить. Пожалуйста, будьте осторожны.
            </p>

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="rounded border-red-300 text-red-600 
                           focus:ring-red-500 dark:border-red-700"
                />
                <label
                  htmlFor="confirm"
                  className="text-sm text-red-700 dark:text-red-400"
                >
                  Я понимаю, что это действие нельзя отменить
                </label>
              </div>

              <button
                onClick={handleClearData}
                disabled={!confirmDelete}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 
                       rounded-lg hover:bg-red-700 disabled:opacity-50 
                       disabled:cursor-not-allowed transition-colors"
              >
                Удалить все данные
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}