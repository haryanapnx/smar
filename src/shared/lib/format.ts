import dayjs from 'dayjs';

export const formatDateTime = (value: string | null | undefined): string => {
  if (!value) {
    return '—';
  }
  const date = dayjs(value);
  return date.isValid() ? date.format('DD MMM YYYY, HH:mm') : '—';
};

export const formatCoordinate = (value: number | null | undefined, digits = 4): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—';
  }
  return value.toFixed(digits);
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
};
