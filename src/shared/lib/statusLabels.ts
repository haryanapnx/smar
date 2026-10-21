import type { BadgeTone } from '@/shared/components/Badge';

export type VehicleStatusInfo = {
  label: string;
  tone: BadgeTone;
};

const K_VEHICLE_STATUS: Record<string, VehicleStatusInfo> = {
  IN_TRANSIT_TO: { label: 'Sedang menuju', tone: 'success' },
  INCOMING_AT: { label: 'Akan tiba di', tone: 'warning' },
  STOPPED_AT: { label: 'Berhenti di', tone: 'info' },
  LAYOVER: { label: 'Mangkal di', tone: 'warning' },
  NOT_IN_SERVICE: { label: 'Tidak beroperasi', tone: 'danger' },
};

export const getVehicleStatus = (status: string | null | undefined): VehicleStatusInfo => {
  if (status && K_VEHICLE_STATUS[status]) {
    return K_VEHICLE_STATUS[status];
  }
  return { label: status ?? 'Tidak diketahui', tone: 'neutral' };
};

const K_OCCUPANCY_LABELS: Record<string, string> = {
  MANY_SEATS_AVAILABLE: 'Banyak kursi kosong',
  FEW_SEATS_AVAILABLE: 'Kursi tinggal sedikit',
  STANDING_ROOM_ONLY: 'Hanya ruang berdiri',
  CRUSHED_STANDING_ROOM_ONLY: 'Sangat padat / sesak',
  FULL: 'Penuh',
  NOT_ACCEPTING_PASSENGERS: 'Tidak melayani penumpang',
  NO_DATA_AVAILABLE: 'Belum ada info ketersediaan',
};

export const getOccupancyLabel = (status: string | null | undefined): string => {
  if (!status) {
    return '—';
  }
  return K_OCCUPANCY_LABELS[status] ?? status;
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
