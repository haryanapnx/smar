import { useEffect, useState } from 'react';

export type VehicleFilterDraft = {
  draftRoutes: string[];
  draftTrips: string[];
  setDraftTrips: (values: string[]) => void;
  changeRoutes: (values: string[]) => void;
  reset: () => void;
};

type UseVehicleFilterDraftOptions = {
  routeIds: string[];
  tripIds: string[];
};

/**
 * Holds the filter selection before it is applied. Kept separate from the URL so the user
 * can change several filters and submit them together with "Cari Kendaraan".
 */
export const useVehicleFilterDraft = ({
  routeIds,
  tripIds,
}: UseVehicleFilterDraftOptions): VehicleFilterDraft => {
  const [draftRoutes, setDraftRoutes] = useState<string[]>(routeIds);
  const [draftTrips, setDraftTrips] = useState<string[]>(tripIds);

  const routeKey = routeIds.join(',');
  const tripKey = tripIds.join(',');

  useEffect(() => setDraftRoutes(routeKey ? routeKey.split(',') : []), [routeKey]);
  useEffect(() => setDraftTrips(tripKey ? tripKey.split(',') : []), [tripKey]);

  const changeRoutes = (values: string[]) => {
    setDraftRoutes(values);
    // Trips are scoped to routes, so a route change invalidates the chosen trips.
    setDraftTrips([]);
  };

  const reset = () => {
    setDraftRoutes([]);
    setDraftTrips([]);
  };

  return { draftRoutes, draftTrips, setDraftTrips, changeRoutes, reset };
};
