import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/shared/lib/cn';

const K_LIGHT_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const K_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const K_ICE_LAT = 42.36;
const K_ICE_LNG = -71.06;
const K_MIN_LAT = -85;
const K_MAX_LAT = 85;
const K_MIN_LNG = -180;
const K_MAX_LNG = 180;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const markerIcon = L.divIcon({
  className: 'smar-vehicle-marker',
  html: `<span style="display:grid;place-items:center;width:34px;height:34px;border-radius:9999px;background:#1E468E;color:#fff;border:2px solid #fff;box-shadow:0 2px 10px rgba(15,23,42,.45)">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6 2h12a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2v1.5a1.5 1.5 0 0 1-3 0V16H8v1.5a1.5 1.5 0 0 1-3 0V16a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3Zm-.25 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm12.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>
  </span>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const Recenter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
};

export type VehicleMapProps = {
  latitude: number;
  longitude: number;
  label: string;
  className?: string;
};

export const VehicleMap = ({
  latitude,
  longitude,
  label,
  className = 'h-72',
}: VehicleMapProps) => {
  const center = useMemo<[number, number]>(() => {
    const lat = Number.isFinite(latitude) ? clamp(latitude, K_MIN_LAT, K_MAX_LAT) : K_ICE_LAT;
    const lng = Number.isFinite(longitude) ? clamp(longitude, K_MIN_LNG, K_MAX_LNG) : K_ICE_LNG;
    return [lat, lng];
  }, [latitude, longitude]);

  return (
    <div
      className={cn('w-full overflow-hidden rounded-xl border border-slate-200', className)}
    >
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full bg-slate-100 "
      >
        <TileLayer key="light" url={K_LIGHT_TILES} attribution={K_ATTRIBUTION} />
        <Marker position={center} icon={markerIcon} title={label} />
        <Recenter center={center} zoom={14} />
      </MapContainer>
    </div>
  );
};
