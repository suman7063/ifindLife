
import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminSettings from '@/components/admin/dashboard/AdminSettings';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import AdminTabs from '@/components/admin/AdminTabs';

const Admin = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the current tab from the URL path
  const getCurrentTabFromPath = () => {
    const path = location.pathname.split('/');
    return path.length > 2 ? path[2] : 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTabFromPath());
  
  // States for all content sections
  const [experts, setExperts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>({});
  const [testimonials, setTestimonials] = useState<any[]>([]);
  
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
        <Route path="/adminUsers" element={<AdminUserManagement />} />
        <Route path="/settings" element={<AdminSettings />} />
        
        {/* Dynamic content tabs */}
        <Route 
          path="/:tabName" 
          element={
            <AdminTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              experts={experts}
              setExperts={setExperts}
              services={services}
              setServices={setServices}
              heroSettings={heroSettings}
              setHeroSettings={setHeroSettings}
              testimonials={testimonials}
              setTestimonials={setTestimonials}
            />
          } 
        />
      </Routes>
    </AdminDashboardLayout>
  );
};

export default Admin;
