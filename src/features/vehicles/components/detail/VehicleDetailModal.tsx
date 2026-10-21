import { ErrorState } from '@/shared/components/ErrorState';
import { Modal } from '@/shared/components/Modal';
import { getErrorMessage } from '@/shared/lib/format';
import { useVehicleDetail } from '@/api/vehicles';
import { VehicleDetailContent } from './VehicleDetailContent';
import { VehicleDetailSkeleton } from './VehicleDetailSkeleton';

export type VehicleDetailModalProps = {
  vehicleId: string | null;
  onClose: () => void;
};

export const VehicleDetailModal = ({ vehicleId, onClose }: VehicleDetailModalProps) => {
  const { isLoading, error, data, refetch } = useVehicleDetail(vehicleId);

  return (
    <Modal
      open={Boolean(vehicleId)}
      onClose={onClose}
      title="Detail Kendaraan"
      size="xl"
      className="lg:h-[calc(100vh-10rem)]"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Tutup
        </button>
      }
    >
      {isLoading ? <VehicleDetailSkeleton /> : null}
      {error ? <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} /> : null}
      {data ? <VehicleDetailContent detail={data} /> : null}
    </Modal>
  );
};
