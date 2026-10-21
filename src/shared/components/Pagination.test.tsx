import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders page buttons and marks the active page', () => {
    render(<Pagination page={2} pageSize={10} total={50} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('calls onPageChange when a page is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageSize={10} total={50} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: '3' }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous on the first page and next on the last page', () => {
    const { rerender } = render(
      <Pagination page={1} pageSize={10} total={50} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Halaman sebelumnya' })).toBeDisabled();

    rerender(<Pagination page={5} pageSize={10} total={50} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Halaman berikutnya' })).toBeDisabled();
  });

  it('renders nothing when everything fits on one page', () => {
    const { container } = render(
      <Pagination page={1} pageSize={10} total={8} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
