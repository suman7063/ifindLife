
import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminContentLoader from '@/components/admin/dashboard/AdminContentLoader';
import AdminAccessRestricted from '@/components/admin/dashboard/AdminAccessRestricted';
import AdminRoutes from '@/components/admin/dashboard/AdminRoutes';
import { useAdminContent } from '@/components/admin/hooks/useAdminContent';
import { hasAnyPermission } from '@/components/admin/utils/permissionUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const location = useLocation();
  
  // Extract the current tab from the URL path
  const getCurrentTabFromPath = useCallback(() => {
    const path = location.pathname.split('/');
    return path.length > 2 ? path[2] : 'overview';
  }, [location.pathname]);
  
  const [activeTab, setActiveTab] = useState(getCurrentTabFromPath());
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Update active tab when the URL changes
  useEffect(() => {
    setActiveTab(getCurrentTabFromPath());
  }, [location.pathname, getCurrentTabFromPath]);

  // Load content using the custom hook
  const { 
    experts, setExperts,
    services, setServices,
    testimonials, setTestimonials,
    loading,
    error,
    refreshData
  } = useAdminContent();

  // Handle retry functionality 
  const handleRetry = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      toast.info(`Retrying data load (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      refreshData();
    } else {
      toast.error("Maximum retry attempts reached");
    }
  }, [retryCount, refreshData, MAX_RETRIES]);

  // Reset retry count when data loads successfully
  useEffect(() => {
    if (!loading && !error) {
      setRetryCount(0);
    }
  }, [loading, error]);

  // Show loading state while authentication is being checked
  if (authLoading) {
    return <AdminContentLoader retryCount={0} />;
  }

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
  
  // Debug log data loading status
  useEffect(() => {
    console.log('Admin Dashboard: Data loading status:', { loading, error });
    
    if (!loading && !error) {
      console.log('Admin Dashboard: Data loaded', { 
        expertsCount: experts?.length || 0,
        servicesCount: services?.length || 0,
      });
    }
    
    // Show toast if there's an error
    if (error) {
      toast.error(`Error loading data: ${error}`);
    }
  }, [loading, experts, services, error]);

  // Show error UI with retry button
  if (error && !loading) {
    return (
      <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-red-500">Data Loading Error</h2>
          <p className="text-gray-600 max-w-md text-center">{error}</p>
          <div className="flex space-x-4">
            <Button 
              onClick={handleRetry} 
              disabled={retryCount >= MAX_RETRIES}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Retry ({retryCount}/{MAX_RETRIES})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading ? (
        <AdminContentLoader retryCount={retryCount} />
      ) : (
        <AdminRoutes
          isSuperAdmin={currentUser?.role === 'superadmin'}
          loading={loading}
          experts={experts}
          setExperts={setExperts}
          services={services}
          setServices={setServices}
          testimonials={testimonials}
          setTestimonials={setTestimonials}
          error={error}
          onRefresh={refreshData}
        />
      )}
    </AdminDashboardLayout>
  );
};

export default Admin;
