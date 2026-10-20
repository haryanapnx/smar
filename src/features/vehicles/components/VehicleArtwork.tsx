import busImage from '@/shared/assets/tije.webp';
import { cn } from '@/shared/lib/cn';

export type VehicleArtworkProps = {
  className?: string;
};

export const VehicleArtwork = ({ className }: VehicleArtworkProps) => (
  <div
    className={cn(
      'h-32 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/[0.03] dark:bg-slate-800 dark:ring-white/[0.06]',
      className,
    )}
  >
    <img
      src={busImage}
      alt="Bus Transjakarta"
      loading="lazy"
      className="h-full w-full object-cover dark:brightness-[.82] dark:contrast-[.92]"
    />
  </div>
);
