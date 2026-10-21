import { describe, expect, it } from 'vitest';
import { K_DOTS } from '@/shared/constants';
import { getPageItems } from './pagination';

describe('getPageItems', () => {
  it('lists every page when there are seven or fewer', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('adds an ellipsis after the first page', () => {
    expect(getPageItems(1, 11)).toEqual([1, 2, K_DOTS, 11]);
  });

  it('centres a window around the current page', () => {
    expect(getPageItems(5, 11)).toEqual([1, K_DOTS, 4, 5, 6, K_DOTS, 11]);
  });

  it('keeps the last pages together at the end', () => {
    expect(getPageItems(11, 11)).toEqual([1, K_DOTS, 10, 11]);
  });
});
