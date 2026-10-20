import { MultiSelectDropdown, type MultiSelectOption } from '@/shared/components/MultiSelectDropdown';

export type VehiclesFiltersProps = {
  routeOptions: MultiSelectOption[];
  tripOptions: MultiSelectOption[];
  selectedRoutes: string[];
  selectedTrips: string[];
  onRoutesChange: (values: string[]) => void;
  onTripsChange: (values: string[]) => void;
  onClear: () => void;
  onApply: () => void;
  isLoadingRoutes?: boolean;
  isLoadingTrips?: boolean;
};

export const VehiclesFilters = ({
  routeOptions,
  tripOptions,
  selectedRoutes,
  selectedTrips,
  onRoutesChange,
  onTripsChange,
  onClear,
  onApply,
  isLoadingRoutes = false,
  isLoadingTrips = false,
}: VehiclesFiltersProps) => (
  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_11rem]">
    <MultiSelectDropdown
      label="Rute"
      icon="route"
      options={routeOptions}
      selected={selectedRoutes}
      onChange={onRoutesChange}
      isLoading={isLoadingRoutes}
    />
    <MultiSelectDropdown
      label="Trip"
      icon="trip"
      options={tripOptions}
      selected={selectedTrips}
      onChange={onTripsChange}
      isLoading={isLoadingTrips}
    />
    <div className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={onClear}
        className="h-10 w-full rounded-lg border border-brand-200 px-3 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-900/30"
      >
        Hapus filter
      </button>
      <button
        type="button"
        onClick={onApply}
        className="h-10 w-full rounded-lg bg-brand-700 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-800"
      >
        Cari Kendaraan
      </button>
    </div>
  </div>
);
