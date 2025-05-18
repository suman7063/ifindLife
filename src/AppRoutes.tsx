
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import NotFound from './pages/NotFound';

// Import pages for direct rendering
import { lazy, Suspense } from 'react';
import LoadingScreen from './components/auth/LoadingScreen';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Lazy-loaded components for better performance
const Login = lazy(() => import('./pages/Login'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const ExpertLogin = lazy(() => import('./pages/ExpertLogin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MentalHealthAssessment = lazy(() => import('./pages/MentalHealthAssessment'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQs = lazy(() => import('./pages/FAQs'));
const Referral = lazy(() => import('./pages/Referral'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CareerGuidance = lazy(() => import('./pages/CareerGuidance'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetailPage = lazy(() => import('./pages/service/ServiceDetailPage'));
const ProgramsForWellnessSeekers = lazy(() => import('./pages/ProgramsForWellnessSeekers'));
const ProgramsForAcademicInstitutes = lazy(() => import('./pages/ProgramsForAcademicInstitutes'));
const ProgramsForBusiness = lazy(() => import('./pages/ProgramsForBusiness'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Experts = lazy(() => import('./pages/Experts'));
const ExpertDetail = lazy(() => import('./pages/ExpertDetail'));
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard'));
const ExpertRegister = lazy(() => import('./pages/ExpertRegister'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const UserWallet = lazy(() => import('./pages/UserWallet'));
const Admin = lazy(() => import('./pages/Admin'));
const MigrateData = lazy(() => import('./pages/MigrateData'));
const Index = lazy(() => import('./pages/Index'));

/**
 * Main application routes component - now directly rendering all routes
 */
const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Suspense fallback={<LoadingScreen />}>
            <Index />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<LoadingScreen />}>
            <Login />
          </Suspense>
        } />
        <Route path="/user-login" element={
          <Suspense fallback={<LoadingScreen />}>
            <UserLogin />
          </Suspense>
        } />
        <Route path="/expert-login" element={
          <Suspense fallback={<LoadingScreen />}>
            <ExpertLogin />
          </Suspense>
        } />
        <Route path="/admin-login" element={
          <Suspense fallback={<LoadingScreen />}>
            <AdminLogin />
          </Suspense>
        } />
        <Route path="/about-us" element={
          <Suspense fallback={<LoadingScreen />}>
            <AboutUs />
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingScreen />}>
            <ForgotPassword />
          </Suspense>
        } />
        <Route path="/reset-password" element={
          <Suspense fallback={<LoadingScreen />}>
            <ResetPassword />
          </Suspense>
        } />
        <Route path="/mental-health-assessment" element={
          <Suspense fallback={<LoadingScreen />}>
            <MentalHealthAssessment />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<LoadingScreen />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/faqs" element={
          <Suspense fallback={<LoadingScreen />}>
            <FAQs />
          </Suspense>
        } />
        <Route path="/referral" element={
          <Suspense fallback={<LoadingScreen />}>
            <Referral />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<LoadingScreen />}>
            <PrivacyPolicy />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<LoadingScreen />}>
            <TermsOfService />
          </Suspense>
        } />
        <Route path="/career-guidance" element={
          <Suspense fallback={<LoadingScreen />}>
            <CareerGuidance />
          </Suspense>
        } />

        {/* Content Routes */}
        <Route path="/blog" element={
          <Suspense fallback={<LoadingScreen />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/blog/:slug" element={
          <Suspense fallback={<LoadingScreen />}>
            <BlogPost />
          </Suspense>
        } />
        <Route path="/services" element={
          <Suspense fallback={<LoadingScreen />}>
            <Services />
          </Suspense>
        } />
        <Route path="/services/:serviceId" element={
          <Suspense fallback={<LoadingScreen />}>
            <ServiceDetailPage />
          </Suspense>
        } />

        {/* Program Routes */}
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

        {/* Expert Routes */}
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
        <Route path="/expert-dashboard/*" element={
          <ProtectedRoute allowedRoles={['expert']} redirectPath="/expert-login">
            <Suspense fallback={<LoadingScreen />}>
              <ExpertDashboard />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <Suspense fallback={<LoadingScreen />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/user-dashboard/:section" element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <Suspense fallback={<LoadingScreen />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/user-dashboard/*" element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <Suspense fallback={<LoadingScreen />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/user-wallet" element={
          <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
            <Suspense fallback={<LoadingScreen />}>
              <UserWallet />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
            <Suspense fallback={<LoadingScreen />}>
              <Admin />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/migrate-data" element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
            <Suspense fallback={<LoadingScreen />}>
              <MigrateData />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default AppRoutes;
