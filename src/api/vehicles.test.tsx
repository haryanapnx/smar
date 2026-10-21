import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { mbtaFetch } from './client';
import type { JsonApiResponse } from './jsonapi.types';
import { fetchVehicles, fetchVehiclesTotal, useVehicles } from './vehicles';

vi.mock('./client', () => ({ mbtaFetch: vi.fn() }));

type MbtaFetchMock = (
  path: string,
  options?: { params?: Record<string, unknown> },
) => Promise<unknown>;

const mbtaFetchMock = vi.mocked(mbtaFetch) as unknown as Mock<MbtaFetchMock>;

const K_PAGE_SIZE = 12;
const K_SCOPE = { routeIds: [], tripIds: [] };

const vehicleResource = (id: string) => ({
  id,
  type: 'vehicle',
  attributes: {
    label: id,
    current_status: 'IN_TRANSIT_TO',
    latitude: 42.36,
    longitude: -71.06,
    current_stop_sequence: 4,
    updated_at: '2026-10-20T10:20:12-04:00',
    bearing: 90,
    speed: 7.5,
    occupancy_status: null,
    revenue: 'REVENUE',
    direction_id: 0,
  },
});

const pageResponse = (
  idPrefix: string,
  count: number,
  lastOffset: number,
  hasNext: boolean,
): JsonApiResponse<Record<string, unknown>> => ({
  data: Array.from({ length: count }, (_, index) => vehicleResource(`${idPrefix}${index}`)),
  links: {
    last: `https://api-v3.mbta.com/vehicles?page[limit]=${K_PAGE_SIZE}&page[offset]=${lastOffset}`,
    ...(hasNext
      ? {
          next: `https://api-v3.mbta.com/vehicles?page[limit]=${K_PAGE_SIZE}&page[offset]=${K_PAGE_SIZE}`,
        }
      : {}),
  },
});

const requestedOffset = (call: number): number =>
  Number(mbtaFetchMock.mock.calls[call]?.[1]?.params?.['page[offset]'] ?? 0);

/** Screens the MBTA live feed: 17 vehicles in service, i.e. a partially filled last page. */
const respondWithLiveFeed = () => {
  mbtaFetchMock.mockImplementation(async (_path, options) =>
    Number(options?.params?.['page[offset]'] ?? 0) === 0
      ? pageResponse('a', 12, 12, true)
      : pageResponse('b', 5, 12, false),
  );
};

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  mbtaFetchMock.mockReset();
});

describe('fetchVehicles', () => {
  it('leaves the total open while another page follows', async () => {
    mbtaFetchMock.mockResolvedValueOnce(pageResponse('a', 12, 12, true));

    const result = await fetchVehicles({ page: 1, pageSize: K_PAGE_SIZE, ...K_SCOPE });

    expect(result.items).toHaveLength(12);
    expect(result.lastOffset).toBe(12);
    expect(result.scope).toEqual(K_SCOPE);
    expect(result.total).toBeNull();
  });

  it('derives the exact total when the current page is the last one', async () => {
    mbtaFetchMock.mockResolvedValueOnce(pageResponse('b', 5, 12, false));

    const result = await fetchVehicles({ page: 2, pageSize: K_PAGE_SIZE, ...K_SCOPE });

    expect(result.total).toBe(17);
  });
});

describe('fetchVehiclesTotal', () => {
  it('counts the vehicles sitting on the last page', async () => {
    mbtaFetchMock.mockResolvedValueOnce(pageResponse('b', 5, 12, false));

    await expect(fetchVehiclesTotal(K_SCOPE, K_PAGE_SIZE, 12)).resolves.toBe(17);
    expect(requestedOffset(0)).toBe(12);
  });
});

describe('useVehicles', () => {
  it('reports the exact total instead of the offset + limit estimate', async () => {
    respondWithLiveFeed();

    const { result } = renderHook(() => useVehicles({ page: 1, pageSize: K_PAGE_SIZE, ...K_SCOPE }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data?.total).toBe(17));
    expect(result.current.isTotalLoading).toBe(false);
    expect(mbtaFetchMock).toHaveBeenCalledTimes(2);
  });

  it('reuses the cached total when moving between pages', async () => {
    respondWithLiveFeed();

    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => useVehicles({ page, pageSize: K_PAGE_SIZE, ...K_SCOPE }),
      { wrapper: createWrapper(), initialProps: { page: 1 } },
    );

    await waitFor(() => expect(result.current.data?.total).toBe(17));
    expect(mbtaFetchMock).toHaveBeenCalledTimes(2);

    rerender({ page: 2 });

    await waitFor(() => expect(result.current.data?.items[0]?.id).toBe('b0'));
    expect(result.current.data?.total).toBe(17);
    expect(mbtaFetchMock).toHaveBeenCalledTimes(3);
  });
});
