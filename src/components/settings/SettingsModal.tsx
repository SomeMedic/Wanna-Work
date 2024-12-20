import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { GeneralSettings } from './sections/GeneralSettings';
import { NotificationSettings } from './sections/NotificationSettings';
import { DisplaySettings } from './sections/DisplaySettings';
import { DataSettings } from './sections/DataSettings';
import { UserSettings } from './sections/UserSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'general' | 'notifications' | 'display' | 'data'>('user');

  const tabs = [
    { id: 'user', label: 'Пользователь' },
    { id: 'general', label: 'Общие' },
    { id: 'notifications', label: 'Уведомления' },
    { id: 'display', label: 'Отображение' },
    { id: 'data', label: 'Управление данными' },
  ] as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки" size="lg">
      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all
                         font-mono text-sm
                         ${activeTab === tab.id
                    ? 'bg-accent-primary/10 text-accent-primary ring-1 ring-accent-primary/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-[400px] glass-card p-4">
          {activeTab === 'user' && <UserSettings />}
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'display' && <DisplaySettings />}
          {activeTab === 'data' && <DataSettings />}
        </div>
      </div>
    </Modal>
  );
}