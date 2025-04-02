
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, currentUser } = useUserAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // We need to check for admin role differently as it may not exist directly on UserProfile
  if (requiredRole && currentUser?.email !== 'admin@ifindlife.com') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
