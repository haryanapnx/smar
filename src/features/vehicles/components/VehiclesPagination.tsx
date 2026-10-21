import { Pagination } from '@/shared/components/Pagination';
import { Skeleton } from '@/shared/components/Skeleton';

export type VehiclesPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
};

export const VehiclesPagination = ({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  isFetching = false,
}: VehiclesPaginationProps) => {
  const start = total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total);

  const end = Math.min(page * pageSize, total);
  const isUpdating = isFetching && !isLoading;

  return (
    <div className="grid w-full grid-cols-1 items-center gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:grid-cols-2 lg:grid-cols-3">
      <div className="order-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:order-2 sm:col-span-2 lg:order-1 lg:col-span-1 lg:justify-start">
        {isLoading ? (
          <Skeleton className="h-3 w-44" />
        ) : (
          <p>
            Menampilkan{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              {start}-{end} dari {total}
            </strong>{' '}
            kendaraan
          </p>
        )}

        {isUpdating && (
          <span
            aria-live="polite"
            className="inline-flex items-center gap-1.5 font-medium text-brand-600 dark:text-brand-300"
          >
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Memperbarui…
          </span>
        )}
      </div>

      <div className="order-1 flex justify-center sm:order-1 sm:col-span-2 lg:order-2 lg:col-span-1">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          className="justify-center"
        />
      </div>

      <div className="order-2 flex items-center justify-center gap-2 sm:order-3 sm:col-span-2 lg:col-span-1 lg:justify-end">
        <label htmlFor="vehicles-page-size" className="shrink-0">
          Tampilkan
        </label>

        <select
          id="vehicles-page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="shrink-0">per halaman</span>
      </div>
    </div>
  );
};
