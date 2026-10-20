import { useTheme } from '@/shared/hooks/useTheme';
import { cn } from '@/shared/lib/cn';
import type { Theme } from '@/shared/theme/themeContext';

const OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={theme === option.value}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            theme === option.value
              ? 'bg-brand-700 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
