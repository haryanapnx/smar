import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { routeOptionLabel, useRoutes } from '@/api/routes';
import { tripOptionLabel, useTrips } from '@/api/trips';
import { useVehicles } from '@/api/vehicles';
import { Skeleton } from '@/shared/components/Skeleton';
import { VehicleList } from './components/VehicleList';
import { VehiclesFilters } from './components/VehiclesFilters';
import { VehiclesPagination } from './components/VehiclesPagination';
import { K_PAGE_SIZE_OPTIONS } from './constants';
import { useVehicleFilterDraft } from './hooks/useVehicleFilterDraft';
import { useVehicleListParams } from './hooks/useVehicleListParams';

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

export const VehicleListPage = () => {
  const { page, pageSize, routeIds, tripIds, updateParams } = useVehicleListParams();
  const { draftRoutes, draftTrips, setDraftTrips, changeRoutes, reset } = useVehicleFilterDraft({
    routeIds,
    tripIds,
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const query = useVehicles({ page, pageSize, routeIds, tripIds });
  const total = query.data?.total ?? 0;

  const isEmptyPage = page > 1 && query.data?.page === page && query.data.items.length === 0;

  useEffect(() => {
    if (!isEmptyPage) {
      return;
    }
    const lastPage = Math.max(1, Math.ceil((query.data?.total ?? 0) / pageSize));
    updateParams({ page: String(lastPage) });
  }, [isEmptyPage, pageSize, query.data?.total, updateParams]);

  const routesQuery = useRoutes();
  const tripsQuery = useTrips(draftRoutes);

  const routeOptions = useMemo(
    () =>
      (routesQuery.data?.pages ?? [])
        .flatMap((pageResult) => pageResult.items)
        .map((route) => ({ value: route.id, label: routeOptionLabel(route) })),
    [routesQuery.data],
  );

  const tripOptions = useMemo(
    () =>
      (tripsQuery.data?.pages ?? [])
        .flatMap((pageResult) => pageResult.items)
        .map((trip) => ({ value: trip.id, label: tripOptionLabel(trip) })),
    [tripsQuery.data],
  );

  const isGridLoading = query.isLoading || query.isPlaceholderData || query.isFetching;
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
    reset();
    updateParams({ routes: null, trips: null, page: '1' });
  };

  return (
    <section className="flex flex-col gap-5 pb-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Manajemen Armada
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor armada Bus secara real-time di seluruh rute.
        </p>
      </header>

      <VehiclesFilters
        routes={{
          options: routeOptions,
          isLoading: routesQuery.isLoading,
          isFetchingMore: routesQuery.isFetchingNextPage,
          hasMore: routesQuery.hasNextPage,
          onLoadMore: () => {
            void routesQuery.fetchNextPage();
          },
        }}
        trips={{
          options: tripOptions,
          isLoading: tripsQuery.isLoading,
          isFetchingMore: tripsQuery.isFetchingNextPage,
          hasMore: tripsQuery.hasNextPage,
          onLoadMore: () => {
            void tripsQuery.fetchNextPage();
          },
          disabled: draftRoutes.length === 0,
          disabledHint: 'Pilih rute dulu untuk memuat trip.',
        }}
        selectedRoutes={draftRoutes}
        selectedTrips={draftTrips}
        onRoutesChange={changeRoutes}
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
        pageSizeOptions={K_PAGE_SIZE_OPTIONS}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => updateParams({ limit: String(size), page: '1' })}
        isLoading={query.isLoading || query.isTotalLoading}
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
