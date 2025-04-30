
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import { toast } from 'sonner';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Admin ProtectedRoute check - isAuthenticated:', isAuthenticated, 'currentUser:', currentUser);
    
    if (!isAuthenticated) {
      console.log('Admin user not authenticated, will redirect');
      toast.error('Please log in to access this page');
    } else if (requiredRole && currentUser?.role !== requiredRole) {
      console.log(`Required role: ${requiredRole}, but user has role: ${currentUser?.role}`);
      toast.error(`You need ${requiredRole} permissions to access this page`);
    } else if (requiredPermission && currentUser?.permissions && 
              !currentUser.permissions[requiredPermission as keyof typeof currentUser.permissions]) {
      console.log(`Required permission: ${requiredPermission}, but user doesn't have it`);
      toast.error(`You don't have permission to access this page`);
    }
  }, [isAuthenticated, currentUser, requiredRole, requiredPermission]);

  // If not authenticated, redirect to admin login page specifically
  if (!isAuthenticated) {
    console.log('Admin ProtectedRoute redirecting to admin-login');
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  // If a specific role is required, check it
  if (requiredRole && currentUser?.role !== requiredRole) {
    console.log(`Role ${requiredRole} required, but user has ${currentUser?.role}`);
    return <Navigate to="/admin" replace />;
  }

  // If a specific permission is required, check it
  if (requiredPermission && currentUser?.permissions && 
      !currentUser.permissions[requiredPermission as keyof typeof currentUser.permissions]) {
    console.log(`Permission ${requiredPermission} required, but user doesn't have it`);
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
