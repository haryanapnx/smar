import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { mbtaFetch } from './client';
import type { JsonApiResponse } from './jsonapi.types';
import { fetchRoutes, fetchRoutesTotal } from './routes';

vi.mock('./client', () => ({ mbtaFetch: vi.fn() }));

type MbtaFetchMock = (
  path: string,
  options?: { params?: Record<string, unknown> },
) => Promise<unknown>;

const mbtaFetchMock = vi.mocked(mbtaFetch) as unknown as Mock<MbtaFetchMock>;

const K_PAGE_SIZE = 20;

const routeResource = (id: string) => ({
  id,
  type: 'route',
  attributes: {
    short_name: id,
    long_name: `Route ${id}`,
    color: 'FFC72C',
    text_color: '000000',
    description: 'Local Bus',
    direction_names: ['Outbound', 'Inbound'],
  },
});

const pageResponse = (
  idPrefix: string,
  count: number,
  lastOffset: number,
  hasNext: boolean,
): JsonApiResponse<Record<string, unknown>> => ({
  data: Array.from({ length: count }, (_, index) => routeResource(`${idPrefix}${index}`)),
  links: {
    last: `https://api-v3.mbta.com/routes?page[limit]=${K_PAGE_SIZE}&page[offset]=${lastOffset}`,
    ...(hasNext
      ? {
          next: `https://api-v3.mbta.com/routes?page[limit]=${K_PAGE_SIZE}&page[offset]=${K_PAGE_SIZE}`,
        }
      : {}),
  },
});

beforeEach(() => {
  mbtaFetchMock.mockReset();
});

describe('fetchRoutes', () => {
  it('leaves the total open while another page follows', async () => {
    mbtaFetchMock.mockResolvedValueOnce(pageResponse('a', 20, 160, true));

    const result = await fetchRoutes({ page: 1, pageSize: K_PAGE_SIZE });

    expect(result.items).toHaveLength(20);
    expect(result.lastOffset).toBe(160);
    expect(result.hasNext).toBe(true);
    expect(result.total).toBeNull();
  });

  it('derives the exact total when the current page is the last one', async () => {
    mbtaFetchMock.mockResolvedValueOnce(pageResponse('b', 19, 160, false));

    const result = await fetchRoutes({ page: 9, pageSize: K_PAGE_SIZE });

    expect(result.total).toBe(179);
  });
});

describe('fetchRoutesTotal', () => {
  it('counts the routes on the last page instead of over-counting the limit', async () => {
    // 160 + 19 = 179, where offset + limit would have claimed 180.
    mbtaFetchMock.mockResolvedValueOnce(pageResponse('b', 19, 160, false));

    await expect(fetchRoutesTotal(K_PAGE_SIZE, 160)).resolves.toBe(179);
  });
});
