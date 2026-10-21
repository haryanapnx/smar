import { cn } from '@/shared/lib/cn';

/** Minimal route shape needed to render the coloured marker. */
export type RouteMarkerData = {
  id: string;
  shortName: string;
  longName: string;
  color: string;
  textColor: string;
};

export type RouteMarkerProps = {
  route: RouteMarkerData | null;
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
        'inline-flex h-12 min-w-12 shrink-0 items-center justify-center rounded-lg px-1.5 text-xs font-bold shadow-sm',
        !hasColor && 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100',
      )}
    >
      <span className="max-w-32 truncate">{route?.shortName || route?.id || '—'}</span>
    </span>
  );
};
