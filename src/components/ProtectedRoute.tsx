
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import { toast } from 'sonner';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Admin ProtectedRoute check - isAuthenticated:', isAuthenticated, 'currentUser:', currentUser);
    
    if (!isAuthenticated) {
      console.log('Admin user not authenticated, will redirect');
      toast.error('Please log in to access this page');
    }
  }, [isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    console.log('Admin ProtectedRoute redirecting to admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  // If a specific role is required, check it
  if (requiredRole && currentUser?.role !== requiredRole) {
    console.log(`Role ${requiredRole} required, but user has ${currentUser?.role}`);
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
