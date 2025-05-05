
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import DashboardHome from '@/components/user/dashboard/DashboardHome';
import { useAuthJourneyPreservation } from '@/hooks/useAuthJourneyPreservation';

const UserDashboard: React.FC = () => {
  const { userProfile, isAuthenticated, isLoading, role, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  
  // Add debug logging
  console.log('UserDashboard page rendering with auth state:', { 
    isAuthenticated, 
    hasUserProfile: !!userProfile,
    isLoading,
    role,
    pathname: location.pathname
  });
  
  // Initialize the authentication journey preservation hook
  useAuthJourneyPreservation();
  
  // Handle logout process
  const handleLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      console.log("UserDashboard - Logging out");
      const success = await logout();
      
      if (success) {
        toast.success('Successfully logged out');
        return true;
      } else {
        toast.error('Error logging out');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <DashboardLoader />;
  }

  // Don't render dashboard content if not authenticated or not a user
  if (!isAuthenticated || role !== 'user') {
    console.log('Not authenticated or not a user, redirecting to login');
    return <Navigate to="/user-login" replace />;
  }

  return (
    <UserDashboardLayout
      user={userProfile}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
    >
      <Routes>
        <Route index element={<DashboardHome user={userProfile} />} />
        <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
      </Routes>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
