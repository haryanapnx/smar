import type {
  JsonApiCollection,
  JsonApiLinks,
  JsonApiResource,
  JsonApiResponse,
} from './types';
import { resourceKey } from './types';

const PAGE_OFFSET = 'page[offset]';
const PAGE_LIMIT = 'page[limit]';
const FALLBACK_ORIGIN = 'https://api-v3.mbta.com';

export const deriveTotal = (links?: JsonApiLinks, fallbackLimit?: number): number | null => {
  if (!links?.last) {
    return null;
  }
  try {
    const url = new URL(links.last, FALLBACK_ORIGIN);
    const offset = Number(url.searchParams.get(PAGE_OFFSET));
    const limit = Number(url.searchParams.get(PAGE_LIMIT) ?? fallbackLimit);
    if (!Number.isFinite(offset) || !Number.isFinite(limit) || limit <= 0) {
      return null;
    }
    return offset + limit;
  } catch {
    return null;
  }
};

export const parseCollection = <TAttributes>(
  response: JsonApiResponse<TAttributes>,
): JsonApiCollection<TAttributes> => {
  const data = response.data;
  const items = Array.isArray(data) ? data : data ? [data] : [];
  return {
    items,
    included: response.included ?? [],
    total: deriveTotal(response.links),
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
