import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import ExpertLogin from './pages/ExpertLogin';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/UserDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import LoadingScreen from './components/auth/LoadingScreen';
import ProtectedRoute from '@/components/authentication/ProtectedRoute';

// Lazy-loaded components
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MentalHealthAssessment = lazy(() => import('./pages/MentalHealthAssessment'));
const Experts = lazy(() => import('./pages/Experts'));
const ExpertDetail = lazy(() => import('./pages/ExpertDetail'));
const ProgramsForWellnessSeekers = lazy(() => import('./pages/ProgramsForWellnessSeekers'));
const ProgramsForAcademicInstitutes = lazy(() => import('./pages/ProgramsForAcademicInstitutes'));
const ProgramsForBusiness = lazy(() => import('./pages/ProgramsForBusiness'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const CareerGuidance = lazy(() => import('./pages/CareerGuidance'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetailPage = lazy(() => import('./pages/service/ServiceDetailPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQs = lazy(() => import('./pages/FAQs'));
const Referral = lazy(() => import('./pages/Referral'));
const UserWallet = lazy(() => import('./pages/UserWallet'));

// The main routes component
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/expert-login" element={<ExpertLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/about-us" element={<AboutUs />} />
        
        {/* Lazy-loaded public routes */}
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
        <Route path="/career-guidance" element={
          <Suspense fallback={<LoadingScreen />}>
            <CareerGuidance />
          </Suspense>
        } />
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

        {/* Protected user routes */}
        <Route 
          path="/user-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-dashboard/wallet" 
          element={
            <ProtectedRoute allowedRoles={['user']} redirectPath="/user-login">
              <Suspense fallback={<LoadingScreen />}>
                <UserWallet />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Protected expert routes */}
        <Route 
          path="/expert-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={['expert']} redirectPath="/expert-login">
              <ExpertDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default AppRoutes;
