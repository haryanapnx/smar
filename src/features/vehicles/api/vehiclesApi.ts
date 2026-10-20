import { firstRelationshipId, indexIncluded, parseCollection } from '@/shared/api/jsonapi';
import { mbtaFetch } from '@/shared/api/mbtaClient';
import type { JsonApiResource, JsonApiResponse } from '@/shared/api/types';
import { resourceKey } from '@/shared/api/types';
import type {
  Vehicle,
  VehicleRoute,
  VehicleStop,
  VehiclesPageResult,
  VehiclesQuery,
} from '../types';

type VehicleAttributes = {
  label: string | null;
  current_status: string | null;
  latitude: number;
  longitude: number;
  current_stop_sequence: number | null;
  updated_at: string | null;
};

type RouteAttributes = {
  short_name: string;
  long_name: string;
  color: string;
  text_color: string;
  description: string;
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
    stop: toStop(stopId ? includedIndex.get(resourceKey('stop', stopId)) : undefined),
  };
};

export const fetchVehicles = async (query: VehiclesQuery): Promise<VehiclesPageResult> => {
  const { page, pageSize, routeIds, tripIds } = query;
  const offset = (page - 1) * pageSize;

  const response = await mbtaFetch<JsonApiResponse<VehicleAttributes>>('/vehicles', {
    params: {
      'page[limit]': pageSize,
      'page[offset]': offset,
      include: 'route,stop',
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
