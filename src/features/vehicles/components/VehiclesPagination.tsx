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
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const isUpdating = isFetching && !isLoading;

  return (
    <div className="flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Skeleton className="h-3 w-44" />
        ) : (
          <p>
            Menampilkan{' '}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              {start}–{end} dari {total}
            </strong>{' '}
            kendaraan
          </p>
        )}

        {isUpdating ? (
          <span
            aria-live="polite"
            className="inline-flex items-center gap-1.5 font-medium text-brand-600 dark:text-brand-300"
          >
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Memperbarui…
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <label className="flex items-center gap-2">
          Tampil
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          per halaman
        </label>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
