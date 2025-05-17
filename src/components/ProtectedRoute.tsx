
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import { toast } from 'sonner';
import { hasPermission, isSuperAdmin } from './admin/utils/permissionUtils';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
};

/**
 * A component that protects routes by checking user authentication and permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission
}) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Admin ProtectedRoute check:', { 
      isAuthenticated, 
      isLoading, 
      currentUser: currentUser?.username, 
      requiredRole, 
      requiredPermission 
    });
    
    if (!isLoading && !isAuthenticated) {
      console.log('Admin user not authenticated, will redirect');
      toast.error('Please log in to access this page');
    } else if (!isLoading && requiredRole && currentUser?.role !== requiredRole && !isSuperAdmin(currentUser)) {
      console.log(`Required role: ${requiredRole}, but user has role: ${currentUser?.role}`);
      toast.error(`You need ${requiredRole} permissions to access this page`);
    } else if (!isLoading && requiredPermission && !hasPermission(currentUser, requiredPermission)) {
      console.log(`Required permission: ${requiredPermission}, but user doesn't have it`);
      toast.error(`You don't have permission to access this page`);
    }
  }, [isAuthenticated, isLoading, currentUser, requiredRole, requiredPermission]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  // If not authenticated, redirect to admin login page specifically
  if (!isAuthenticated) {
    console.log('Admin ProtectedRoute redirecting to admin-login');
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  // If a specific role is required, check it (but superadmins always pass)
  if (requiredRole && currentUser?.role !== requiredRole && !isSuperAdmin(currentUser)) {
    console.log(`Role ${requiredRole} required, but user has ${currentUser?.role}`);
    return <Navigate to="/admin" replace />;
  }

  // If a specific permission is required, check it
  if (requiredPermission && !hasPermission(currentUser, requiredPermission)) {
    console.log(`Permission ${requiredPermission} required, but user doesn't have it`);
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
