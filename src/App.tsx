
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Consolidated auth imports
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { AdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';
import { AdminAuthProvider as AdminAuthCleanProvider } from '@/contexts/AdminAuthClean';

// Page imports organized by category
import Home from './pages/Index';

// User routes
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserRegister';
import UserDashboard from './pages/UserDashboardPages';

// Expert routes  
import ExpertLogin from './pages/ExpertLogin';
import ExpertSignup from './pages/ExpertRegister';
import ExpertDashboard from './pages/ExpertDashboard';

// Admin routes
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Testing';
import AdminLoginClean from '@/pages/AdminLoginClean';
import AdminDashboardClean from '@/pages/AdminDashboardClean';

// Content pages
import Services from './pages/Services';
import ServiceDetailPage from './pages/service/ServiceDetailPage';
import Experts from './pages/Experts';
import Programs from './pages/Programs';
import ProgramsForWellnessSeekers from './pages/ProgramsForWellnessSeekers';
import ProgramsForAcademicInstitutes from './pages/ProgramsForAcademicInstitutes';
import ProgramsForBusiness from './pages/ProgramsForBusiness';
import ProgramDetailPage from './pages/ProgramDetail';

// Assessment routes
import UnifiedAssessment from './pages/UnifiedAssessment';

// Support pages
import ContactUs from './pages/Contact';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Legal pages
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Utility pages
import NotFound from './pages/NotFound';
import LogoutPage from './pages/LogoutPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <AdminAuthProvider>
          <AdminAuthCleanProvider>
            <BrowserRouter>
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
                
                {/* Admin Routes - Original System */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                
                {/* Clean Admin Routes - Completely Isolated */}
                <Route path="/admin-login-clean" element={<AdminLoginClean />} />
                <Route path="/admin-dashboard-clean" element={<AdminDashboardClean />} />
                
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
            </BrowserRouter>
          </AdminAuthCleanProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
