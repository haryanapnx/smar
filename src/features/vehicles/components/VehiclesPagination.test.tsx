import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VehiclesPagination, type VehiclesPaginationProps } from './VehiclesPagination';

const renderPagination = (props: Partial<VehiclesPaginationProps> = {}) => {
  const { container } = render(
    <VehiclesPagination
      page={1}
      pageSize={12}
      total={140}
      pageSizeOptions={[12, 24, 48]}
      onPageChange={vi.fn()}
      onPageSizeChange={vi.fn()}
      {...props}
    />,
  );

  return container;
};

describe('VehiclesPagination', () => {
  it('renders the range of the current page', () => {
    expect(renderPagination({ page: 2 }).textContent).toContain('13-24 dari 140');
  });

  it('never prints a range that ends before it starts', () => {
    // The live feed shrank below the page in the URL: show a clamped range, not "25-24".
    expect(renderPagination({ page: 3, total: 24 }).textContent).toContain('24-24 dari 24');
  });

  it('hides the range while the first page is loading', () => {
    expect(renderPagination({ isLoading: true }).textContent).not.toContain('Menampilkan');
  });
});
