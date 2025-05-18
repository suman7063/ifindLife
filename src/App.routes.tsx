
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index'; // Using Index instead of Home
import AboutUs from './pages/AboutUs'; // Using AboutUs instead of About
import Contact from './pages/Contact';
import Services from './pages/Services';
import Experts from './pages/Experts';
import ExpertDetail from './pages/ExpertDetail'; // Using ExpertDetail instead of ExpertDetails
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister'; // Using UserRegister instead of UserSignup
import ExpertLogin from './pages/ExpertLogin';
import ExpertRegister from './pages/ExpertRegister'; // Using ExpertRegister instead of ExpertSignup
import UserDashboard from './pages/UserDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { useAuth } from '@/contexts/auth/AuthContext';
import Programs from './pages/Programs'; // Fixed import syntax
import TermsOfService from './pages/TermsOfService'; // Fixed import syntax
import PrivacyPolicy from './pages/PrivacyPolicy'; // Fixed import syntax
import LogoutPage from '@/pages/LogoutPage';

export const AppRoutes = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/expert/:id" element={<ExpertDetail />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserRegister />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/expert-signup" element={<ExpertRegister />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* User Dashboard - accessible only to authenticated users */}
      <Route 
        path="/user-dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Expert Dashboard - accessible only to authenticated experts */}
      <Route 
        path="/expert-dashboard" 
        element={
          <ProtectedRoute requiredRole="expert">
            <ExpertDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes - accessible only to authenticated admins */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="super_admin">
            <Admin />
          </ProtectedRoute>
        } 
      />
      
      {/* Logout Page */}
      <Route path="/logout" element={<LogoutPage />} />

      {/* Not Found Route - catch-all for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
