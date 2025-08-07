
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import { ExpertPresenceProvider } from '@/contexts/ExpertPresenceContext';
import { FavoritesProvider } from '@/contexts/favorites/FavoritesProvider';
import { SecureAdminAuthProvider } from '@/contexts/SecureAdminAuth';
import SecureAdminLogin from '@/components/admin/SecureAdminLogin';
import Home from './pages/Index';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserRegister';
import ExpertLogin from './pages/ExpertLogin';
import ExpertSignup from './pages/ExpertRegister';
import NewExpertDashboard from './pages/NewExpertDashboard';
import UserDashboardWrapper from './pages/UserDashboardWrapper';

import AppointmentsPage from './pages/AppointmentsPage';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import ServiceDetailPage from './pages/service/ServiceDetailPage';
import ProgramDetailPage from './pages/ProgramDetail';
import ContactUs from './pages/Contact';
import AboutUs from './pages/AboutUs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import LogoutPage from './pages/LogoutPage';
import Services from './pages/Services';
import Experts from './pages/Experts';
import ExpertDetail from './pages/ExpertDetail';
import Programs from './pages/Programs';
import ProgramsForWellnessSeekers from './pages/ProgramsForWellnessSeekers';
import ProgramsForAcademicInstitutes from './pages/ProgramsForAcademicInstitutes';
import ProgramsForBusiness from './pages/ProgramsForBusiness';
import FAQs from './pages/FAQs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import UnifiedAssessment from './pages/UnifiedAssessment';
import AuthTestPage from './pages/AuthTestPage';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserDashboard } from '@/components/user/UserDashboard';
import { EnhancedExpertSearch } from '@/components/expert/EnhancedExpertSearch';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { FavoritesManager } from '@/components/favorites/FavoritesManager';
import CallPage from './pages/CallPage';
import MessagingPage from './pages/MessagingPage';
import UnifiedExpertsPage from './pages/UnifiedExpertsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ReferralProgram from './pages/ReferralProgram';
import AuthCallback from './pages/AuthCallback';

// Create QueryClient outside component to avoid hook issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Clean routing - admin routes are now handled directly in App component

// Component wrapper for user/expert routes with SimpleAuthProvider
const UserRoutes: React.FC = () => {
  return (
    <SimpleAuthProvider>
      <ExpertPresenceProvider>
        <FavoritesProvider>
        <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Services Routes - Support both slug and ID routing */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
        
        {/* Legacy service routes for backward compatibility */}
        <Route path="/services/anxiety" element={<ServiceDetailPage />} />
        <Route path="/services/relationships" element={<ServiceDetailPage />} />
        <Route path="/services/family" element={<ServiceDetailPage />} />
        <Route path="/services/personal-growth" element={<ServiceDetailPage />} />
        
        {/* Expert Routes */}
        <Route path="/experts" element={<Experts />} />
        <Route path="/experts-enhanced" element={<EnhancedExpertSearch />} />
        <Route path="/experts/:id" element={<ExpertDetail />} />
        <Route path="/expert/:id" element={<ExpertDetail />} /> {/* Backward compatibility */}
        <Route path="/expert-login" element={<ExpertLogin />} />
        <Route path="/expert-signup" element={<ExpertSignup />} />
        <Route path="/expert-dashboard/*" element={<NewExpertDashboard />} />
        
        {/* Expert Category Routes - Unified */}
        <Route path="/experts/categories" element={<UnifiedExpertsPage />} />
        
        {/* Legacy redirects for SEO */}
        <Route path="/experts/listening-volunteer" element={<UnifiedExpertsPage />} />
        <Route path="/experts/listening-expert" element={<UnifiedExpertsPage />} />
        <Route path="/experts/mindfulness-expert" element={<UnifiedExpertsPage />} />
        <Route path="/experts/life-coach" element={<UnifiedExpertsPage />} />
        <Route path="/experts/spiritual-mentor" element={<UnifiedExpertsPage />} />
        
        {/* User Routes */}
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/user-dashboard/*" element={<UserDashboardWrapper />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/call/:appointmentId" element={<CallPage />} />
        <Route path="/messaging" element={<MessagingPage />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/favorites" element={<FavoritesManager />} />
        
        {/* Program Routes */}
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs-for-wellness-seekers" element={<ProgramsForWellnessSeekers />} />
        <Route path="/programs-for-academic-institutes" element={<ProgramsForAcademicInstitutes />} />
        <Route path="/programs-for-business" element={<ProgramsForBusiness />} />
        <Route path="/program/:programId" element={<ProgramDetailPage />} />
        
        {/* Assessment Routes */}
        <Route path="/mental-health-assessment" element={<UnifiedAssessment />} />
        <Route path="/emotional-wellness-assessment" element={<UnifiedAssessment />} />
        <Route path="/spiritual-wellness-assessment" element={<UnifiedAssessment />} />
        
        {/* Support Routes */}
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/referral-program" element={<ReferralProgram />} />
        
        {/* Authentication Test Suite */}
        <Route path="/auth-test" element={<AuthTestPage />} />
        
        {/* Legal Routes */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        
        {/* Auth Routes */}
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth-callback" element={<AuthCallback />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </FavoritesProvider>
        </ExpertPresenceProvider>
    </SimpleAuthProvider>
  );
};

function App(): JSX.Element {
  // App is rendering with unified auth provider
  
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* CRITICAL: Admin routes with secure authentication */}
          <Route path="/admin-login" element={
            <SecureAdminAuthProvider>
              <SecureAdminLogin />
            </SecureAdminAuthProvider>
          } />
          <Route path="/admin/*" element={
            <SecureAdminAuthProvider>
              <AdminDashboard />
            </SecureAdminAuthProvider>
          } />
          
          {/* All other routes with SimpleAuthProvider */}
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
