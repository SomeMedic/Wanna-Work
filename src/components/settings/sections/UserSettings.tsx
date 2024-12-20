import { useSettingsStore } from '../../../store/settingsStore';
import { Input } from '../../ui/Input';
import { User } from 'lucide-react';

export function UserSettings() {
  const { username, setUsername } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Пользовательские настройки
      </h2>

      <div className="space-y-4">
        <Input
          label="Имя пользователя"
          icon={<User size={16} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Введите ваше имя..."
        />
      </div>
    </div>
  );
} 