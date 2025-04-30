import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/auth/LoadingScreen';
import { useAuth } from './contexts/auth/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminProtectedRoute from './components/ProtectedRoute';

// Import directly to avoid any loading issues
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';

// Lazy load other pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const ExpertLogin = lazy(() => import('./pages/ExpertLogin'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Experts = lazy(() => import('./pages/Experts'));
const ExpertDetail = lazy(() => import('./pages/ExpertDetail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const UserReferrals = lazy(() => import('./pages/UserReferrals'));
const MentalHealthAssessment = lazy(() => import('./pages/MentalHealthAssessment'));
const ProgramsForWellnessSeekers = lazy(() => import('./pages/ProgramsForWellnessSeekers'));
const ProgramsForAcademicInstitutes = lazy(() => import('./pages/ProgramsForAcademicInstitutes'));
const ProgramsForBusiness = lazy(() => import('./pages/ProgramsForBusiness'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const CareerGuidance = lazy(() => import('./pages/CareerGuidance'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetailPage = lazy(() => import('./pages/service/ServiceDetailPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQs = lazy(() => import('./pages/FAQs'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Legacy pages
const MigrateData = lazy(() => import('./pages/MigrateData'));

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/expert-login" element={<ExpertLogin />} />
        
        {/* Admin login route - Explicitly defined before any other admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* User Dashboard Routes */}
        <Route path="/user-dashboard/*" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Legacy User Routes - Redirect to new dashboard */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/referrals" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Expert Protected Routes - ensure they require expert role */}
        <Route path="/expert-dashboard/*" element={
          <ProtectedRoute allowedRoles={['expert']}>
            <ExpertDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes - use specific admin protection */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } />
        <Route path="/migrate-data" element={
          <AdminProtectedRoute>
            <MigrateData />
          </AdminProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
