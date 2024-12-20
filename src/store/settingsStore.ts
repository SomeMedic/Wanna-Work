import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Display Settings
  theme: 'light' | 'dark';
  compactView: boolean;
  showTaskId: boolean;
  
  // User Settings
  username: string;
  
  // Notification Settings
  emailNotifications: boolean;
  dueDateReminders: boolean;
  reminderTime: number; // hours before due date
  
  // General Settings
  defaultPriority: 'low' | 'medium' | 'high';
  defaultDueDate: number; // days from now
  autoAssignToMe: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setCompactView: (enabled: boolean) => void;
  setShowTaskId: (show: boolean) => void;
  setUsername: (username: string) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setDueDateReminders: (enabled: boolean) => void;
  setReminderTime: (hours: number) => void;
  setDefaultPriority: (priority: 'low' | 'medium' | 'high') => void;
  setDefaultDueDate: (days: number) => void;
  setAutoAssignToMe: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Display Settings
      theme: 'light',
      compactView: false,
      showTaskId: false,
      
      // User Settings
      username: '',
      
      // Notification Settings
      emailNotifications: false,
      dueDateReminders: true,
      reminderTime: 24,
      
      // General Settings
      defaultPriority: 'medium',
      defaultDueDate: 7,
      autoAssignToMe: false,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      setCompactView: (compactView) => set({ compactView }),
      setShowTaskId: (showTaskId) => set({ showTaskId }),
      setUsername: (username) => set({ username }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setDueDateReminders: (dueDateReminders) => set({ dueDateReminders }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      setDefaultPriority: (defaultPriority) => set({ defaultPriority }),
      setDefaultDueDate: (defaultDueDate) => set({ defaultDueDate }),
      setAutoAssignToMe: (autoAssignToMe) => set({ autoAssignToMe }),
    }),
    {
      name: 'settings-storage',
    }
  )
);