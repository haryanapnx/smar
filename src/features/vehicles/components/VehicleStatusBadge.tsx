import { Badge } from '@/shared/components/Badge';
import { getVehicleStatus } from '@/shared/lib/statusLabels';

export type VehicleStatusBadgeProps = {
  status: string | null | undefined;
  stopLabel?: string | null | undefined;
  className?: string;
};

export const VehicleStatusBadge = ({
  status,
  className,
  stopLabel = '',
}: VehicleStatusBadgeProps) => {
  const { label, tone } = getVehicleStatus(status);
  const content = `${label} ${stopLabel}`;
  return (
    <Badge tone={tone} className={className} title={content}>
      {content}
    </Badge>
  );
};
