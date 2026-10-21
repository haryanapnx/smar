import { env } from '@/shared/config/env';
import { K_PAGE_LIMIT, K_PAGE_OFFSET } from '@/shared/constants';
import type {
  JsonApiCollection,
  JsonApiLinks,
  JsonApiResource,
  JsonApiResponse,
} from './jsonapi.types';
import { resourceKey } from './jsonapi.types';

const readPageParam = (url: string | undefined, key: string): number | null => {
  if (!url) {
    return null;
  }
  try {
    const raw = new URL(url, env.mbtaApiBaseUrl).searchParams.get(key);
    if (raw === null || raw === '') {
      return null;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

export const deriveTotal = (links?: JsonApiLinks, fallbackLimit?: number): number | null => {
  const offset = readPageParam(links?.last, K_PAGE_OFFSET);
  if (offset === null) {
    return null;
  }
  const limit = readPageParam(links?.last, K_PAGE_LIMIT) ?? fallbackLimit;
  if (limit === undefined || !Number.isFinite(limit) || limit <= 0) {
    return null;
  }
  return offset + limit;
};

export const readLastOffset = (links?: JsonApiLinks): number | null =>
  readPageParam(links?.last, K_PAGE_OFFSET);

export const hasNextPage = (links?: JsonApiLinks): boolean => Boolean(links?.next);

export const parseCollection = <TAttributes>(
  response: JsonApiResponse<TAttributes>,
): JsonApiCollection<TAttributes> => {
  const data = response.data;
  const items = Array.isArray(data) ? data : data ? [data] : [];
  return {
    items,
    included: response.included ?? [],
    total: deriveTotal(response.links),
    lastOffset: readLastOffset(response.links),
    hasNext: hasNextPage(response.links),
  };
};

export const indexIncluded = (
  included: JsonApiResource[] = [],
): Map<string, JsonApiResource> => {
  const index = new Map<string, JsonApiResource>();
  for (const resource of included) {
    index.set(resourceKey(resource.type, resource.id), resource);
  }
  return index;
};

export const firstRelationshipId = (
  resource: JsonApiResource,
  name: string,
): string | null => {
  const relationship = resource.relationships?.[name];
  if (!relationship || !('data' in relationship) || relationship.data == null) {
    return null;
  }
  const data = relationship.data;
  if (Array.isArray(data)) {
    return data[0]?.id ?? null;
  }
  return data.id;
};

export const relationshipIds = (resource: JsonApiResource, name: string): string[] => {
  const relationship = resource.relationships?.[name];
  if (!relationship || !('data' in relationship) || relationship.data == null) {
    return [];
  }
  const data = relationship.data;
  return Array.isArray(data) ? data.map((item) => item.id) : [data.id];
};
