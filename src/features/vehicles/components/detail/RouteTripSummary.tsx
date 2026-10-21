import { getRevenueLabel } from '@/shared/lib/statusLabels';
import { routeLabel } from '../../lib/routeLabel';
import type { VehicleDetail } from '@/api/types';
import { RouteMarker } from '@/shared/components/RouteMarker';
import { directionText, stopText, tripText } from '../../lib/detailText';

export type RouteTripSummaryProps = {
  detail: VehicleDetail;
  stopTotal?: number;
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <p className="flex justify-between gap-3">
    <span>{label}</span>
    <span className="truncate text-right text-slate-700 dark:text-slate-200">{value}</span>
  </p>
);

export const RouteTripSummary = ({ detail, stopTotal }: RouteTripSummaryProps) => (
  <section className="mt-5 lg:shrink-0">
    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Informasi rute &amp; trip</h3>
    <dl className="mt-2 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700">
        <dt className="font-bold text-slate-800 dark:text-slate-100">Rute</dt>
        <dd className="mt-2 flex items-center gap-2 border-b border-slate-100 pb-2 font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
          <RouteMarker route={detail.route} />
          <span className="min-w-0 flex-1 truncate">{routeLabel(detail.route)}</span>
        </dd>
        <div className="space-y-1.5 pt-2 text-slate-500 dark:text-slate-400">
          <SummaryRow label="Route ID" value={detail.route?.id || '—'} />
          <SummaryRow label="Nama rute" value={detail.route?.longName || '—'} />
          <SummaryRow label="Arah" value={directionText(detail)} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700">
        <dt className="font-bold text-slate-800 dark:text-slate-100">Trip</dt>
        <dd className="mt-2 truncate border-b border-slate-100 pb-2 font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
          {tripText(detail)}
        </dd>
        <div className="space-y-1.5 pt-2 text-slate-500 dark:text-slate-400">
          <SummaryRow label="Trip ID" value={detail.trip?.id || '—'} />
          <SummaryRow label="Halte saat ini" value={stopText(detail, stopTotal)} />
          <SummaryRow label="Status layanan" value={getRevenueLabel(detail.revenue)} />
        </div>
      </div>
    </dl>
  </section>
);
