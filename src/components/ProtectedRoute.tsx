
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';

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
    return <Navigate to="/admin-login" replace />;
  }

  // If route requires superadmin access and user is not a superadmin
  if (requireSuperAdmin && currentUser?.role !== 'superadmin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
