
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Loader2 } from 'lucide-react';
import UserDashboardPages from './UserDashboardPages';

const UserDashboard = () => {
  const { isAuthenticated, userType, userProfile, isLoading } = useSimpleAuth();
  
  console.log('UserDashboard - Auth state:', {
    isAuthenticated,
    userType,
    hasUserProfile: !!userProfile,
    isLoading
  });

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle unauthorized access - redirect to user login
  if (!isAuthenticated || userType !== 'user' || !userProfile) {
    console.log('UserDashboard: Unauthorized access, redirecting to user login');
    return <Navigate to="/user-login" replace />;
  }

  // Render the existing UserDashboardPages component
  return <UserDashboardPages />;
};

export default UserDashboard;
