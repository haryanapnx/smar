import { cn } from '@/shared/lib/cn';

export type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export const ErrorState = ({
  title = 'Terjadi kesalahan',
  message,
  onRetry,
  className,
}: ErrorStateProps) => (
  <div
    role="alert"
    className={cn(
      'rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/40',
      className,
    )}
  >
    <p className="font-semibold text-red-800 dark:text-red-200">{title}</p>
    {message ? <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p> : null}
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        Coba lagi
      </button>
    ) : null}
  </div>
);
