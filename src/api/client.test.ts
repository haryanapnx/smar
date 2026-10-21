import { afterEach, describe, expect, it, vi } from 'vitest';
import { MbtaApiError, buildSearchParams, buildUrl, messageForStatus, mbtaFetch } from './client';

const responseStub = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as Response;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildSearchParams', () => {
  it('joins arrays with commas and skips empty values', () => {
    const params = buildSearchParams({
      'page[limit]': 10,
      'filter[route]': ['91', '64'],
      'filter[trip]': [],
      include: undefined,
    });

    expect(params.get('page[limit]')).toBe('10');
    expect(params.get('filter[route]')).toBe('91,64');
    expect(params.has('filter[trip]')).toBe(false);
    expect(params.has('include')).toBe(false);
  });
});

describe('buildUrl', () => {
  it('uses the default base URL when no override is set', () => {
    expect(buildUrl('/routes')).toBe('https://api-v3.mbta.com/routes');
  });

  it('appends an encoded query string', () => {
    const url = buildUrl('/vehicles', { 'page[limit]': 5 });

    expect(url).toContain('/vehicles?');
    expect(url).toContain('page%5Blimit%5D=5');
  });
});

describe('messageForStatus', () => {
  it('maps statuses to readable messages', () => {
    expect(messageForStatus(400)).toMatch(/rejected/i);
    expect(messageForStatus(403)).toMatch(/api key/i);
    expect(messageForStatus(404)).toMatch(/not be found/i);
    expect(messageForStatus(429)).toMatch(/too many requests/i);
    expect(messageForStatus(503)).toMatch(/trouble/i);
    expect(messageForStatus(418)).toMatch(/HTTP 418/);
  });
});

describe('mbtaFetch', () => {
  it('parses JSON on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(responseStub({ data: [] }));

    await expect(mbtaFetch<{ data: unknown[] }>('/vehicles')).resolves.toEqual({ data: [] });
  });

  it('sends the X-API-Key header when a key is provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(responseStub({}));

    await mbtaFetch('/vehicles', { apiKey: 'secret' });

    expect(fetchSpy.mock.calls[0][1]?.headers).toEqual({ 'X-API-Key': 'secret' });
  });

  it('throws a typed error for non-2xx responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(responseStub('nope', 429));

    await expect(mbtaFetch('/vehicles')).rejects.toMatchObject({
      name: 'MbtaApiError',
      status: 429,
      message: expect.stringMatching(/too many requests/i),
    });
  });

  it('wraps network failures in a friendly error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const error = await mbtaFetch('/vehicles').catch((value: unknown) => value);

    expect(error).toBeInstanceOf(MbtaApiError);
    expect((error as MbtaApiError).status).toBeNull();
    expect((error as MbtaApiError).message).toMatch(/could not reach/i);
  });

  it('rethrows abort errors untouched', async () => {
    const abortError = new DOMException('aborted', 'AbortError');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(abortError);

    await expect(mbtaFetch('/vehicles')).rejects.toBe(abortError);
  });
});
