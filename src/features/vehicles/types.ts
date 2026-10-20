export type VehicleRoute = {
  id: string;
  shortName: string;
  longName: string;
  color: string;
  textColor: string;
  description: string;
};

export type VehicleStop = {
  id: string;
  name: string;
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
  stop: VehicleStop | null;
};

export type VehiclesQuery = {
  page: number;
  pageSize: number;
  routeIds: string[];
  tripIds: string[];
};

export type VehiclesPageResult = {
  items: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
};
