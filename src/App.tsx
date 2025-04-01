
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
import ExpertDetail from "./pages/ExpertDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MigrateData from "./pages/MigrateData";
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/ProtectedRoute';
import UserReferrals from './pages/UserReferrals';
import MentalHealthAssessment from './pages/MentalHealthAssessment';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import AboutUs from "./pages/AboutUs";
import CareerGuidance from "./pages/CareerGuidance";
import BlogEmotionalIntelligence from "./pages/BlogEmotionalIntelligence";
import BlogManagingThoughts from "./pages/BlogManagingThoughts";
import BlogTeenageAnger from "./pages/BlogTeenageAnger";
import UserProfileEdit from './components/user/UserProfileEdit';

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
      <Route path="/experts/:id" element={<ExpertDetail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/migrate-data" element={<MigrateData />} />
      <Route path="/referrals" element={<ProtectedRoute><UserReferrals /></ProtectedRoute>} />
      <Route path="/mental-health-assessment" element={<MentalHealthAssessment />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/program/:id" element={<ProgramDetail />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/career-guidance" element={<CareerGuidance />} />
      <Route path="/blog/emotional-intelligence" element={<BlogEmotionalIntelligence />} />
      <Route path="/blog/managing-thoughts" element={<BlogManagingThoughts />} />
      <Route path="/blog/teenage-anger" element={<BlogTeenageAnger />} />
      <Route path="/user-profile-edit" element={<ProtectedRoute><UserProfileEdit /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
