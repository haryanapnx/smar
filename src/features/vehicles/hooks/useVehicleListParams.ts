import { useSearchParams } from 'react-router-dom';
import { patchSearchParams, readIntParam, readListParam } from '@/shared/lib/queryParams';
import { K_DEFAULT_PAGE_SIZE } from '../constants';

export type VehicleListParams = {
  page: number;
  pageSize: number;
  routeIds: string[];
  tripIds: string[];
  updateParams: (patch: Record<string, string | null>) => void;
};

export const useVehicleListParams = (): VehicleListParams => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    page: Math.max(1, readIntParam(searchParams, 'page', 1)),
    pageSize: readIntParam(searchParams, 'limit', K_DEFAULT_PAGE_SIZE),
    routeIds: readListParam(searchParams, 'routes'),
    tripIds: readListParam(searchParams, 'trips'),
    updateParams: (patch) => setSearchParams(patchSearchParams(searchParams, patch)),
  };
};
