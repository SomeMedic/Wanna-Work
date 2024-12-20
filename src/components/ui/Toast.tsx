import { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
        'animate-slide-up transition-all duration-300',
        type === 'success' 
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      )}
    >
      {type === 'success' ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
} 