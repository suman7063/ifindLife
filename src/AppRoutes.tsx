import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';

// Import all page components
import Home from '@/pages/Home';
import UserLogin from '@/pages/UserLogin';
import ExpertLogin from '@/pages/ExpertLogin';
import AdminLogin from '@/pages/AdminLogin';
import UserDashboardPages from '@/pages/UserDashboardPages';
import ExpertDashboard from '@/pages/ExpertDashboard';
import Admin from '@/pages/Admin';

// Other pages
import Login from '@/pages/Login';
import Experts from '@/pages/Experts';
import Services from '@/pages/Services';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/find-experts" element={<Experts />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Dashboard Routes */}
      <Route path="/user-dashboard/*" element={<UserDashboardPages />} />
      <Route path="/expert-dashboard/*" element={<ExpertDashboard />} />
      
      {/* Admin Routes - Scoped with AdminAuthProvider */}
      <Route 
        path="/admin/*" 
        element={
          <AdminAuthProvider>
            <Admin />
          </AdminAuthProvider>
        } 
      />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
