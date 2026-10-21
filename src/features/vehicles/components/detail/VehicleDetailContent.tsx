import { Suspense, lazy, useState } from 'react';
import { Skeleton } from '@/shared/components/Skeleton';
import { cn } from '@/shared/lib/cn';
import { useTripStops } from '../../hooks/useTripStops';
import type { VehicleDetail } from '../../types';
import { RouteTripSummary } from './RouteTripSummary';
import { TripStopsPanel } from './TripStopsPanel';
import { VehicleAttributes } from './VehicleAttributes';

const VehicleMap = lazy(() =>
  import('./VehicleMap').then((module) => ({ default: module.VehicleMap })),
);

type Tab = 'map' | 'stops';

const K_TABS: Array<{ id: Tab; label: string }> = [
  { id: 'map', label: 'Peta' },
  { id: 'stops', label: 'Daftar Halte' },
];

export type VehicleDetailContentProps = {
  detail: VehicleDetail;
};

export const VehicleDetailContent = ({ detail }: VehicleDetailContentProps) => {
  const [tab, setTab] = useState<Tab>('map');
  const tripStops = useTripStops(detail.trip?.id);
  const stopTotal = tripStops.data?.total;

  return (
    <div className="lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
        <div className="lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <VehicleAttributes detail={detail} stopTotal={stopTotal} />
        </div>

        <div className="lg:flex lg:min-h-0 lg:flex-col">
          <div
            role="tablist"
            aria-label="Tampilan detail"
            className="flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-700 lg:shrink-0"
          >
            {K_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition',
                  tab === item.id
                    ? 'bg-brand-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="mt-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            {tab === 'map' ? (
              <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl lg:h-full" />}>
                <VehicleMap
                  latitude={detail.latitude}
                  longitude={detail.longitude}
                  label={detail.label}
                  className="h-64 lg:h-full"
                />
              </Suspense>
            ) : (
              <TripStopsPanel detail={detail} />
            )}
          </div>
        </div>
      </div>

      <RouteTripSummary detail={detail} stopTotal={stopTotal} />
    </div>
  );
};
