import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Comment } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useSettingsStore } from '../../store/settingsStore';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

export function TaskComments({ taskId, comments }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const addComment = useBoardStore((state) => state.addComment);
  const { username } = useSettingsStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(taskId, {
      id: crypto.randomUUID(),
      content: newComment,
      author: username || 'Аноним',
      createdAt: new Date().toISOString()
    });
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <MessageSquare size={16} />
        <h3 className="font-medium">Комментарии ({comments.length})</h3>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.author}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавить комментарий..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 
                   dark:border-gray-700 bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          className="p-2 text-white bg-indigo-600 rounded-lg 
                   hover:bg-indigo-700 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}