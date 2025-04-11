
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { UserRole } from '@/contexts/auth/types';

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
  const auth = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Once the auth loading is complete, we can finish our check
    if (!auth.isLoading) {
      setIsChecking(false);
    }
  }, [auth.isLoading]);

  // Show loading screen while checking authentication
  if (auth.isLoading || isChecking) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated but not in allowed roles, redirect to appropriate page
  if (auth.role && !allowedRoles.includes(auth.role)) {
    // Redirect based on role
    if (auth.role === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    } else if (auth.role === 'expert') {
      return <Navigate to="/expert-dashboard" replace />;
    } else if (auth.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // If authenticated and has allowed role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
