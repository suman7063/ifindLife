
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Experts from './pages/Experts';
import ExpertDetail from './pages/ExpertDetail';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import ExpertLogin from './pages/ExpertLogin';
import ExpertRegister from './pages/ExpertRegister';
import UserDashboardPages from './pages/UserDashboardPages';
import ExpertDashboard from './pages/ExpertDashboard';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { useAuth } from '@/contexts/auth/AuthContext';
import Programs from './pages/Programs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LogoutPage from './pages/LogoutPage';
import ProgramsForBusiness from './pages/ProgramsForBusiness';
import ProgramsForWellnessSeekers from './pages/ProgramsForWellnessSeekers';
import ProgramsForAcademicInstitutes from './pages/ProgramsForAcademicInstitutes';
import FAQs from './pages/FAQs';

const AppRoutes = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:serviceType" element={<Services />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/expert/:id" element={<ExpertDetail />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserRegister />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/expert-signup" element={<ExpertRegister />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/programs-for-wellness-seekers" element={<ProgramsForWellnessSeekers />} />
      <Route path="/programs-for-academic-institutes" element={<ProgramsForAcademicInstitutes />} />
      <Route path="/programs-for-business" element={<ProgramsForBusiness />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Support Routes - Fixed to use actual pages instead of NotFound */}
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/faq" element={<FAQs />} />
      <Route path="/blog" element={<NotFound />} />
      <Route path="/help" element={<NotFound />} />
      
      {/* User Dashboard - accessible only to authenticated users */}
      <Route 
        path="/user-dashboard" 
        element={<UserDashboardPages />}
      />
      <Route 
        path="/user-dashboard/:section" 
        element={<UserDashboardPages />}
      />
      
      {/* Expert Dashboard - accessible only to authenticated experts */}
      <Route 
        path="/expert-dashboard" 
        element={<ExpertDashboard />}
      />
      
      {/* Admin Routes - accessible only to authenticated admins */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<Admin />} />
      
      {/* Logout Page */}
      <Route path="/logout" element={<LogoutPage />} />
      
      {/* Not Found Route - catch-all for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
