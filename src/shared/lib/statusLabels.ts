import type { BadgeTone } from '@/shared/components/Badge';

export type VehicleStatusInfo = {
  label: string;
  tone: BadgeTone;
};

const humanize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (character) => character.toUpperCase());

const VEHICLE_STATUS: Record<string, VehicleStatusInfo> = {
  IN_TRANSIT_TO: { label: 'In transit to', tone: 'success' },
  INCOMING_AT: { label: 'Incoming at', tone: 'warning' },
  STOPPED_AT: { label: 'Stopped at', tone: 'info' },
};

export const getVehicleStatus = (status: string | null | undefined): VehicleStatusInfo => {
  if (status && VEHICLE_STATUS[status]) {
    return VEHICLE_STATUS[status];
  }
  return { label: status ? humanize(status) : 'Unknown', tone: 'neutral' };
};

const OCCUPANCY_LABELS: Record<string, string> = {
  MANY_SEATS_AVAILABLE: 'Many seats available',
  FEW_SEATS_AVAILABLE: 'Few seats available',
  STANDING_ROOM_ONLY: 'Standing room only',
  CRUSHED_STANDING_ROOM_ONLY: 'Crushed standing room only',
  FULL: 'Full',
  NOT_ACCEPTING_PASSENGERS: 'Not accepting passengers',
  NO_DATA_AVAILABLE: 'No occupancy data',
};

export const getOccupancyLabel = (status: string | null | undefined): string => {
  if (!status) {
    return '—';
  }
  return OCCUPANCY_LABELS[status] ?? humanize(status);
};

export const getRevenueLabel = (revenue: string | null | undefined): string => {
  if (revenue === 'REVENUE') {
    return 'In revenue service';
  }
  if (revenue === 'NON_REVENUE') {
    return 'Not in revenue service';
  }
  return revenue ?? '—';
};
