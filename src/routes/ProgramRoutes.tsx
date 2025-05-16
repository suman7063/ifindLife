
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import LoadingScreen from '@/components/auth/LoadingScreen';

// Lazy-loaded program components
const ProgramsForWellnessSeekers = lazy(() => import('@/pages/ProgramsForWellnessSeekers'));
const ProgramsForAcademicInstitutes = lazy(() => import('@/pages/ProgramsForAcademicInstitutes'));
const ProgramsForBusiness = lazy(() => import('@/pages/ProgramsForBusiness'));
const ProgramDetail = lazy(() => import('@/pages/ProgramDetail'));

/**
 * Routes related to programs and courses
 */
export const ProgramRoutes: React.FC = () => {
  return (
    <>
      <Route path="/programs-for-wellness-seekers" element={
        <Suspense fallback={<LoadingScreen />}>
          <ProgramsForWellnessSeekers />
        </Suspense>
      } />
      <Route path="/programs-for-academic-institutes" element={
        <Suspense fallback={<LoadingScreen />}>
          <ProgramsForAcademicInstitutes />
        </Suspense>
      } />
      <Route path="/programs-for-business" element={
        <Suspense fallback={<LoadingScreen />}>
          <ProgramsForBusiness />
        </Suspense>
      } />
      <Route path="/program/:id" element={
        <Suspense fallback={<LoadingScreen />}>
          <ProgramDetail />
        </Suspense>
      } />
    </>
  );
};
