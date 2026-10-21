import { Skeleton } from '@/shared/components/Skeleton';

export const VehicleDetailSkeleton = () => (
  <div className="lg:flex lg:h-full lg:min-h-0 lg:flex-col">
    <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
      <div className="lg:min-h-0">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="space-y-3 pt-1">
            <Skeleton className="h-6 w-28 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      </div>

      <div className="lg:flex lg:min-h-0 lg:flex-col">
        <Skeleton className="h-9 w-full rounded-lg lg:shrink-0" />
        <Skeleton className="mt-3 h-64 w-full rounded-xl lg:min-h-0 lg:flex-1" />
      </div>
    </div>

    <div className="mt-5 lg:shrink-0">
      <Skeleton className="h-4 w-40" />
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
