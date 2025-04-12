
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/auth/LoadingScreen';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const ExpertLogin = lazy(() => import('./pages/ExpertLogin'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
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
const Login = lazy(() => import('./pages/Login'));
const MigrateData = lazy(() => import('./pages/MigrateData'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/expert-login" element={<ExpertLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/mental-health-assessment" element={<MentalHealthAssessment />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/experts/:id" element={<ExpertDetail />} />
        <Route path="/programs-for-wellness-seekers" element={<ProgramsForWellnessSeekers />} />
        <Route path="/programs-for-academic-institutes" element={<ProgramsForAcademicInstitutes />} />
        <Route path="/programs-for-business" element={<ProgramsForBusiness />} />
        <Route path="/program/:id" element={<ProgramDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/career-guidance" element={<CareerGuidance />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />

        {/* User Protected Routes */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/referrals" element={
          <ProtectedRoute>
            <UserReferrals />
          </ProtectedRoute>
        } />

        {/* Expert Protected Routes */}
        <Route path="/expert-dashboard/*" element={
          <ProtectedRoute>
            <ExpertDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/migrate-data" element={
          <ProtectedRoute>
            <MigrateData />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
