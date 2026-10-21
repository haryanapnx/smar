import { Icon } from '@/shared/components/Icon';
import { cn } from '@/shared/lib/cn';
import { formatCoordinates, formatRelativeTime } from '@/shared/lib/format';
import type { Vehicle } from '@/api/types';
import { routeLabel } from '../lib/routeLabel';
import { RouteMarker } from '@/shared/components/RouteMarker';
import { VehicleArtwork } from './VehicleArtwork';
import { VehicleStatusBadge } from './VehicleStatusBadge';

export type VehicleCardProps = {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
  priority?: boolean;
};

const cardClasses =
  'group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-brand-500/70 dark:hover:bg-slate-800 dark:hover:shadow-black/40';

export const VehicleCard = ({ vehicle, onSelect, priority = false }: VehicleCardProps) => {
  const stopLabel = vehicle.currentStopSequence
    ? `Halte ${vehicle.stop?.name || vehicle.currentStopSequence}`
    : '';
  const vehicleLabel = vehicle.label || vehicle.id;
  const routeDescription = vehicle.route?.description || 'Layanan bus';
  const tripDestination = vehicle.trip?.headsign || vehicle.trip?.name || '—';

  const content = (
    <div className="cursor-pointer">
      <VehicleArtwork className="h-36 sm:h-40" priority={priority} />

      <div className="mt-3 flex items-center gap-2">
        <div className="max-w-[60%] truncate">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Status
          </span>
          <VehicleStatusBadge
            status={vehicle.status}
            stopLabel={stopLabel}
            className="w-full truncate px-2 py-0.5"
          />
        </div>
        <span className="h-8 w-px shrink-0 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Kendaraan
          </span>
          <span className="block truncate text-xs font-bold leading-tight tracking-tight text-slate-950 dark:text-white">
            {vehicleLabel}
          </span>
        </span>
      </div>

      <section className="mt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
          Rute
        </h3>
        <div className="mt-2 flex items-center gap-2.5">
          <RouteMarker route={vehicle.route} />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold leading-tight text-slate-950 dark:text-white">
              {routeLabel(vehicle.route)}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
              {routeDescription}
            </p>
          </div>
        </div>
        <h3 className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
          Trip
        </h3>
        <p className="mt-1 truncate text-xs font-bold leading-tight text-slate-950 dark:text-white">
          {tripDestination}
        </p>
      </section>

      <dl className="mt-4 grid grid-cols-1 divide-y divide-slate-200 border-t border-slate-200 pt-3 dark:divide-slate-700 dark:border-slate-700 min-[480px]:grid-cols-2 min-[480px]:divide-x min-[480px]:divide-y-0">
        <div className="flex min-w-0 gap-2 pb-3 min-[480px]:pb-0 min-[480px]:pr-3">
          <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
          <div className="min-w-0">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Lokasi saat ini
            </dt>
            <dd className="mt-1 truncate text-[11px] font-medium text-slate-800 dark:text-slate-100">
              {formatCoordinates(vehicle.latitude, vehicle.longitude)}
            </dd>
          </div>
        </div>
        <div className="flex min-w-0 gap-2 pt-3 min-[480px]:pl-3 min-[480px]:pt-0">
          <Icon
            name="clock"
            className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300"
          />
          <div className="min-w-0">
            <dt className="text-[10px] font-bold tracking-wide text-slate-400 dark:text-slate-500">
              Diperbarui
            </dt>
            <dd className="mt-1 truncate text-[11px] font-medium text-slate-800 dark:text-slate-100">
              {formatRelativeTime(vehicle.updatedAt)}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(vehicle)}
        className={cn(cardClasses, 'cursor-pointer')}
      >
        {content}
      </button>
    );
  }

  return <article className={cardClasses}>{content}</article>;
};
