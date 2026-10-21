import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Route } from '@/api/types';
import { useRouteSearch } from './useRouteSearch';

const routes: Route[] = [
  {
    id: 'Red',
    shortName: 'Red',
    longName: 'Red Line',
    color: 'DA291C',
    textColor: 'FFFFFF',
    description: 'Rapid Transit',
    directionNames: ['South', 'North'],
  },
  {
    id: '91',
    shortName: '91',
    longName: 'Sullivan Square Station - Central Square',
    color: 'FFC72C',
    textColor: '000000',
    description: 'Local Bus',
    directionNames: ['Outbound', 'Inbound'],
  },
];

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useRouteSearch', () => {
  it('matches on description', () => {
    const { result } = renderHook(() => useRouteSearch(routes));

    act(() => result.current.setQuery('rapid'));
    act(() => vi.advanceTimersByTime(250));

    expect(result.current.filtered.map((route) => route.id)).toEqual(['Red']);
  });

  it('debounces the filtering until the delay elapses', () => {
    const { result } = renderHook(() => useRouteSearch(routes));

    act(() => result.current.setQuery('91'));
    expect(result.current.filtered).toHaveLength(2);

    act(() => vi.advanceTimersByTime(249));
    expect(result.current.filtered).toHaveLength(2);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.filtered.map((route) => route.id)).toEqual(['91']);
  });

  it('flags isSearching immediately', () => {
    const { result } = renderHook(() => useRouteSearch(routes));

    act(() => result.current.setQuery('9'));

    expect(result.current.isSearching).toBe(true);
  });

  it('reset clears the query', () => {
    const { result } = renderHook(() => useRouteSearch(routes));

    act(() => result.current.setQuery('red'));
    act(() => vi.advanceTimersByTime(250));
    act(() => result.current.reset());
    act(() => vi.advanceTimersByTime(250));

    expect(result.current.query).toBe('');
    expect(result.current.filtered).toHaveLength(2);
  });
});
