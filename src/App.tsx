import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserDashboardPages from './pages/UserDashboardPages';
import Home from './pages/Home';
import About from './pages/About';
import Experts from './pages/Experts';
import ExpertDetails from './pages/ExpertDetails';
import UserLogin from './pages/UserLogin';
import ExpertLogin from './pages/ExpertLogin';
import UserSignup from './pages/UserSignup';
import ExpertSignup from './pages/ExpertSignup';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './components/auth/RequireAuth';
import { AuthProvider } from './contexts/auth/AuthContext';
import { UserAuthProvider } from './contexts/auth/UserAuthProvider';
import { ExpertAuthProvider } from './contexts/auth/ExpertAuthProvider';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/experts/:expertId" element={<ExpertDetails />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/expert-login" element={<ExpertLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/expert-signup" element={<ExpertSignup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* User Dashboard Routes */}
        <Route path="/user-dashboard" element={<UserDashboardPages />} />
        <Route path="/user-dashboard/:section" element={<UserDashboardPages />} />
        
        <Route path="/dashboard" element={<RequireAuth roles={['user', 'expert']}><Dashboard /></RequireAuth>} />
        <Route path="/expert-dashboard/*" element={<RequireAuth roles={['expert']}><ExpertDashboard /></RequireAuth>} />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;
