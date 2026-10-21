import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { vehicleFixture } from '@/test/fixtures/vehicles';
import { VehicleCard } from './VehicleCard';

describe('VehicleCard', () => {
  it('renders label, status, route, trip destination and coordinates', () => {
    render(<VehicleCard vehicle={vehicleFixture} />);

    expect(screen.getByText('2105')).toBeInTheDocument();
    expect(screen.getByText(/Berhenti di/)).toBeInTheDocument();
    expect(screen.getByText(/Sullivan Square Station/)).toBeInTheDocument();
    expect(screen.getByText('Sullivan')).toBeInTheDocument();
    expect(screen.getByText('42.3651, -71.1052')).toBeInTheDocument();
  });

  it('calls onSelect with the vehicle when the card is clicked', () => {
    const onSelect = vi.fn();
    render(<VehicleCard vehicle={vehicleFixture} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith(vehicleFixture);
  });
});
