
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
const Index = lazy(() => import('./pages/Index'));
const LoginPage = lazy(() => import('./pages/UserLogin')); // Fixed import
const RegisterPage = lazy(() => import('./pages/UserRegister')); // Fixed import
const ProgramsPage = lazy(() => import('./pages/ProgramsForWellnessSeekers')); // Fixed import
const AcademicProgramsPage = lazy(() => import('./pages/ProgramsForAcademicInstitutes')); // Updated to correct component
const BusinessProgramsPage = lazy(() => import('./pages/ProgramsForBusiness')); // Updated to correct component
const ExpertsPage = lazy(() => import('./pages/Experts')); // Fixed import
const ExpertProfilePage = lazy(() => import('./pages/ExpertDetail')); // Fixed import
const UserProfilePage = lazy(() => import('./pages/UserDashboard')); // Fixed import
const AdminPage = lazy(() => import('./pages/Admin')); // Fixed import
const ExpertLoginPage = lazy(() => import('./pages/ExpertLogin')); // Fixed import
const ExpertRegisterPage = lazy(() => import('./pages/ExpertRegister')); // Fixed import
const ExpertDashboardPage = lazy(() => import('./pages/ExpertDashboard')); // Fixed import
const AssessmentPage = lazy(() => import('./pages/MentalHealthAssessment')); // Fixed import
const EnrolledCoursesPage = lazy(() => import('./pages/UserEnrolledCourses')); // Fixed import name
const NotFoundPage = lazy(() => import('./pages/NotFound')); // Fixed import

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/programs',
    element: <ProgramsPage />,
  },
  {
    path: '/academic-programs',
    element: <AcademicProgramsPage />,
  },
  {
    path: '/business-programs',
    element: <BusinessProgramsPage />,
  },
  {
    path: '/experts',
    element: <ExpertsPage />,
  },
  {
    path: '/expert-profile/:id',
    element: <ExpertProfilePage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expert-login',
    element: <ExpertLoginPage />,
  },
  {
    path: '/expert-register',
    element: <ExpertRegisterPage />,
  },
  {
    path: '/expert-dashboard/*',
    element: (
      <ProtectedRoute>
        <ExpertDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mental-health-assessment',
    element: <AssessmentPage />,
  },
  {
    path: '/enrolled-courses',
    element: (
      <ProtectedRoute>
        <EnrolledCoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
