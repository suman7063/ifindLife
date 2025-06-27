
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isUserAuthenticatedForDashboard } from '@/utils/authHelpers';
import { Loader2 } from 'lucide-react';
import UserDashboardPages from './UserDashboardPages';

const UserDashboard = () => {
  const simpleAuth = useSimpleAuth();
  const { isAuthenticated, userType, userProfile, isLoading, user } = simpleAuth;
  
  console.log('UserDashboard - Enhanced auth state:', {
    unifiedAuthCheck: isUserAuthenticatedForDashboard(simpleAuth),
    originalCheck: Boolean(isAuthenticated && userType === 'user' && userProfile),
    rawState: {
      isAuthenticated: Boolean(isAuthenticated),
      userType,
      hasUserProfile: Boolean(userProfile),
      hasUser: Boolean(user),
      userEmail: user?.email,
      isLoading: Boolean(isLoading)
    }
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

  // Handle unauthorized access using unified auth check
  if (!isUserAuthenticatedForDashboard(simpleAuth)) {
    console.log('UserDashboard: Unauthorized access via unified check, redirecting to user login');
    return <Navigate to="/user-login" replace />;
  }

  // TEMPORARY DEBUG: Show auth state for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('UserDashboard: RENDERING - Auth state passed all checks:', {
      user: user?.email,
      userType,
      isAuthenticated
    });
  }

  // Render the existing UserDashboardPages component
  return <UserDashboardPages />;
};

export default UserDashboard;
