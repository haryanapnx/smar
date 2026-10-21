import {
  MultiSelectDropdown,
  type MultiSelectOption,
} from '@/shared/components/MultiSelectDropdown';

export type DropdownSource = {
  options: MultiSelectOption[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  disabled?: boolean;
  disabledHint?: string;
};

export type VehiclesFiltersProps = {
  routes: DropdownSource;
  trips: DropdownSource;
  selectedRoutes: string[];
  selectedTrips: string[];
  onRoutesChange: (values: string[]) => void;
  onTripsChange: (values: string[]) => void;
  onClear: () => void;
  onApply: () => void;
};

export const VehiclesFilters = ({
  routes,
  trips,
  selectedRoutes,
  selectedTrips,
  onRoutesChange,
  onTripsChange,
  onClear,
  onApply,
}: VehiclesFiltersProps) => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <MultiSelectDropdown
        label="Rute"
        icon="route"
        options={routes.options}
        selected={selectedRoutes}
        onChange={onRoutesChange}
        isLoading={routes.isLoading}
        isFetchingMore={routes.isFetchingMore}
        hasMore={routes.hasMore}
        onLoadMore={routes.onLoadMore}
        disabled={routes.disabled}
        disabledHint={routes.disabledHint}
      />

      <MultiSelectDropdown
        label="Trip"
        icon="trip"
        options={trips.options}
        selected={selectedTrips}
        onChange={onTripsChange}
        isLoading={trips.isLoading}
        isFetchingMore={trips.isFetchingMore}
        hasMore={trips.hasMore}
        onLoadMore={trips.onLoadMore}
        disabled={trips.disabled}
        disabledHint={trips.disabledHint}
      />
    </div>

    {/* Filter actions */}
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onClear}
        className="h-10 shrink-0 rounded-lg border border-brand-200
          bg-white px-4 text-sm font-medium text-brand-700
          transition hover:bg-brand-50
          dark:border-brand-700 dark:bg-slate-900
          dark:text-brand-100 dark:hover:bg-brand-900/30"
      >
        Reset
      </button>

      <button
        type="button"
        onClick={onApply}
        className="h-10 min-w-0 flex-1 rounded-lg bg-brand-700
          px-3 text-sm font-semibold text-white shadow-sm
          transition hover:bg-brand-800
          sm:flex-none sm:px-5"
      >
        Terapkan Filter
      </button>
    </div>
  </div>
);
