import { indexIncluded, relationshipIds } from '@/shared/api/jsonapi';
import { mbtaFetch } from '@/shared/api/mbtaClient';
import type { JsonApiResponse } from '@/shared/api/types';
import { resourceKey } from '@/shared/api/types';
import type { TripStops } from '../types';

type TripAttributes = {
  headsign: string;
};

type StopAttributes = {
  name: string | null;
};

export const fetchTripStops = async (tripId: string): Promise<TripStops> => {
  const response = await mbtaFetch<JsonApiResponse<TripAttributes>>(
    `/trips/${encodeURIComponent(tripId)}`,
    { params: { include: 'stops' } },
  );

  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  const stopIds = data ? relationshipIds(data, 'stops') : [];
  const includedIndex = indexIncluded(response.included ?? []);

  const stops = stopIds.map((id) => ({
    id,
    name: (includedIndex.get(resourceKey('stop', id))?.attributes as StopAttributes | undefined)?.name ?? '',
  }));

  return { tripId, stops, total: stops.length };
};
