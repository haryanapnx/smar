import { formatCoordinates, formatDateTime } from '@/shared/lib/format';
import { getOccupancyLabel, getRevenueLabel } from '@/shared/lib/statusLabels';
import { routeLabel } from '../../lib/routeLabel';
import type { VehicleDetail } from '../../types';
import { RouteMarker } from '../RouteMarker';
import { VehicleArtwork } from '../VehicleArtwork';
import { VehicleStatusBadge } from '../VehicleStatusBadge';
import { AttributeRow } from './AttributeRow';
import { directionText, speedText, stopBadgeText, stopText, tripText } from '../../lib/detailText';

export type VehicleAttributesProps = {
  detail: VehicleDetail;
  stopTotal?: number;
};

export const VehicleAttributes = ({ detail, stopTotal }: VehicleAttributesProps) => (
  <>
    <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
      <VehicleArtwork className="h-32" />
      <div className="min-w-0 pt-1">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Status
        </span>
        <VehicleStatusBadge
          status={detail.status}
          stopLabel={stopBadgeText(detail)}
          className="max-w-full text-[10px]"
        />
        <div className="mt-4">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Kendaraan
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {detail.label}
          </span>
        </div>
      </div>
    </div>

    <dl className="mt-4">
      <AttributeRow icon="bus" label="Vehicle ID" value={detail.label} />
      <AttributeRow
        icon="route"
        label="Rute"
        value={
          <>
            <span className="truncate">{routeLabel(detail.route)}</span>
            <RouteMarker route={detail.route} />
          </>
        }
      />
      <AttributeRow icon="trip" label="Trip" value={tripText(detail)} />
      <AttributeRow icon="chevron" label="Arah" value={directionText(detail)} />
      <AttributeRow icon="clock" label="Kecepatan" value={speedText(detail)} />
      <AttributeRow icon="bus" label="Okupansi" value={getOccupancyLabel(detail.occupancyStatus)} />
      <AttributeRow icon="bus" label="Layanan" value={getRevenueLabel(detail.revenue)} />
      <AttributeRow
        icon="pin"
        label="Lokasi Saat ini"
        value={
          <div className="min-w-0">
            <p className="truncate text-slate-600 dark:text-slate-300">
              {stopText(detail, stopTotal)}
            </p>
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {formatCoordinates(detail.latitude, detail.longitude)}
            </p>
          </div>
        }
      />
      <AttributeRow icon="clock" label="Diperbarui" value={formatDateTime(detail.updatedAt)} />
    </dl>
  </>
);
