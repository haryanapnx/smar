import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

const VehiclesPage = lazy(() =>
  import('@/pages/VehiclesPage').then((module) => ({ default: module.VehiclesPage })),
);

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/vehicles" replace /> },
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
