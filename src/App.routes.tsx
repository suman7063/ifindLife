
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
const Index = lazy(() => import('./pages/Index'));
const LoginPage = lazy(() => import('./pages/UserLogin'));
const RegisterPage = lazy(() => import('./pages/UserRegister'));
const ProgramsPage = lazy(() => import('./pages/Programs'));
const AcademicProgramsPage = lazy(() => import('./pages/ProgramsForAcademicInstitutes'));
const BusinessProgramsPage = lazy(() => import('./pages/ProgramsForBusiness'));
const WellnessSeekersProgramsPage = lazy(() => import('./pages/ProgramsForWellnessSeekers'));
const ExpertsPage = lazy(() => import('./pages/Experts'));
const ExpertProfilePage = lazy(() => import('./pages/ExpertDetail'));
const UserProfilePage = lazy(() => import('./pages/UserDashboard'));
const AdminPage = lazy(() => import('./pages/Admin'));
const ExpertLoginPage = lazy(() => import('./pages/ExpertLogin'));
const ExpertRegisterPage = lazy(() => import('./pages/ExpertRegister'));
const ExpertDashboardPage = lazy(() => import('./pages/ExpertDashboard'));
const AssessmentPage = lazy(() => import('./pages/MentalHealthAssessment'));
const EnrolledCoursesPage = lazy(() => import('./pages/UserEnrolledCourses'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const ServicesPage = lazy(() => import('./pages/Services'));
const ServiceDetailPage = lazy(() => import('./pages/service/ServiceDetailPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfService'));

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
    path: '/programs-for-academic-institutes',
    element: <AcademicProgramsPage />,
  },
  {
    path: '/programs-for-business',
    element: <BusinessProgramsPage />,
  },
  {
    path: '/programs-for-wellness-seekers',
    element: <WellnessSeekersProgramsPage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/services/:serviceId',
    element: <ServiceDetailPage />,
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
    path: '/privacy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/terms',
    element: <TermsOfServicePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
