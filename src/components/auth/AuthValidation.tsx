
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSecurity } from '@/contexts/auth/SecurityContext';

interface AuthValidationProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * Enhanced authentication validation component with security checks
 */
const AuthValidation: React.FC<AuthValidationProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/user-login'
}) => {
  const { isAuthenticated, isLoading, user, role } = useAuth();
  const { isSessionValid, validateSession } = useSecurity();
  const location = useLocation();

  // Validate session on mount
  React.useEffect(() => {
    if (requireAuth && isAuthenticated) {
      validateSession();
    }
  }, [requireAuth, isAuthenticated, validateSession]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if authentication is required but user is not authenticated
  if (requireAuth && (!isAuthenticated || !isSessionValid)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireAuth && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default AuthValidation;
