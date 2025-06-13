
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Index';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserRegister';
import ExpertLogin from './pages/ExpertLogin';
import ExpertSignup from './pages/ExpertRegister';
import ExpertDashboard from './pages/ExpertDashboard';
import UserDashboard from './pages/UserDashboardPages';
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
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/expert-login" element={<ExpertLogin />} />
        <Route path="/expert-signup" element={<ExpertSignup />} />
        <Route path="/expert-dashboard/*" element={<ExpertDashboard />} />
        <Route path="/user-dashboard/*" element={<UserDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/program/:programId" element={<ProgramDetailPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
