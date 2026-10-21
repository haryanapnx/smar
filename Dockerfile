# Dockerfile — production image (static SPA served by nginx)

# ── build ───────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Vite inlines VITE_* values at build time, so they must exist before `npm run build`.
ARG VITE_MBTA_API_KEY=""
ARG VITE_MBTA_API_BASE_URL="https://api-v3.mbta.com"
ENV VITE_MBTA_API_KEY=$VITE_MBTA_API_KEY
ENV VITE_MBTA_API_BASE_URL=$VITE_MBTA_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

# ── runtime ─────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
