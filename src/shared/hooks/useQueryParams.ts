import { useCallback, useEffect, useState } from 'react';

export type QueryParamValue = string | number | string[] | null | undefined;

export type SetParamsOptions = {
  replace?: boolean;
};

export type QueryParamsApi = {
  searchParams: URLSearchParams;
  get: (key: string) => string | null;
  getInt: (key: string, fallback: number) => number;
  getList: (key: string) => string[];
  setParams: (patch: Record<string, QueryParamValue>, options?: SetParamsOptions) => void;
};

const currentSearch = (): string =>
  typeof window === 'undefined' ? '' : window.location.search;

export const useQueryParams = (): QueryParamsApi => {
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(
    () => new URLSearchParams(currentSearch()),
  );

  useEffect(() => {
    const handlePopState = () => setSearchParamsState(new URLSearchParams(currentSearch()));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setParams = useCallback(
    (patch: Record<string, QueryParamValue>, options: SetParamsOptions = {}) => {
      const next = new URLSearchParams(currentSearch());
      for (const [key, value] of Object.entries(patch)) {
        const isEmpty =
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          next.delete(key);
          continue;
        }
        next.set(key, Array.isArray(value) ? value.join(',') : String(value));
      }

      const queryString = next.toString();
      const url = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;
      if (options.replace) {
        window.history.replaceState(null, '', url);
      } else {
        window.history.pushState(null, '', url);
      }
      setSearchParamsState(next);
    },
    [],
  );

  const get = useCallback((key: string) => searchParams.get(key), [searchParams]);

  const getInt = useCallback(
    (key: string, fallback: number) => {
      const raw = searchParams.get(key);
      const parsed = raw === null ? Number.NaN : Number(raw);
      return Number.isFinite(parsed) ? parsed : fallback;
    },
    [searchParams],
  );

  const getList = useCallback(
    (key: string) => {
      const raw = searchParams.get(key);
      if (!raw) {
        return [];
      }
      return raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    },
    [searchParams],
  );

  return { searchParams, get, getInt, getList, setParams };
};
