import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { K_DROPDOWN_PAGE_SIZE } from '@/shared/constants';
import { mbtaFetch } from './client';
import {
  firstRelationshipId,
  indexIncluded,
  parseCollection,
  relationshipIds,
} from './jsonapi';
import type { JsonApiResource, JsonApiResponse } from './jsonapi.types';
import { resourceKey } from './jsonapi.types';
import type { Trip, TripStops, TripsPageResult, TripsQuery, VehicleStop } from './types';

type TripAttributes = {
  headsign: string;
  name: string;
};

type StopAttributes = {
  name: string | null;
};

const toTrip = (resource: JsonApiResource<TripAttributes>): Trip => ({
  id: resource.id,
  headsign: resource.attributes.headsign ?? '',
  name: resource.attributes.name ?? '',
  routeId: firstRelationshipId(resource, 'route'),
});

export const tripKeys = {
  all: ['trips'] as const,
  list: (routeIds: string[]) => [...tripKeys.all, 'list', routeIds] as const,
  stops: (tripId: string) => [...tripKeys.all, 'stops', tripId] as const,
};

export const fetchTrips = async (query: TripsQuery): Promise<TripsPageResult> => {
  const { page, pageSize, routeIds } = query;
  const offset = (page - 1) * pageSize;

  const response = await mbtaFetch<JsonApiResponse<TripAttributes>>('/trips', {
    params: {
      'page[limit]': pageSize,
      'page[offset]': offset,
      'filter[route]': routeIds,
    },
  });

  const { items, total } = parseCollection(response);

  return {
    items: items.map(toTrip),
    total: total ?? offset + items.length,
    page,
    pageSize,
  };
};

export const fetchTripStops = async (tripId: string): Promise<TripStops> => {
  const response = await mbtaFetch<JsonApiResponse<TripAttributes>>(
    `/trips/${encodeURIComponent(tripId)}`,
    { params: { include: 'stops' } },
  );

  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  const stopIds = data ? relationshipIds(data, 'stops') : [];
  const includedIndex = indexIncluded(response.included ?? []);

  const stops: VehicleStop[] = stopIds.map((id) => ({
    id,
    name:
      (includedIndex.get(resourceKey('stop', id))?.attributes as StopAttributes | undefined)
        ?.name ?? '',
  }));

  return { tripId, stops, total: stops.length };
};

/**
 * `/trips` unfiltered is huge (the request times out), so trips are always scoped to the
 * selected routes. Disabled while no route is selected.
 */
export const useTrips = (routeIds: string[]) => {
  const scope = [...routeIds].sort();

  return useInfiniteQuery({
    queryKey: tripKeys.list(scope),
    queryFn: ({ pageParam }) =>
      fetchTrips({ page: pageParam, pageSize: K_DROPDOWN_PAGE_SIZE, routeIds: scope }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total ? lastPage.page + 1 : undefined,
    enabled: scope.length > 0,
    staleTime: 5 * 60_000,
  });
};

export const useTripStops = (tripId: string | null | undefined) =>
  useQuery({
    queryKey: tripKeys.stops(tripId ?? ''),
    queryFn: () => fetchTripStops(tripId as string),
    enabled: Boolean(tripId),
    staleTime: 5 * 60_000,
  });

export const tripOptionLabel = (trip: Trip): string => trip.headsign || trip.name || trip.id;
