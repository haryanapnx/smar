export const readListParam = (params: URLSearchParams, key: string): string[] => {
  const raw = params.get(key);
  return raw ? raw.split(',').filter(Boolean) : [];
};

export const readIntParam = (
  params: URLSearchParams,
  key: string,
  fallback: number,
): number => {
  const raw = params.get(key);
  const parsed = raw === null ? Number.NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export type QueryParamPatch = Record<string, string | null>;

export const patchSearchParams = (
  params: URLSearchParams,
  patch: QueryParamPatch,
): URLSearchParams => {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }
  return next;
};
