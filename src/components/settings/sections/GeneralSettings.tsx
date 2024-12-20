import { useSettingsStore } from '../../../store/settingsStore';
import { Switch } from '../../ui/Switch';
import { Select } from '../../ui/Select';

export function GeneralSettings() {
  const {
    defaultPriority,
    defaultDueDate,
    autoAssignToMe,
    setDefaultPriority,
    setDefaultDueDate,
    setAutoAssignToMe,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        General Settings
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Priority
          </label>
          <Select
            value={defaultPriority}
            onChange={(e) => setDefaultPriority(e.target.value as 'low' | 'medium' | 'high')}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Due Date (days)
          </label>
          <input
            type="number"
            min="0"
            value={defaultDueDate}
            onChange={(e) => setDefaultDueDate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 
                     dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white"
          />
        </div>

        <Switch
          label="Auto-assign to me"
          description="Automatically assign new tasks to yourself"
          checked={autoAssignToMe}
          onCheckedChange={setAutoAssignToMe}
        />
      </div>
    </div>
  );
}