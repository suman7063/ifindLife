
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import UserDashboardPage from '@/pages/UserDashboard';
import LoadingScreen from '@/components/auth/LoadingScreen';

// Lazy-loaded user components
const UserWallet = lazy(() => import('@/pages/UserWallet'));

/**
 * Routes related to user dashboard and protected user features
 */
export const UserRoutes: React.FC = () => {
  return (
    <>
      {/* Protected user routes */}
      <Route 
        path="/user-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <UserDashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* Nested routes for dashboard - this allows accessing tabs directly with URLs */}
      <Route 
        path="/user-dashboard/:tab" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <UserDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* All other dashboard routes with any path */}
      <Route 
        path="/user-dashboard/*" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <UserDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* User wallet route */}
      <Route 
        path="/user-wallet" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <Suspense fallback={<LoadingScreen />}>
              <UserWallet />
            </Suspense>
          </ProtectedRoute>
        } 
      />
    </>
  );
};
