import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';

// Import all page components
import Home from '@/pages/Home';
import UserLogin from '@/pages/UserLogin';
import ExpertLogin from '@/pages/ExpertLogin';
import AdminLogin from '@/pages/AdminLogin';
import UserDashboard from '@/pages/UserDashboard';
import ExpertDashboard from '@/pages/ExpertDashboard';
import Admin from '@/pages/Admin';

// Other pages
import Login from '@/pages/Login';
import FindExperts from '@/pages/FindExperts';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/find-experts" element={<FindExperts />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Dashboard Routes */}
      <Route path="/user-dashboard/*" element={<UserDashboard />} />
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
