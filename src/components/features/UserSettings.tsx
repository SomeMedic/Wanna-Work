import { useState } from 'react';
import { User } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export function UserSettings() {
  const { username, setUsername } = useSettingsStore();
  const [editingName, setEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      setUsername(newUsername.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <User className="w-4 h-4 text-gray-500" />
      {editingName ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="px-2 py-1 text-sm rounded border border-gray-200 
                     dark:border-gray-700 bg-white dark:bg-gray-800"
            autoFocus
          />
          <button
            type="submit"
            className="text-xs text-accent-primary hover:text-accent-primary-dark"
          >
            Save
          </button>
        </form>
      ) : (
        <button
          onClick={() => setEditingName(true)}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-accent-primary"
        >
          {username}
        </button>
      )}
    </div>
  );
} 