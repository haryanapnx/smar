import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { queryClient } from './queryClient';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
