import { useQuery } from '@tanstack/react-query';
import { vehicleKeys } from '../api/vehicleKeys';
import { fetchVehicleDetail } from '../api/vehiclesApi';

export const useVehicleDetail = (id: string | null) =>
  useQuery({
    queryKey: vehicleKeys.detail(id ?? ''),
    queryFn: () => fetchVehicleDetail(id as string),
    enabled: Boolean(id),
    staleTime: 0,
  });
