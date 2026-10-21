import type { VehicleDetail } from '@/api/types';

export const tripText = (detail: VehicleDetail): string =>
  detail.trip?.headsign || detail.trip?.name || '—';

export const directionText = (detail: VehicleDetail): string =>
  detail.directionId != null
    ? (detail.route?.directionNames?.[detail.directionId] ?? `Arah ${detail.directionId}`)
    : '—';

export const speedText = (detail: VehicleDetail): string =>
  detail.speed != null ? `${(detail.speed * 3.6).toFixed(1)} km/jam` : '—';

export const stopBadgeText = (detail: VehicleDetail): string =>
  detail.currentStopSequence ? `Halte ${detail.stop?.name || detail.currentStopSequence}` : '';

export const stopText = (detail: VehicleDetail, total?: number): string => {
  const sequence = detail.currentStopSequence;
  const stopName = detail.stop?.name;

  if (!sequence) {
    return stopName || '—';
  }
  return `Halte ${sequence}${total ? ` dari ${total}` : ''}${stopName ? ` · ${stopName}` : ''}`;
};
