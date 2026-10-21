import type { VehiclesQuery } from '../types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (query: VehiclesQuery) => [...vehicleKeys.all, 'list', query] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
  tripStops: (tripId: string) => [...vehicleKeys.all, 'trip-stops', tripId] as const,
};
