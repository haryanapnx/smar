import type { ImgHTMLAttributes } from 'react';
import busImage from '@/shared/assets/tije.webp';
import { cn } from '@/shared/lib/cn';

export type VehicleArtworkProps = {
  className?: string;
  priority?: boolean;
};

type ArtworkImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: 'high' | 'low' | 'auto';
};

const imageProps = (priority: boolean): ArtworkImageProps => ({
  src: busImage,
  alt: 'Bus',
  loading: priority ? 'eager' : 'lazy',
  fetchpriority: priority ? 'high' : 'auto',
  className: 'h-full w-full object-cover dark:brightness-[.82] dark:contrast-[.92]',
});

export const VehicleArtwork = ({ className, priority = false }: VehicleArtworkProps) => (
  <div
    className={cn(
      'h-32 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/[0.03] dark:bg-slate-800 dark:ring-white/[0.06]',
      className,
    )}
  >
    <img {...imageProps(priority)} />
  </div>
);
