import { Navigate, createBrowserRouter } from 'react-router-dom';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { AppLayout } from './layouts/AppLayout';

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
