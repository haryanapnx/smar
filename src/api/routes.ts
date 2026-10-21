import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { K_DROPDOWN_PAGE_SIZE, K_TOTAL_STALE_MS } from '@/shared/constants';
import { mbtaFetch } from './client';
import { parseCollection } from './jsonapi';
import type { JsonApiResponse } from './jsonapi.types';
import type { Route, RoutesPageResult, RoutesQuery } from './types';

type RouteAttributes = {
  short_name: string;
  long_name: string;
  color: string;
  text_color: string;
  description: string;
  direction_names: string[];
};

const toRoute = (resource: { id: string; attributes: unknown }): Route => {
  const attributes = resource.attributes as RouteAttributes;
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

export const routeKeys = {
  all: ['routes'] as const,
  list: () => [...routeKeys.all, 'list'] as const,
  total: (pageSize: number, lastOffset: number) =>
    [...routeKeys.all, 'total', { pageSize, lastOffset }] as const,
};

type RoutesPage = {
  items: Route[];
  lastOffset: number | null;
  hasNext: boolean;
};

const fetchRoutesPage = async (pageSize: number, offset: number): Promise<RoutesPage> => {
  const response = await mbtaFetch<JsonApiResponse<RouteAttributes>>('/routes', {
    params: {
      'page[limit]': pageSize,
      'page[offset]': offset,
    },
  });

  const { items, lastOffset, hasNext } = parseCollection(response);

  return {
    items: items.map(toRoute),
    lastOffset,
    hasNext,
  };
};

export const fetchRoutes = async (query: RoutesQuery): Promise<RoutesPageResult> => {
  const { page, pageSize } = query;
  const offset = (page - 1) * pageSize;
  const result = await fetchRoutesPage(pageSize, offset);

  return {
    items: result.items,
    total: result.hasNext ? null : offset + result.items.length,
    lastOffset: result.lastOffset,
    hasNext: result.hasNext,
    page,
    pageSize,
  };
};

export const fetchRoutesTotal = async (pageSize: number, lastOffset: number): Promise<number> => {
  const lastPage = await fetchRoutesPage(pageSize, lastOffset);

  return lastOffset + lastPage.items.length;
};

export const useRoutes = () =>
  useInfiniteQuery({
    queryKey: routeKeys.list(),
    queryFn: ({ pageParam }) =>
      fetchRoutes({ page: pageParam, pageSize: K_DROPDOWN_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    staleTime: 5 * 60_000,
  });

export const useRoutesTotal = (firstPage: RoutesPageResult | undefined) => {
  const pageSize = firstPage?.pageSize ?? K_DROPDOWN_PAGE_SIZE;
  const lastOffset = firstPage?.lastOffset ?? 0;
  const needsTotal = firstPage?.total === null && firstPage.lastOffset !== null;

  return useQuery({
    queryKey: routeKeys.total(pageSize, lastOffset),
    queryFn: () => fetchRoutesTotal(pageSize, lastOffset),
    enabled: needsTotal,
    staleTime: K_TOTAL_STALE_MS,
  });
};

export const routeOptionLabel = (route: Route): string =>
  [route.shortName, route.longName].filter(Boolean).join(' · ') || route.id;
