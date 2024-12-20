import { useSettingsStore } from '../../../store/settingsStore';
import { Switch } from '../../ui/Switch';

export function DisplaySettings() {
  const {
    theme,
    compactView,
    showTaskId,
    setTheme,
    setCompactView,
    setShowTaskId,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Display Settings
      </h2>

      <div className="space-y-4">
        <Switch
          label="Dark Theme"
          description="Switch between light and dark mode"
          checked={theme === 'dark'}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />

        <Switch
          label="Compact View"
          description="Show tasks in a more compact layout"
          checked={compactView}
          onCheckedChange={setCompactView}
        />

        <Switch
          label="Show Task IDs"
          description="Display task ID numbers in cards"
          checked={showTaskId}
          onCheckedChange={setShowTaskId}
        />
      </div>
    </div>
  );
}