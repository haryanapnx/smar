import { cn } from '@/shared/lib/cn';

export type EmptyStateProps = {
  title: string;
  message?: string;
  className?: string;
};

export const EmptyState = ({ title, message, className }: EmptyStateProps) => (
  <div
    className={cn(
      'rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900',
      className,
    )}
  >
    <p className="font-medium text-slate-800 dark:text-slate-100">{title}</p>
    {message ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
  </div>
);
