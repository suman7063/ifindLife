
import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminContentLoader from '@/components/admin/dashboard/AdminContentLoader';
import AdminAccessRestricted from '@/components/admin/dashboard/AdminAccessRestricted';
import AdminRoutes from '@/components/admin/dashboard/AdminRoutes';
import { useAdminContent } from '@/components/admin/hooks/useAdminContent';
import { hasAnyPermission, isSuperAdmin } from '@/components/admin/utils/permissionUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';

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
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const MAX_RETRIES = 3;
  
  console.log('Admin page rendered', { 
    isAuthenticated, 
    authLoading, 
    currentUser: currentUser?.username,
    activeTab
  });
  
  // Update active tab when the URL changes
  useEffect(() => {
    setActiveTab(getCurrentTabFromPath());
  }, [location.pathname, getCurrentTabFromPath]);

  // Load content using the custom hook with enhanced error handling
  const { 
    experts, setExperts,
    services, setServices,
    testimonials, setTestimonials,
    loading: contentLoading,
    error,
    refreshData,
    forceRefresh
  } = useAdminContent();

  // Enhanced retry functionality with circuit breaker
  const handleRetry = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setCriticalError(null);
      toast.info(`Retrying data load (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      forceRefresh();
    } else {
      setCriticalError("Maximum retry attempts reached. Please refresh the page manually.");
      toast.error("Maximum retry attempts reached");
    }
  }, [retryCount, forceRefresh, MAX_RETRIES]);

  // Handle force refresh from user action
  const handleForceRefresh = useCallback(() => {
    console.log('Admin: Force refresh requested by user');
    setRetryCount(0);
    setCriticalError(null);
    toast.info('Refreshing data...');
    forceRefresh();
  }, [forceRefresh]);

  // Handle critical errors
  const handleCriticalError = useCallback(() => {
    if (error && error.includes('infinite recursion')) {
      setCriticalError("Database policy error detected. Please contact system administrator.");
    } else if (error && error.includes('Too many errors')) {
      setCriticalError("System overload detected. Please wait before retrying.");
    }
  }, [error]);

  // Reset retry count when data loads successfully
  useEffect(() => {
    if (!contentLoading && !error) {
      setRetryCount(0);
      setCriticalError(null);
    }
  }, [contentLoading, error]);

  // Monitor for critical errors
  useEffect(() => {
    if (error) {
      handleCriticalError();
    }
  }, [error, handleCriticalError]);

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
    console.log('Admin Dashboard: Data loading status:', { contentLoading, error });
    
    if (!contentLoading && !error) {
      console.log('Admin Dashboard: Data loaded', { 
        expertsCount: experts?.length || 0,
        servicesCount: services?.length || 0,
      });
    }
    
    // Show toast if there's an error (but not for critical errors)
    if (error && !criticalError) {
      toast.error(`Error loading data: ${error}`);
    }
  }, [contentLoading, experts, services, error, criticalError]);

  // Show critical error UI
  if (criticalError) {
    return (
      <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-semibold text-red-600">System Error</h2>
          <p className="text-gray-700 max-w-md text-center">{criticalError}</p>
          <div className="flex space-x-4">
            <Button 
              onClick={() => window.location.reload()}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Reload Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setCriticalError(null);
                setRetryCount(0);
              }}
            >
              Dismiss Error
            </Button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  // Show error UI with retry button
  if (error && !contentLoading) {
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
      {contentLoading ? (
        <AdminContentLoader retryCount={retryCount} />
      ) : (
        <AdminRoutes
          isSuperAdmin={isSuperAdmin(currentUser)}
          loading={contentLoading}
          experts={experts}
          setExperts={setExperts}
          services={services}
          setServices={setServices}
          testimonials={testimonials}
          setTestimonials={setTestimonials}
          error={error}
          onRefresh={handleForceRefresh}
        />
      )}
    </AdminDashboardLayout>
  );
};

export default Admin;
