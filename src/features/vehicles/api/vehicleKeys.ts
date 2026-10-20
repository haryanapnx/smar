import type { VehiclesQuery } from '../types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (query: VehiclesQuery) => [...vehicleKeys.all, 'list', query] as const,
};
