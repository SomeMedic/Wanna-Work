import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={cn(
          'relative w-full mx-auto p-4',
          sizeClasses[size]
        )}
      >
        {/* Modal Content */}
        <div 
          className={cn(
            'w-full',
            'glass-panel shadow-2xl',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/20 dark:border-gray-700/30">
            <h2 className="text-xl font-mono font-semibold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-200 
                     hover:bg-gray-100/50 dark:hover:bg-gray-800/50
                     transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body with scrollable content */}
          <div className="p-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}