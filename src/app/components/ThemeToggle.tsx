import { Icon } from '@/shared/components/Icon';
import { cn } from '@/shared/lib/cn';
import { useTheme } from '@/shared/hooks/useTheme';

export type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        isDark
          ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-400/40 dark:bg-brand-400/10 dark:text-brand-200'
          : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
        className,
      )}
    >
      <Icon name="moon" className="h-4 w-4" />
    </button>
  );
};
