import { Icon } from '@/shared/components/Icon';

export type RoutesToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export const RoutesToolbar = ({ query, onQueryChange }: RoutesToolbarProps) => (
  <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center">
    <label className="relative flex-1">
      <span className="sr-only">Cari rute</span>
      <Icon
        name="search"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Cari nama, deskripsi, atau ID rute…"
        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-900/30"
      />
    </label>
  </div>
);
