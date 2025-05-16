
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import Login from '@/pages/Login';
import UserLogin from '@/pages/UserLogin';
import ExpertLogin from '@/pages/ExpertLogin';
import AdminLogin from '@/pages/AdminLogin';
import AboutUs from '@/pages/AboutUs';
import LoadingScreen from '@/components/auth/LoadingScreen';
import Index from '@/pages/Index';

// Lazy-loaded components
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const MentalHealthAssessment = lazy(() => import('@/pages/MentalHealthAssessment'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQs = lazy(() => import('@/pages/FAQs'));
const Referral = lazy(() => import('@/pages/Referral'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const CareerGuidance = lazy(() => import('@/pages/CareerGuidance'));

/**
 * Public routes that don't require authentication
 */
export const PublicRoutes: React.FC = () => {
  return (
    <>
      {/* Home page route */}
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Info pages */}
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
    </>
  );
};
