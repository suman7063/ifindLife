
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import LoadingScreen from '@/components/auth/LoadingScreen';
import ProtectedRoute from '@/components/routing/ProtectedRoute';

// Lazy-loaded expert components
const Experts = lazy(() => import('@/pages/Experts'));
const ExpertDetail = lazy(() => import('@/pages/ExpertDetail'));
const ExpertDashboard = lazy(() => import('@/pages/ExpertDashboard'));
const ExpertRegister = lazy(() => import('@/pages/ExpertRegister'));

/**
 * Routes related to experts, including public and protected routes
 */
export const ExpertRoutes: React.FC = () => {
  return (
    <>
      {/* Public expert routes */}
      <Route path="/experts" element={
        <Suspense fallback={<LoadingScreen />}>
          <Experts />
        </Suspense>
      } />
      <Route path="/experts/:id" element={
        <Suspense fallback={<LoadingScreen />}>
          <ExpertDetail />
        </Suspense>
      } />
      <Route path="/expert-register" element={
        <Suspense fallback={<LoadingScreen />}>
          <ExpertRegister />
        </Suspense>
      } />
      
      {/* Protected expert routes */}
      <Route 
        path="/expert-dashboard/*" 
        element={
          <ProtectedRoute allowedRoles={['expert']} redirectPath="/expert-login">
            <Suspense fallback={<LoadingScreen />}>
              <ExpertDashboard />
            </Suspense>
          </ProtectedRoute>
        } 
      />
    </>
  );
};
