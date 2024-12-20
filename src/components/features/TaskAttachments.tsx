import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, Paperclip } from 'lucide-react';
import { Task } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useSettingsStore } from '../../store/settingsStore';

interface TaskAttachmentsProps {
  task: Task;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function TaskAttachments({ task }: TaskAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { addAttachment, removeAttachment } = useBoardStore();
  const { username } = useSettingsStore();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    Array.from(files)
      .filter(file => file.size <= MAX_FILE_SIZE)
      .forEach(file => {
        addAttachment(task.id, {
          taskId: task.id,
          filename: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          createdBy: username || 'Аноним'
        });
      });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    return <FileText size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Paperclip size={16} />
        <h3 className="font-medium">
          Вложения ({(task.attachments || []).length})
        </h3>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center
                 transition-colors cursor-pointer
                 ${
                   isDragging
                     ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                     : 'border-gray-200 dark:border-gray-700'
                 }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload
          size={24}
          className={`mx-auto mb-2 ${
            isDragging ? 'text-indigo-500' : 'text-gray-400'
          }`}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Перетащите файлы сюда или кликните для выбора
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Максимальный размер файла: 5MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      <div className="space-y-2">
        {(task.attachments || []).map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 
                     bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(attachment.type)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {attachment.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)} • {attachment.createdBy}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={attachment.url}
                download={attachment.filename}
                className="p-1 text-gray-400 hover:text-gray-600 
                        dark:hover:text-gray-300 transition-colors"
              >
                <FileText size={16} />
              </a>
              <button
                onClick={() => removeAttachment(task.id, attachment.id)}
                className="p-1 text-gray-400 hover:text-red-500 
                        transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 