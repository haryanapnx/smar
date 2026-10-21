import { useQuery } from '@tanstack/react-query';
import { fetchTripStops } from '../api/tripStopsApi';
import { vehicleKeys } from '../api/vehicleKeys';

export const useTripStops = (tripId: string | null | undefined) =>
  useQuery({
    queryKey: vehicleKeys.tripStops(tripId ?? ''),
    queryFn: () => fetchTripStops(tripId as string),
    enabled: Boolean(tripId),
    staleTime: 5 * 60_000,
  });
