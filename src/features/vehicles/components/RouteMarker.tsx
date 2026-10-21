import { cn } from '@/shared/lib/cn';
import type { VehicleRoute } from '../types';

export type RouteMarkerProps = {
  route: VehicleRoute | null;
};

export const RouteMarker = ({ route }: RouteMarkerProps) => {
  const hasColor = Boolean(route?.color);
  const style = hasColor
    ? { backgroundColor: `#${route?.color}`, color: `#${route?.textColor || 'FFFFFF'}` }
    : undefined;

  return (
    <span
      title={route?.longName || undefined}
      style={style}
      className={cn(
        'inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg px-1.5 text-xs font-bold shadow-sm',
        !hasColor && 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100',
      )}
    >
      <span className="max-w-16 truncate">{route?.shortName || route?.id || '—'}</span>
    </span>
  );
};
