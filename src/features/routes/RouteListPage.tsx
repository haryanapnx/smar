import { useMemo } from 'react';
import { useRoutes } from '@/api/routes';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Spinner } from '@/shared/components/Spinner';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { getErrorMessage } from '@/shared/lib/format';
import { RouteList } from './components/RouteList';
import { RouteListSkeleton } from './components/RouteListSkeleton';
import { RoutesToolbar } from './components/RoutesToolbar';
import { useRouteSearch } from './hooks/useRouteSearch';

export const RouteListPage = () => {
  const routesQuery = useRoutes();

  const routes = useMemo(
    () => (routesQuery.data?.pages ?? []).flatMap((page) => page.items),
    [routesQuery.data],
  );
  const total = routesQuery.data?.pages[0]?.total ?? 0;
  const { query, setQuery, filtered, isSearching } = useRouteSearch(routes);

  // Auto-load only while browsing. During a search the filtered list shrinks, which would
  // pull the sentinel into view on every keystroke and cascade requests — so loading is
  // manual there.
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: () => {
      if (!isSearching && routesQuery.hasNextPage && !routesQuery.isFetchingNextPage) {
        void routesQuery.fetchNextPage();
      }
    },
    enabled: routesQuery.hasNextPage && !isSearching,
  });

  const isLoading = routesQuery.isLoading || (routesQuery.isFetching && routes.length === 0);
  const hasError = Boolean(routesQuery.error);

  return (
    <section className="flex flex-col gap-5 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Rute</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Semua rute beserta jenis layanannya.
          </p>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          Menampilkan{' '}
          <strong className="font-semibold text-slate-800 dark:text-slate-100">
            {filtered.length}
          </strong>{' '}
          dari {total} rute
        </p>
      </header>

      <RoutesToolbar query={query} onQueryChange={setQuery} />

      {isSearching ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Pencarian mencakup{' '}
          <strong className="font-semibold text-slate-700 dark:text-slate-200">
            {routes.length}
          </strong>{' '}
          rute yang sudah dimuat.
        </p>
      ) : null}

      {isLoading ? <RouteListSkeleton /> : null}

      {hasError ? (
        <ErrorState
          message={getErrorMessage(routesQuery.error)}
          onRetry={() => routesQuery.refetch()}
        />
      ) : null}

      {!isLoading && !hasError && filtered.length === 0 ? (
        <EmptyState title="Tidak ada rute" message="Coba kata kunci lain atau hapus pencarian." />
      ) : null}

      {!isLoading && !hasError && filtered.length > 0 ? <RouteList routes={filtered} /> : null}

      <div ref={sentinelRef} aria-hidden="true" />

      {isSearching && routesQuery.hasNextPage ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void routesQuery.fetchNextPage()}
            disabled={routesQuery.isFetchingNextPage}
            className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-900/30"
          >
            {routesQuery.isFetchingNextPage ? 'Memuat…' : 'Muat lebih banyak rute'}
          </button>
        </div>
      ) : null}

      {!isSearching && routesQuery.isFetchingNextPage ? (
        <div className="flex justify-center py-2">
          <Spinner label="Memuat rute…" />
        </div>
      ) : null}
    </section>
  );
};
