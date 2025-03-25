
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSuperAdmin = false 
}) => {
  const { isAuthenticated, currentUser } = useUserAuth();

  if (!isAuthenticated) {
    return <Navigate to="/user-login" replace />;
  }

  // We need to check for admin role differently as it may not exist directly on UserProfile
  if (requireSuperAdmin && currentUser?.email !== 'admin@ifindlife.com') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
