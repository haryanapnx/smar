import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

export const formatDateTime = (value: string | null | undefined): string => {
  if (!value) {
    return '—';
  }
  const date = dayjs(value);
  return date.isValid() ? date.format('DD MMM YYYY, HH:mm') : '—';
};

export const formatRelativeTime = (value: string | null | undefined): string => {
  if (!value) {
    return '—';
  }
  const date = dayjs(value);
  return date.isValid() ? date.fromNow() : '—';
};

export const formatCoordinate = (value: number | null | undefined, digits = 4): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—';
  }
  return value.toFixed(digits);
};

export const formatCoordinates = (
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): string => `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Terjadi kesalahan yang tidak terduga.';
};
