import { Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/shared/components/Skeleton';
import { patchSearchParams, readIntParam, readListParam } from '@/shared/lib/queryParams';
import { useVehicles } from './hooks/useVehicles';
import { VehicleList } from './components/VehicleList';
import { VehiclesFilters } from './components/VehiclesFilters';
import { VehiclesPagination } from './components/VehiclesPagination';

const VehicleDetailModal = lazy(() =>
  import('./components/detail').then((module) => ({ default: module.VehicleDetailModal })),
);

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/75">
    <div className="w-full max-w-5xl rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900">
      <Skeleton className="h-6 w-40" />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

const PAGE_SIZE_OPTIONS = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

export const VehicleListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, readIntParam(searchParams, 'page', 1));
  const pageSize = readIntParam(searchParams, 'limit', DEFAULT_PAGE_SIZE);
  const routeIds = readListParam(searchParams, 'routes');
  const tripIds = readListParam(searchParams, 'trips');

  const [draftRoutes, setDraftRoutes] = useState<string[]>(routeIds);
  const [draftTrips, setDraftTrips] = useState<string[]>(tripIds);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const routeKey = routeIds.join(',');
  const tripKey = tripIds.join(',');
  useEffect(() => setDraftRoutes(routeKey ? routeKey.split(',') : []), [routeKey]);
  useEffect(() => setDraftTrips(tripKey ? tripKey.split(',') : []), [tripKey]);

  const updateParams = (patch: Record<string, string | null>) =>
    setSearchParams(patchSearchParams(searchParams, patch));

  const query = useVehicles({ page, pageSize, routeIds, tripIds });
  const total = query.data?.total ?? 0;

  const isGridLoading = query.isLoading || query.isPlaceholderData;
  const isBackgroundFetching = query.isFetching && !isGridLoading;

  const handlePageChange = (next: number) => {
    updateParams({ page: String(next) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApply = () =>
    updateParams({
      routes: draftRoutes.length ? draftRoutes.join(',') : null,
      trips: draftTrips.length ? draftTrips.join(',') : null,
      page: '1',
    });

  const handleClear = () => {
    setDraftRoutes([]);
    setDraftTrips([]);
    updateParams({ routes: null, trips: null, page: '1' });
  };

  return (
    <section className="flex flex-col gap-5 pb-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Fleet Management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor armada Transjakarta secara real-time di seluruh rute.
        </p>
      </header>

      <VehiclesFilters
        routeOptions={[]}
        tripOptions={[]}
        selectedRoutes={draftRoutes}
        selectedTrips={draftTrips}
        onRoutesChange={setDraftRoutes}
        onTripsChange={setDraftTrips}
        onClear={handleClear}
        onApply={handleApply}
      />

      <VehicleList
        vehicles={query.data?.items ?? []}
        isLoading={isGridLoading}
        isFetching={isBackgroundFetching}
        error={query.error}
        onRetry={() => query.refetch()}
        onSelect={(vehicle) => setSelectedVehicleId(vehicle.id)}
        skeletonCount={pageSize}
      />

      <VehiclesPagination
        page={page}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => updateParams({ limit: String(size), page: '1' })}
        isLoading={query.isLoading}
        isFetching={isBackgroundFetching}
      />

      {selectedVehicleId ? (
        <Suspense fallback={<ModalFallback />}>
          <VehicleDetailModal
            vehicleId={selectedVehicleId}
            onClose={() => setSelectedVehicleId(null)}
          />
        </Suspense>
      ) : null}
    </section>
  );
};
