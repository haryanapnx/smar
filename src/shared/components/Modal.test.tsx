import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders an accessible dialog with its title and content', () => {
    render(
      <Modal open onClose={vi.fn()} title="Detail Kendaraan">
        <p>Isi modal</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Detail Kendaraan' })).toBeInTheDocument();
    expect(screen.getByText('Isi modal')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Detail">
        content
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Detail">
        content
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.parentElement as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing while closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Detail">
        content
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
