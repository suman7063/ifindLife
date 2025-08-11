
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import type { UserRole } from '@/modules/authentication';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['user', 'expert', 'admin'],
  redirectPath = '/user-login',
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, userType } = useSimpleAuth();

  // Show loading while checking auth from SimpleAuthContext
  if (isLoading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Map SimpleAuth userType to route role
  const role = userType === 'expert' ? 'expert' : userType === 'user' ? 'user' : undefined;

  // Check for required roles when available
  if (role && !allowedRoles.includes(role)) {
    if (role === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    }
    if (role === 'expert') {
      return <Navigate to="/expert-dashboard" replace />;
    }
  }

  // All checks passed
  return <>{children}</>;
};

export default ProtectedRoute;
