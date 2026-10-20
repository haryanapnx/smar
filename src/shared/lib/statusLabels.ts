import type { BadgeTone } from '@/shared/components/Badge';

export type VehicleStatusInfo = {
  label: string;
  tone: BadgeTone;
};

const VEHICLE_STATUS: Record<string, VehicleStatusInfo> = {
  IN_TRANSIT_TO: { label: 'Sedang menuju', tone: 'success' },
  INCOMING_AT: { label: 'Akan tiba di', tone: 'warning' },
  STOPPED_AT: { label: 'Berhenti di', tone: 'info' },
  LAYOVER: { label: 'Mangkal di', tone: 'warning' },
  NOT_IN_SERVICE: { label: 'Tidak beroperasi', tone: 'danger' },
};

export const getVehicleStatus = (status: string | null | undefined): VehicleStatusInfo => {
  if (status && VEHICLE_STATUS[status]) {
    return VEHICLE_STATUS[status];
  }
  return { label: status ?? 'Tidak diketahui', tone: 'neutral' };
};

const OCCUPANCY_LABELS: Record<string, string> = {
  MANY_SEATS_AVAILABLE: 'Banyak kursi tersedia',
  FEW_SEATS_AVAILABLE: 'Sedikit kursi tersedia',
  STANDING_ROOM_ONLY: 'Hanya berdiri',
  CRUSHED_STANDING_ROOM_ONLY: 'Berdiri sangat padat',
  FULL: 'Penuh',
  NOT_ACCEPTING_PASSENGERS: 'Tidak menerima penumpang',
  NO_DATA_AVAILABLE: 'Data okupansi tidak tersedia',
};

export const getOccupancyLabel = (status: string | null | undefined): string => {
  if (!status) {
    return '—';
  }
  return OCCUPANCY_LABELS[status] ?? status;
};

export const getRevenueLabel = (revenue: string | null | undefined): string => {
  if (revenue === 'REVENUE') {
    return 'Dalam layanan';
  }
  if (revenue === 'NON_REVENUE') {
    return 'Di luar layanan';
  }
  return revenue ?? '—';
};
