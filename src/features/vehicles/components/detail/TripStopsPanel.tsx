import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { cn } from '@/shared/lib/cn';
import { getErrorMessage } from '@/shared/lib/format';
import { useTripStops } from '../../hooks/useTripStops';
import type { VehicleDetail } from '../../types';

export type TripStopsPanelProps = {
  detail: VehicleDetail;
};

export const TripStopsPanel = ({ detail }: TripStopsPanelProps) => {
  const { isLoading, data, error } = useTripStops(detail.trip?.id);

  if (!detail.trip?.id) {
    return <p className="py-6 text-center text-xs text-slate-500">Trip tidak tersedia.</p>;
  }

  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="py-6 text-center text-xs text-slate-500">{getErrorMessage(error)}</p>;
  }

  return (
    <ol className="h-64 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700 lg:h-full">
      {data?.stops.map((stop, index) => {
        const isCurrent = index + 1 === detail.currentStopSequence;
        return (
          <li
            key={stop.id}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-xs text-slate-700 dark:text-slate-200',
              isCurrent && 'bg-brand-50 font-semibold dark:bg-brand-900/40',
            )}
          >
            <span className="w-6 shrink-0 text-right text-slate-400 dark:text-slate-500">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate">{stop.name}</span>
            {isCurrent ? <Badge tone="info">sekarang</Badge> : null}
          </li>
        );
      })}
    </ol>
  );
};
