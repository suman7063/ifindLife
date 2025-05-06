
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';
import type { UserRole } from '@/contexts/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user', 'expert', 'admin'], 
  redirectPath = '/login'
}) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute - Auth check:", { isAuthenticated, role, isLoading });
    
    // Once the auth loading is complete, we can finish our check
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, role]);

  // Show loading screen while checking authentication
  if (isLoading || isChecking) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to appropriate login page
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to:", redirectPath);
    
    // If this is a route specifically for experts, redirect to expert login
    const isExpertOnlyRoute = allowedRoles.length === 1 && allowedRoles[0] === 'expert';
    if (isExpertOnlyRoute) {
      return <Navigate to="/expert-login" state={{ from: location }} replace />;
    }
    
    // If specifically for admin routes, redirect to admin login
    if (allowedRoles.length === 1 && allowedRoles[0] === 'admin') {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    
    // Otherwise use the default redirect path
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated but not in allowed roles, redirect to appropriate dashboard
  if (role && !allowedRoles.includes(role)) {
    console.log(`ProtectedRoute - User has role ${role} but needs one of ${allowedRoles.join(', ')}`);
    
    // Redirect based on role
    if (role === 'user') {
      return <Navigate to="/user-dashboard" state={{ from: location }} replace />;
    } else if (role === 'expert') {
      return <Navigate to="/expert-dashboard" state={{ from: location }} replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
  }

  // If authenticated and has allowed role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
