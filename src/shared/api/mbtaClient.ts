export const MBTA_BASE_URL = 'https://api-v3.mbta.com';

const API_KEY_HEADER = 'X-API-Key';

const envApiKey = (import.meta.env.VITE_MBTA_API_KEY ?? '').trim();

export type QueryValue = string | number | boolean | Array<string | number> | null | undefined;

export class MbtaApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = 'MbtaApiError';
    this.status = status;
  }
}

export const buildSearchParams = (params: Record<string, QueryValue>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }
      searchParams.set(key, value.join(','));
      continue;
    }
    searchParams.set(key, String(value));
  }
  return searchParams;
};

export const buildUrl = (path: string, params: Record<string, QueryValue> = {}): string => {
  const query = buildSearchParams(params).toString();
  return `${MBTA_BASE_URL}${path}${query ? `?${query}` : ''}`;
};

export const messageForStatus = (status: number): string => {
  if (status === 400) {
    return 'The MBTA API rejected the request (HTTP 400).';
  }
  if (status === 401 || status === 403) {
    return 'The MBTA API key was rejected (HTTP 403). Please check the key in Settings.';
  }
  if (status === 404) {
    return 'The requested data could not be found (HTTP 404).';
  }
  if (status === 429) {
    return 'Too many requests. The MBTA API is rate-limiting this app. Add an API key in Settings and try again shortly.';
  }
  if (status >= 500) {
    return `The MBTA API is having trouble (HTTP ${status}). Please try again in a moment.`;
  }
  return `Request failed (HTTP ${status}).`;
};

export type MbtaFetchOptions = {
  params?: Record<string, QueryValue>;
  apiKey?: string;
  signal?: AbortSignal;
};

export const mbtaFetch = async <T>(
  path: string,
  options: MbtaFetchOptions = {},
): Promise<T> => {
  const { params = {}, apiKey, signal } = options;
  const url = buildUrl(path, params);
  const key = apiKey?.trim() || envApiKey;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: key ? { [API_KEY_HEADER]: key } : undefined,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new MbtaApiError(
      'Could not reach the MBTA API. Please check your network connection and try again.',
      null,
    );
  }

  if (!response.ok) {
    throw new MbtaApiError(messageForStatus(response.status), response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new MbtaApiError('Received an unexpected response from the MBTA API.', response.status);
  }
};
