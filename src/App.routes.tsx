import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Experts from './pages/Experts';
import ExpertDetails from './pages/ExpertDetails';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import ExpertLogin from './pages/ExpertLogin';
import ExpertSignup from './pages/ExpertSignup';
import UserDashboard from './pages/UserDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Programs } from './pages/Programs';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import LogoutPage from '@/pages/LogoutPage';

export const AppRoutes = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/expert/:id" element={<ExpertDetails />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserSignup />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/expert-signup" element={<ExpertSignup />} />
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
