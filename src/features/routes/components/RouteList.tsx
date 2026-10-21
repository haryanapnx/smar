import { Link } from 'react-router-dom';
import type { Route } from '@/api/types';
import { Icon } from '@/shared/components/Icon';
import { RouteMarker } from '@/shared/components/RouteMarker';

const routeTitle = (route: Route): string => route.longName || route.shortName || route.id;

const vehiclesHref = (route: Route): string =>
  `/vehicles?routes=${encodeURIComponent(route.id)}`;

const indicatorClasses =
  'inline-grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-500/60 dark:hover:bg-brand-900/40 dark:hover:text-brand-100';

export const RouteList = ({ routes }: { routes: Route[] }) => (
  <>
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:block">
      <table className="w-full table-fixed text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th scope="col" className="w-44 px-4 py-3 font-bold">
              Rute
            </th>
            <th scope="col" className="px-4 py-3 font-bold">
              Nama rute
            </th>
            <th scope="col" className="w-44 px-4 py-3 font-bold">
              Jenis
            </th>
            <th scope="col" className="w-28 px-4 py-3 font-bold">
              Route ID
            </th>
            <th scope="col" className="w-14 px-4 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {routes.map((route) => (
            <tr
              key={route.id}
              className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="px-4 py-2.5">
                <RouteMarker route={route} />
              </td>
              <td className="px-4 py-2.5">
                <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                  {routeTitle(route)}
                </p>
              </td>
              <td className="truncate px-4 py-2.5 text-slate-500 dark:text-slate-400">
                {route.description || '—'}
              </td>
              <td className="truncate px-4 py-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {route.id}
              </td>
              <td className="px-4 py-2.5 text-right">
                <Link
                  to={vehiclesHref(route)}
                  aria-label={`Lihat kendaraan rute ${routeTitle(route)}`}
                  className={indicatorClasses}
                >
                  <Icon name="chevron" className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <ul className="flex flex-col gap-2 md:hidden">
      {routes.map((route) => (
        <li key={route.id}>
          <Link
            to={vehiclesHref(route)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500/60"
          >
            <RouteMarker route={route} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                {routeTitle(route)}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">
                {route.description || '—'} · ID {route.id}
              </span>
            </span>
            <Icon name="chevron" className="h-4 w-4 shrink-0 text-slate-400" />
          </Link>
        </li>
      ))}
    </ul>
  </>
);
