
import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminSettings from '@/components/admin/dashboard/AdminSettings';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import ExpertsEditor from '@/components/admin/experts/ExpertsEditor';
import ServicesEditor from '@/components/admin/ServicesEditor';
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';

const Admin = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current tab from the URL path
  const getCurrentTabFromPath = () => {
    const path = location.pathname.split('/');
    return path.length > 2 ? path[2] : 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTabFromPath());
  
  // Update active tab when the URL changes
  useEffect(() => {
    setActiveTab(getCurrentTabFromPath());
  }, [location.pathname]);

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    console.log('Admin.tsx: Not authenticated, redirecting to admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user has any permissions
  const hasAnyPermission = currentUser && Object.values(currentUser.permissions).some(val => val === true);
  
  if (!hasAnyPermission) {
    console.log('Admin.tsx: User has no permissions');
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Access Restricted</h1>
          <p className="mb-6 text-muted-foreground">
            You don't have any permissions assigned to your account. Please contact a super administrator.
          </p>
          <button 
            onClick={() => window.location.href = '/admin-login'}
            className="w-full rounded bg-ifind-aqua py-2 font-medium text-white hover:bg-ifind-teal"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/overview" element={<AdminOverview />} />
        <Route path="/experts" element={<ExpertsEditor experts={[]} setExperts={() => {}} />} />
        <Route path="/expertApprovals" element={<ExpertApprovals />} />
        <Route path="/services" element={<ServicesEditor categories={[]} setCategories={() => {}} />} />
        <Route path="/herosection" element={<HeroSectionEditor heroSettings={{}} setHeroSettings={() => {}} />} />
        <Route path="/testimonials" element={<TestimonialsEditor testimonials={[]} setTestimonials={() => {}} />} />
        <Route path="/programs" element={<ProgramsEditor />} />
        <Route path="/sessions" element={<SessionsEditor />} />
        <Route path="/referrals" element={<ReferralSettingsEditor />} />
        <Route path="/blog" element={<BlogEditor />} />
        <Route path="/contact" element={<ContactSubmissionsTable />} />
        <Route path="/adminUsers" element={<AdminUserManagement />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </AdminDashboardLayout>
  );
};

export default Admin;
