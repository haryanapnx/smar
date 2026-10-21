import { K_DOTS } from '@/shared/constants';

export type PageItem = number | typeof K_DOTS;

export const getPageItems = (current: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) {
    items.push(K_DOTS);
  }
  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }
  if (end < totalPages - 1) {
    items.push(K_DOTS);
  }
  items.push(totalPages);
  return items;
};
