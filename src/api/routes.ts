import { useInfiniteQuery } from '@tanstack/react-query';
import { K_DROPDOWN_PAGE_SIZE } from '@/shared/constants';
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
};

export const fetchRoutes = async (query: RoutesQuery): Promise<RoutesPageResult> => {
  const { page, pageSize } = query;
  const offset = (page - 1) * pageSize;

  const response = await mbtaFetch<JsonApiResponse<RouteAttributes>>('/routes', {
    params: {
      'page[limit]': pageSize,
      'page[offset]': offset,
    },
  });

  const { items, total } = parseCollection(response);

  return {
    items: items.map(toRoute),
    total: total ?? offset + items.length,
    page,
    pageSize,
  };
};

export const useRoutes = () =>
  useInfiniteQuery({
    queryKey: routeKeys.list(),
    queryFn: ({ pageParam }) =>
      fetchRoutes({ page: pageParam, pageSize: K_DROPDOWN_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60_000,
  });

export const routeOptionLabel = (route: Route): string =>
  [route.shortName, route.longName].filter(Boolean).join(' · ') || route.id;
