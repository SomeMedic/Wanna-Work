interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ label, description, checked, onCheckedChange }: SwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                     peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full 
                     peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                     peer-checked:after:border-white after:content-[''] after:absolute 
                     after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                     after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                     dark:border-gray-600 peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
}