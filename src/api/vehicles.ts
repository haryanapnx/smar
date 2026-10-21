import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { mbtaFetch } from './client';
import { firstRelationshipId, indexIncluded, parseCollection } from './jsonapi';
import type { JsonApiResource, JsonApiResponse } from './jsonapi.types';
import { resourceKey } from './jsonapi.types';
import type {
  Vehicle,
  VehicleDetail,
  VehicleRoute,
  VehicleStop,
  VehicleTrip,
  VehiclesPageResult,
  VehiclesQuery,
} from './types';

type VehicleAttributes = {
  label: string | null;
  current_status: string | null;
  latitude: number;
  longitude: number;
  current_stop_sequence: number | null;
  updated_at: string | null;
  bearing: number | null;
  speed: number | null;
  occupancy_status: string | null;
  revenue: string | null;
  direction_id: number | null;
};

type RouteAttributes = {
  short_name: string;
  long_name: string;
  color: string;
  text_color: string;
  description: string;
  direction_names: string[];
};

type TripAttributes = {
  headsign: string;
  name: string;
  direction_id: number | null;
};

type StopAttributes = {
  name: string | null;
};

const toRoute = (resource: JsonApiResource | undefined): VehicleRoute | null => {
  if (!resource) {
    return null;
  }
  const attributes = resource.attributes as unknown as RouteAttributes;
  return {
    id: resource.id,
    shortName: attributes.short_name ?? '',
    longName: attributes.long_name ?? '',
    color: attributes.color ?? '',
    textColor: attributes.text_color ?? '',
    description: attributes.description ?? '',
    directionNames: attributes.direction_names ?? [],
  };
};

const toTrip = (resource: JsonApiResource | undefined): VehicleTrip | null => {
  if (!resource) {
    return null;
  }
  const attributes = resource.attributes as unknown as TripAttributes;
  return {
    id: resource.id,
    headsign: attributes.headsign ?? '',
    name: attributes.name ?? '',
    directionId: attributes.direction_id ?? null,
  };
};

const toStop = (resource: JsonApiResource | undefined): VehicleStop | null => {
  if (!resource) {
    return null;
  }
  const attributes = resource.attributes as unknown as StopAttributes;
  return {
    id: resource.id,
    name: attributes.name ?? '',
  };
};

const toVehicle = (
  resource: JsonApiResource<VehicleAttributes>,
  includedIndex: Map<string, JsonApiResource>,
): Vehicle => {
  const attributes = resource.attributes;
  const routeId = firstRelationshipId(resource, 'route');
  const tripId = firstRelationshipId(resource, 'trip');
  const stopId = firstRelationshipId(resource, 'stop');

  return {
    id: resource.id,
    label: attributes.label || resource.id,
    status: attributes.current_status ?? null,
    latitude: attributes.latitude,
    longitude: attributes.longitude,
    currentStopSequence: attributes.current_stop_sequence ?? null,
    updatedAt: attributes.updated_at ?? null,
    route: toRoute(routeId ? includedIndex.get(resourceKey('route', routeId)) : undefined),
    trip: toTrip(tripId ? includedIndex.get(resourceKey('trip', tripId)) : undefined),
    stop: toStop(stopId ? includedIndex.get(resourceKey('stop', stopId)) : undefined),
  };
};

const toVehicleDetail = (
  resource: JsonApiResource<VehicleAttributes>,
  includedIndex: Map<string, JsonApiResource>,
): VehicleDetail => {
  const attributes = resource.attributes;

  return {
    ...toVehicle(resource, includedIndex),
    bearing: attributes.bearing ?? null,
    speed: attributes.speed ?? null,
    occupancyStatus: attributes.occupancy_status ?? null,
    revenue: attributes.revenue ?? null,
    directionId: attributes.direction_id ?? null,
  };
};

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (query: VehiclesQuery) => [...vehicleKeys.all, 'list', query] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
};

export const fetchVehicles = async (query: VehiclesQuery): Promise<VehiclesPageResult> => {
  const { page, pageSize, routeIds, tripIds } = query;
  const offset = (page - 1) * pageSize;

  const response = await mbtaFetch<JsonApiResponse<VehicleAttributes>>('/vehicles', {
    params: {
      'page[limit]': pageSize,
      'page[offset]': offset,
      include: 'route,stop,trip',
      'filter[route]': routeIds,
      'filter[trip]': tripIds,
    },
  });

  const { items, included, total } = parseCollection(response);
  const includedIndex = indexIncluded(included);

  return {
    items: items.map((resource) => toVehicle(resource, includedIndex)),
    total: total ?? offset + items.length,
    page,
    pageSize,
  };
};

export const fetchVehicleDetail = async (id: string): Promise<VehicleDetail> => {
  const response = await mbtaFetch<JsonApiResponse<VehicleAttributes>>(
    `/vehicles/${encodeURIComponent(id)}`,
    { params: { include: 'route,trip,stop' } },
  );

  const { items, included } = parseCollection(response);
  const resource = items[0];
  if (!resource) {
    throw new Error('Detail kendaraan tidak ditemukan.');
  }

  return toVehicleDetail(resource, indexIncluded(included));
};

export const useVehicles = (query: VehiclesQuery) =>
  useQuery({
    queryKey: vehicleKeys.list(query),
    queryFn: () => fetchVehicles(query),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

export const useVehicleDetail = (id: string | null) =>
  useQuery({
    queryKey: vehicleKeys.detail(id ?? ''),
    queryFn: () => fetchVehicleDetail(id as string),
    enabled: Boolean(id),
    staleTime: 0,
  });
