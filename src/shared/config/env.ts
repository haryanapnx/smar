import { K_MBTA_BASE_URL } from '@/shared/constants';

const readEnv = (value: string | undefined, fallback = ''): string => (value ?? fallback).trim();

export type Env = {
  mbtaApiKey: string;
  mbtaApiBaseUrl: string;
};

export const env: Env = {
  mbtaApiKey: readEnv(import.meta.env.VITE_MBTA_API_KEY),
  mbtaApiBaseUrl: readEnv(import.meta.env.VITE_MBTA_API_BASE_URL, K_MBTA_BASE_URL),
};
