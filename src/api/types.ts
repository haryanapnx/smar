// ── Vehicles ────────────────────────────────────────────────────────────────
export type VehicleRoute = {
  id: string;
  shortName: string;
  longName: string;
  color: string;
  textColor: string;
  description: string;
  directionNames: string[];
};

export type VehicleStop = {
  id: string;
  name: string;
};

export type VehicleTrip = {
  id: string;
  headsign: string;
  name: string;
  directionId: number | null;
};

export type Vehicle = {
  id: string;
  label: string;
  status: string | null;
  latitude: number;
  longitude: number;
  currentStopSequence: number | null;
  updatedAt: string | null;
  route: VehicleRoute | null;
  trip: VehicleTrip | null;
  stop: VehicleStop | null;
};

export type VehicleDetail = Vehicle & {
  bearing: number | null;
  speed: number | null;
  occupancyStatus: string | null;
  revenue: string | null;
  directionId: number | null;
};

export type VehiclesQuery = {
  page: number;
  pageSize: number;
  routeIds: string[];
  tripIds: string[];
};

export type VehicleScope = {
  routeIds: string[];
  tripIds: string[];
};

export type VehiclesPageResult = {
  items: Vehicle[];
  /**
   * Exact total once the current page is the last one; `null` while the last page still has to
   * be counted, because the MBTA API reports no total for a collection.
   */
  total: number | null;
  /** Offset of the last page, read from `links.last`. */
  lastOffset: number | null;
  /** The filters this page was fetched with, so the total count stays in sync with the list. */
  scope: VehicleScope;
  page: number;
  pageSize: number;
};

// ── Routes ──────────────────────────────────────────────────────────────────
export type Route = {
  id: string;
  shortName: string;
  longName: string;
  color: string;
  textColor: string;
  description: string;
  directionNames: string[];
};

export type RoutesQuery = {
  page: number;
  pageSize: number;
};

export type RoutesPageResult = {
  items: Route[];
  total: number;
  page: number;
  pageSize: number;
};

// ── Trips ───────────────────────────────────────────────────────────────────
export type Trip = {
  id: string;
  headsign: string;
  name: string;
  routeId: string | null;
};

export type TripsQuery = {
  page: number;
  pageSize: number;
  routeIds: string[];
};

export type TripsPageResult = {
  items: Trip[];
  total: number;
  page: number;
  pageSize: number;
};

export type TripStops = {
  tripId: string;
  stops: VehicleStop[];
  total: number;
};
