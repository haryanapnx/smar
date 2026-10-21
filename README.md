# SMAR — Sistem Manajemen Armada

A fleet management dashboard for **Transjakarta**, built as a React + TypeScript single-page
app on top of the public **MBTA v3 REST API**. It lists vehicles as cards, paginates them,
filters by route and trip, and opens a detail popup with the vehicle's position on a Leaflet map.

## Features

- **Fleet list** — responsive card grid showing vehicle label, current status, route (with the
  route's real colour), trip destination, coordinates, and last update time.
- **Pagination** — range text, page-size selector, page count, and page buttons. `page` and
  `limit` live in the URL.
- **Route & trip filters** — multi-select dropdowns with search and infinite scroll, applied
  when you press **Cari Kendaraan**; selections are kept in the URL.
- **Vehicle detail popup** — full attributes, a Leaflet map of the position, and a tab with the
  ordered trip stop list.
- **Routes page** — searchable list of all routes (desktop table, mobile cards) with a link that
  opens the fleet already filtered to that route.
- **Mobile navigation** — hamburger menu with a full-screen blurred backdrop, closing on navigation.
- **Back to top** — floating button that appears after scrolling one viewport height.
- **Light / dark theme**, loading skeletons, retryable error states, and route-level code
  splitting.

## Tech stack

| Concern | Choice |
| --- | --- |
| Build tool | Vite 5 |
| UI | React 18 (function components + hooks) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 |
| Data fetching | TanStack React Query v5 |
| Map | Leaflet + react-leaflet (lazy-loaded) |
| Dates | dayjs |
| Routing | React Router (`createBrowserRouter`) |
| Tests | Vitest + React Testing Library |

## Getting started

### Prerequisites

- **Node.js ≥ 20** (see `.nvmrc`, pinned to 22). With nvm: `nvm use`.
- npm.

### Install

```bash
npm install
```

> If your shell exports `NODE_ENV=production`, npm skips devDependencies. In that case run
> `NODE_ENV=development npm install --include=dev`.

### Environment

Copy `.env.example` to `.env.local` (git-ignored) and fill in what you need:

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_MBTA_API_KEY` | yes | Sent as `X-API-Key` on every request. If it is left empty the request goes out without the header and the API's own default limits apply. |
| `VITE_MBTA_API_BASE_URL` | no | Overrides the API base URL (defaults to `https://api-v3.mbta.com`). |

> `VITE_*` values are baked into the client bundle at build time. Do not put real secrets there.
> When running with Docker, pass them as build args (see *Run with Docker*).

### Run

```bash
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run preview   # serve the production build
```

### Run with Docker

The production image is a multi-stage build: Node 22 compiles the app, then nginx serves the
static `dist` with SPA fallback, long-lived caching for hashed assets, and gzip.

```bash
# Production build served by nginx → http://localhost:8080
npm run docker:build     # build the image only (docker compose build)
npm run docker:up        # build + start (docker compose up -d --build)
npm run docker:down      # stop (docker compose down)
npm run docker:logs      # follow the web container logs

# Dev server with HMR → http://localhost:5173
npm run docker:dev       # docker compose --profile dev up dev
npm run docker:dev:down  # stop the dev container
```

`VITE_*` values are inlined at build time, so `docker-compose.yml` passes them as **build args**.
To use an API key, set it in your shell (or in a `.env` file next to the compose file) and
rebuild:

```bash
VITE_MBTA_API_KEY=your-key npm run docker:up
```

Files involved: `Dockerfile` (production), `Dockerfile.dev` (development), `docker-compose.yml`,
`nginx.conf` (SPA fallback, caching, gzip), and `.dockerignore`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (forces `NODE_ENV=development`). |
| `npm run build` | `tsc -b` then `vite build`. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | ESLint. |
| `npm run format` | Prettier write. |
| `npm run test` | Vitest, single run. |
| `npm run test:watch` | Vitest watch mode. |
| `npm run test:coverage` | Vitest with coverage. |
| `npm run docker:build` | Build the production image. |
| `npm run docker:up` | Build + start the production container on :8080. |
| `npm run docker:down` | Stop the containers. |
| `npm run docker:logs` | Follow the web container logs. |
| `npm run docker:dev` | Start the dev container with HMR on :5173. |
| `npm run docker:dev:down` | Stop the dev container. |

## Architecture

Dependencies point one way:

```
app  →  pages  →  features  →  api  →  shared
```

- **features never import another feature.** Anything shared by two features moves down to
  `api` (MBTA data) or `shared` (generic UI, config, utils).
- **Query hooks live with their fetcher** in `api/*`; a feature's `hooks/` folder holds UI-only
  logic (URL state, filter drafts).

```
src/
  main.tsx                 # entry: providers + router
  app/
    router.tsx             # lazy routes: /vehicles, /routes, 404
    providers.tsx          # ErrorBoundary → Theme → QueryClient
    queryClient.ts
    layouts/AppLayout.tsx  # header + main + footer
    components/            # AppHeader, AppNav, ThemeToggle, AppFooter, PageFallback
  pages/                   # thin route components
    VehiclesPage.tsx
    RoutesPage.tsx
    NotFoundPage.tsx
  api/                     # data layer: transport, parsing, resources + query hooks
    client.ts              # fetch wrapper, X-API-Key, typed errors
    jsonapi.ts             # JSON:API parsing: envelope split, last-page offset, has-next
    jsonapi.types.ts
    types.ts               # domain types
    vehicles.ts            # mappers, fetchVehicles/fetchVehicleDetail, useVehicles/useVehicleDetail
    routes.ts              # fetchRoutes, useRoutes (infinite), routeOptionLabel
    trips.ts               # fetchTrips/fetchTripStops, useTrips/useTripStops, tripOptionLabel
  features/
    vehicles/
      VehicleListPage.tsx
      constants.ts
      hooks/               # useVehicleListParams, useVehicleFilterDraft
      lib/                 # routeLabel, detailText
      components/          # VehicleCard, VehicleList, VehiclesFilters, VehiclesPagination, …
      components/detail/   # VehicleDetailModal, VehicleMap, stop list, summary
    routes/
      RouteListPage.tsx
      hooks/useRouteSearch.ts
      components/          # RouteList (table/cards), RoutesToolbar, skeleton
  shared/
    components/            # Icon, RouteMarker, Modal, Pagination, MultiSelectDropdown, …
    config/env.ts          # build-time env access + defaults
    constants/index.ts
    hooks/                 # useTheme, useIntersectionObserver, useDebounce
    lib/                   # cn, format, statusLabels, pagination, queryParams
    theme/                 # ThemeProvider + context
    assets/tije.webp
  styles/index.css
  test/                    # setup, render utils, fixtures
```

### How data is fetched

- All HTTP goes through `src/api/client.ts` (never `fetch` in components). Non-2xx responses are
  mapped to readable messages, including 429 (rate limit) and 403 (bad key).
- Responses are JSON:API. `src/api/jsonapi.ts` splits `data`/`included` and reads the offset of the
  last page from `links.last`. **MBTA never sends a total**, so the exact count comes from reading
  that last page (see Pagination below).
- Vehicle cards come from `GET /vehicles` with `include=route,stop,trip`, so the route colour,
  stop name and trip destination arrive in a single request.
- React Query handles caching, deduplication and loading states. Vehicle data is live, so its
  `staleTime` is `0`; route/trip option lists are cached for 5 minutes.
- The trip filter is **scoped to the selected routes** because `/trips` unfiltered is enormous
  (the request times out). The dropdown stays disabled until at least one route is chosen.
- Route search is client-side over the pages already loaded, debounced by 250 ms, and stops the
  infinite-scroll sentinel while searching so typing cannot trigger a request cascade.

### Pagination

Pagination is offset-based, matching the MBTA API:

1. `fetchVehicles({ page, pageSize })` sends `page[limit]` and `page[offset]`.
2. The API reports no total, and `links.last` only carries the last page's offset. Counting the
   vehicles on that page gives the exact number (`offset + vehicles on it`), instead of the
   `offset + limit` estimate that over-counts a partially filled last page. When the response has
   no `next` link, the count is already known and no extra request is made.
3. That count is cached for a minute and keyed by filters + page size + last offset, so moving
   between pages reuses it; the footer shows a skeleton while the exact number is still resolving.
4. `page` and `limit` are stored in the URL (`?page=&limit=`), so refreshes and back/forward keep
   the position. Changing filters resets to page 1.
5. While a page is loading, the grid shows skeletons shaped like the cards and the pagination
   stays stable (`keepPreviousData`); moving page smoothly scrolls back to the top.
6. The feed is live and can shrink below the page in the URL. That page then comes back empty, so
   the app snaps the URL back to the last valid page and the range text is clamped rather than
   printing something like "25–24 dari 24".

### UI

- Tailwind with a Transjakarta-derived `brand` palette, plus a class-based dark mode.
- The Leaflet map is loaded lazily, so it ships in its own chunk and never blocks the list.
- Card artwork is the LCP element, so the first row renders it `loading="eager"` with
  `fetchpriority="high"`; every card below the fold keeps `loading="lazy"`.
- Route badges use the route's own `color`/`text_color` from the API, not the app theme.

## Testing

Vitest + React Testing Library. The suite covers the pieces most likely to break:

- JSON:API parsing, the last-page offset, and the exact vehicle total (last-page probe + cache
  reuse across page changes).
- API client URL building, headers, error mapping and network failures.
- Pagination windowing and the `Pagination` component interactions.
- URL query-param helpers.
- `VehicleCard` rendering and selection.
- `Modal` accessibility (dialog role, Escape, overlay click).
- `useRouteSearch` matching and debounce behaviour.

```bash
npm run test
```

The map and the full detail modal are intentionally not unit-tested (Leaflet needs a real DOM);
they are covered by manual checks.

## Notes

- UI copy is Indonesian (it's the product language); code and this README are English.
- The app expects an MBTA API key in `VITE_MBTA_API_KEY` and sends it as `X-API-Key` on every
  request. There is no separate keyless mode: with an empty value the request simply goes out
  without the header, and whatever limits the API applies to it are the default ones.
- The fleet shown is the real MBTA vehicle feed, so it includes buses, ferries and trains.
