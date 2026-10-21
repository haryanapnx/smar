import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { cn } from '@/shared/lib/cn';
import { getErrorMessage } from '@/shared/lib/format';
import type { Vehicle } from '@/api/types';
import { VehicleCard } from './VehicleCard';
import { VehicleCardSkeleton } from './VehicleCardSkeleton';

export type VehicleListProps = {
  vehicles: Vehicle[];
  isLoading: boolean;
  isFetching?: boolean;
  error: unknown;
  onRetry: () => void;
  onSelect?: (vehicle: Vehicle) => void;
  skeletonCount?: number;
};

export const VehicleList = ({
  vehicles,
  isLoading,
  isFetching = false,
  error,
  onRetry,
  onSelect,
  skeletonCount = 8,
}: VehicleListProps) => {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-busy="true"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <span className="sr-only">Memuat kendaraan…</span>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={getErrorMessage(error)} onRetry={onRetry} />;
  }

  if (!vehicles.length) {
    return (
      <EmptyState
        title="Tidak ada kendaraan"
        message="Coba ubah filter atau pindah ke halaman lain."
      />
    );
  }

  const isUpdating = isFetching && !isLoading;

  return (
    <div
      aria-busy={isUpdating}
      className={cn(
        'grid gap-3 transition-opacity sm:grid-cols-2 xl:grid-cols-4',
        isUpdating && 'opacity-60',
      )}
    >
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onSelect={onSelect} />
      ))}
    </div>
  );
};
