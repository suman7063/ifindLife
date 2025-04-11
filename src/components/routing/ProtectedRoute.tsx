
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/auth/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';

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
    // Once the auth loading is complete, we can finish our check
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  // Show loading screen while checking authentication
  if (isLoading || isChecking) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated but not in allowed roles, redirect to appropriate page
  if (role && !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    } else if (role === 'expert') {
      return <Navigate to="/expert-dashboard" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // If authenticated and has allowed role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
