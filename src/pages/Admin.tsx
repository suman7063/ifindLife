
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminContentLoader from '@/components/admin/dashboard/AdminContentLoader';
import AdminAccessRestricted from '@/components/admin/dashboard/AdminAccessRestricted';
import AdminRoutes from '@/components/admin/dashboard/AdminRoutes';
import { useAdminContent } from '@/components/admin/hooks/useAdminContent';
import { hasAnyPermission } from '@/components/admin/utils/permissionUtils';

const Admin = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  
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

  // Load content using the custom hook
  const { 
    experts, setExperts,
    services, setServices,
    heroSettings, setHeroSettings,
    testimonials, setTestimonials,
    loading 
  } = useAdminContent();

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    console.log('Admin.tsx: Not authenticated, redirecting to admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user has any permissions
  if (!hasAnyPermission(currentUser)) {
    console.log('Admin.tsx: User has no permissions');
    return <AdminAccessRestricted />;
  }

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading ? (
        <AdminContentLoader />
      ) : (
        <AdminRoutes 
          loading={loading}
          experts={experts}
          setExperts={setExperts}
          services={services}
          setServices={setServices}
          heroSettings={heroSettings}
          setHeroSettings={setHeroSettings}
          testimonials={testimonials}
          setTestimonials={setTestimonials}
        />
      )}
    </AdminDashboardLayout>
  );
};

export default Admin;
