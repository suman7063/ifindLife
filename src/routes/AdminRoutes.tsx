
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import LoadingScreen from '@/components/auth/LoadingScreen';

// Lazy-loaded admin components
const Admin = lazy(() => import('@/pages/Admin'));
const MigrateData = lazy(() => import('@/pages/MigrateData'));

/**
 * Routes related to admin dashboard and protected admin features
 */
export const AdminRoutes: React.FC = () => {
  return (
    <>
      {/* Protected admin routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
            <Suspense fallback={<LoadingScreen />}>
              <Admin />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* Data migration tool - admin protected */}
      <Route 
        path="/migrate-data" 
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
            <Suspense fallback={<LoadingScreen />}>
              <MigrateData />
            </Suspense>
          </ProtectedRoute>
        } 
      />
    </>
  );
};
