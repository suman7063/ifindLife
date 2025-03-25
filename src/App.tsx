
import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import ExpertLogin from "./pages/ExpertLogin";
import UserDashboard from "./pages/UserDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import Experts from "./pages/Experts";
import AstrologerDetail from "./pages/AstrologerDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MigrateData from "./pages/MigrateData";
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/ProtectedRoute';
import UserReferrals from './pages/UserReferrals';
import MentalHealthAssessment from './pages/MentalHealthAssessment';
import Programs from './pages/Programs';
import AboutUs from './pages/AboutUs';
import CareerGuidance from './pages/CareerGuidance';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/expert-login" element={<ExpertLogin />} />
      <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/expert-dashboard" element={<ProtectedRoute><ExpertDashboard /></ProtectedRoute>} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/experts/:id" element={<AstrologerDetail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/migrate-data" element={<MigrateData />} />
      <Route path="/referrals" element={<ProtectedRoute><UserReferrals /></ProtectedRoute>} />
      <Route path="/mental-health-assessment" element={<MentalHealthAssessment />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/career-guidance" element={<CareerGuidance />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
