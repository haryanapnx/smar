import { useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { Route } from '@/api/types';

const K_SEARCH_DEBOUNCE_MS = 250;

const matches = (route: Route, term: string): boolean =>
  [route.shortName, route.longName, route.description, route.id].some((value) =>
    value.toLowerCase().includes(term),
  );

export type RouteSearch = {
  query: string;
  setQuery: (value: string) => void;
  reset: () => void;
  filtered: Route[];
  isSearching: boolean;
};

/** Client-side search over the routes already loaded by the infinite query. */
export const useRouteSearch = (routes: Route[]): RouteSearch => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, K_SEARCH_DEBOUNCE_MS);

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) {
      return routes;
    }
    return routes.filter((route) => matches(route, term));
  }, [routes, debouncedQuery]);

  return {
    query,
    setQuery,
    reset: () => setQuery(''),
    filtered,
    isSearching: query.trim().length > 0,
  };
};
