import type { VehicleRoute } from '@/api/types';

export const routeLabel = (route: VehicleRoute | null): string =>
  route?.longName || route?.shortName || 'Tanpa rute';
