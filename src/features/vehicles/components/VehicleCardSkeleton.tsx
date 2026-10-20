import { Skeleton } from '@/shared/components/Skeleton';

export const VehicleCardSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <Skeleton className="h-32 w-full rounded-lg" />

    <div className="mt-2 flex items-center justify-between gap-2">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-7 w-7 rounded-full" />
    </div>

    <Skeleton className="mt-1.5 h-3 w-32" />

    <Skeleton className="mt-1.5 h-5 w-20" />

    <div className="mt-2 space-y-1.5">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);
