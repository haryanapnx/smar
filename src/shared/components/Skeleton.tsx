import { cn } from '@/shared/lib/cn';

export type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={cn(
      'relative overflow-hidden rounded-md bg-slate-200/80 dark:bg-slate-800',
      className,
    )}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
  </div>
);
