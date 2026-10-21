import { describe, expect, it } from 'vitest';
import { patchSearchParams, readIntParam, readListParam } from './queryParams';

describe('readListParam', () => {
  it('splits comma separated values and drops empties', () => {
    const params = new URLSearchParams('routes=91,64&trips=');

    expect(readListParam(params, 'routes')).toEqual(['91', '64']);
    expect(readListParam(params, 'trips')).toEqual([]);
    expect(readListParam(params, 'missing')).toEqual([]);
  });
});

describe('readIntParam', () => {
  it('parses numbers and falls back on invalid values', () => {
    const params = new URLSearchParams('page=3&limit=abc');

    expect(readIntParam(params, 'page', 1)).toBe(3);
    expect(readIntParam(params, 'limit', 12)).toBe(12);
    expect(readIntParam(params, 'missing', 1)).toBe(1);
  });
});

describe('patchSearchParams', () => {
  it('sets, replaces and deletes params without mutating the source', () => {
    const params = new URLSearchParams('page=2&routes=91');

    const next = patchSearchParams(params, {
      page: '1',
      routes: null,
      limit: '24',
    });

    expect(next.get('page')).toBe('1');
    expect(next.has('routes')).toBe(false);
    expect(next.get('limit')).toBe('24');
    expect(params.get('page')).toBe('2');
    expect(params.get('routes')).toBe('91');
  });
});
