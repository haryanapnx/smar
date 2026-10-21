import { Skeleton } from '@/shared/components/Skeleton';

export const PageFallback = () => (
  <div className="flex flex-col gap-5">
    <div>
      <Skeleton className="h-7 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
    </div>
    <Skeleton className="h-24 w-full rounded-xl" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);
