import { K_DOTS } from '@/shared/constants';
import { cn } from '@/shared/lib/cn';
import { getPageItems } from '@/shared/lib/pagination';
import { Icon } from './Icon';

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const arrowClasses =
  'grid h-[30px] w-[30px] place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 sm:h-9 sm:w-9';

const pageClasses = (isActive: boolean) =>
  cn(
    'lg:min-w-[2.25rem] min-w-[1.25rem] rounded-lg px-3 py-1.5 lg:text-sm text-xs font-medium transition mx-1',
    isActive
      ? 'bg-brand-700 text-white'
      : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
  );

export const Pagination = ({ page, pageSize, total, onPageChange, className }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(page, totalPages);

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Navigasi halaman">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
        className={arrowClasses}
      >
        <Icon name="chevron" className="h-4 w-4 rotate-180" />
      </button>

      <div className="items-center gap-1 sm:flex">
        {items.map((item, index) =>
          item === K_DOTS ? (
            <span
              key={`dots-${index}`}
              className="px-2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={pageClasses(item === page)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
        className={arrowClasses}
      >
        <Icon name="chevron" className="h-4 w-4" />
      </button>
    </nav>
  );
};
