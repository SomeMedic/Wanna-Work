import { useSettingsStore } from '../../../store/settingsStore';
import { Switch } from '../../ui/Switch';
import { Select } from '../../ui/Select';

export function NotificationSettings() {
  const {
    emailNotifications,
    dueDateReminders,
    reminderTime,
    setEmailNotifications,
    setDueDateReminders,
    setReminderTime,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Notification Settings
      </h2>

      <div className="space-y-4">
        <Switch
          label="Email Notifications"
          description="Receive email notifications for task updates"
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />

        <Switch
          label="Due Date Reminders"
          description="Get reminded before tasks are due"
          checked={dueDateReminders}
          onCheckedChange={setDueDateReminders}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reminder Time
          </label>
          <Select
            value={reminderTime.toString()}
            onChange={(e) => setReminderTime(Number(e.target.value))}
            options={[
              { value: '24', label: '24 hours before' },
              { value: '48', label: '48 hours before' },
              { value: '72', label: '72 hours before' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}