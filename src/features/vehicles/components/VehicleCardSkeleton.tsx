import { Skeleton } from '@/shared/components/Skeleton';

export const VehicleCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <Skeleton className="h-36 w-full rounded-lg sm:h-40" />

    <div className="mt-3 flex items-center gap-2.5">
      <Skeleton className="h-6 w-24 max-w-[60%] rounded-full" />
      <span className="h-8 w-px shrink-0 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    <section className="mt-4">
      <Skeleton className="h-2.5 w-10" />
      <div className="mt-2 flex items-center gap-2.5">
        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
    </section>

    <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-3 dark:border-slate-700 min-[480px]:grid-cols-2">
      {[0, 1].map((index) => (
        <div key={index} className="flex min-w-0 gap-2">
          <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </dl>
  </div>
);
