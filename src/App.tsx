
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Index';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserRegister';
import ExpertLogin from './pages/ExpertLogin';
import ExpertSignup from './pages/ExpertRegister';
import ExpertDashboard from './pages/ExpertDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Testing';
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
import Programs from './pages/Programs';
import ProgramsForWellnessSeekers from './pages/ProgramsForWellnessSeekers';
import ProgramsForAcademicInstitutes from './pages/ProgramsForAcademicInstitutes';
import ProgramsForBusiness from './pages/ProgramsForBusiness';
import FAQs from './pages/FAQs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import UnifiedAssessment from './pages/UnifiedAssessment';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EnhancedUnifiedAuthProvider } from "@/contexts/auth/EnhancedUnifiedAuthContext";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import AuthHandler from "@/components/AuthHandler";
import DebugDOMStatus from "@/components/DebugDOMStatus";
import { useEnhancedUnifiedAuth } from "@/contexts/auth/EnhancedUnifiedAuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App Component with comprehensive debugging
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, sessionType, user } = useEnhancedUnifiedAuth();
  
  console.log('🔒 App render state:', { 
    isAuthenticated: Boolean(isAuthenticated),
    isLoading: Boolean(isLoading),
    sessionType,
    hasUser: Boolean(user),
    userEmail: user?.email,
    timestamp: new Date().toISOString()
  });

  // Show loading state while auth is initializing
  if (isLoading) {
    console.log('🔒 App showing loading state');
    return (
      <div className="app-loading min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  console.log('🔒 App rendering main content');
  
  return (
    <div className="app min-h-screen flex flex-col" style={{ minHeight: '100vh', width: '100%' }}>
      <DebugDOMStatus />
      
      <TooltipProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Services Routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
          
          {/* Expert Routes */}
          <Route path="/experts" element={<Experts />} />
          <Route path="/expert-login" element={<ExpertLogin />} />
          <Route path="/expert-signup" element={<ExpertSignup />} />
          <Route path="/expert-dashboard/*" element={<ExpertDashboard />} />
          
          {/* User Routes */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
          
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
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          
          {/* Legal Routes */}
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Auth Routes */}
          <Route path="/logout" element={<LogoutPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </div>
  );
};

// Main App wrapper with all providers
function App() {
  console.log('🔒 App wrapper initializing');
  
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <EnhancedUnifiedAuthProvider>
          <AuthHandler>
            <AppContent />
          </AuthHandler>
        </EnhancedUnifiedAuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
