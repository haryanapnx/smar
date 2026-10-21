import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { VehiclesQuery } from '../types';
import { vehicleKeys } from '../api/vehicleKeys';
import { fetchVehicles } from '../api/vehiclesApi';

export const useVehicles = (query: VehiclesQuery) =>
  useQuery({
    queryKey: vehicleKeys.list(query),
    queryFn: () => fetchVehicles(query),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
