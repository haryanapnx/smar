import type { JsonApiResponse } from '@/api/jsonapi.types';
import type { Vehicle } from '@/api/types';

export const vehicleFixture: Vehicle = {
  id: 'y2105',
  label: '2105',
  status: 'STOPPED_AT',
  latitude: 42.3651,
  longitude: -71.1052,
  currentStopSequence: 8,
  updatedAt: '2026-10-20T10:20:12-04:00',
  route: {
    id: '91',
    shortName: '91',
    longName: 'Sullivan Square Station - Central Square, Cambridge',
    color: 'FFC72C',
    textColor: '000000',
    description: 'Local Bus',
    directionNames: ['Outbound', 'Inbound'],
  },
  trip: {
    id: '78265338',
    headsign: 'Sullivan',
    name: '',
    directionId: 0,
  },
  stop: {
    id: '4144',
    name: 'Reedsdale Rd @ Central Ave',
  },
};

export const vehiclesJsonApiFixture: JsonApiResponse<Record<string, unknown>> = {
  data: [
    {
      id: 'y2105',
      type: 'vehicle',
      attributes: {
        label: '2105',
        current_status: 'STOPPED_AT',
        latitude: 42.3651,
        longitude: -71.1052,
        current_stop_sequence: 8,
        updated_at: '2026-10-20T10:20:12-04:00',
        bearing: 90,
        speed: null,
        occupancy_status: 'MANY_SEATS_AVAILABLE',
        revenue: 'REVENUE',
        direction_id: 0,
      },
      relationships: {
        route: { data: { id: '91', type: 'route' } },
        trip: { data: { id: '78265338', type: 'trip' } },
        stop: { data: { id: '4144', type: 'stop' } },
      },
    },
    {
      id: 'y1958',
      type: 'vehicle',
      attributes: {
        label: null,
        current_status: 'IN_TRANSIT_TO',
        latitude: 42.357356,
        longitude: -71.148428,
        current_stop_sequence: 2,
        updated_at: '2026-10-20T10:20:15-04:00',
        bearing: null,
        speed: 6.4,
        occupancy_status: null,
        revenue: 'REVENUE',
        direction_id: 1,
      },
      relationships: {
        route: { data: { id: '64', type: 'route' } },
      },
    },
  ],
  included: [
    {
      id: '91',
      type: 'route',
      attributes: {
        short_name: '91',
        long_name: 'Sullivan Square Station - Central Square, Cambridge',
        color: 'FFC72C',
        text_color: '000000',
        description: 'Local Bus',
        direction_names: ['Outbound', 'Inbound'],
      },
    },
    {
      id: '78265338',
      type: 'trip',
      attributes: { headsign: 'Sullivan', name: '', direction_id: 0 },
    },
    {
      id: '4144',
      type: 'stop',
      attributes: { name: 'Reedsdale Rd @ Central Ave' },
    },
  ],
  links: {
    last: 'https://api-v3.mbta.com/vehicles?page[limit]=2&page[offset]=138',
  },
};
