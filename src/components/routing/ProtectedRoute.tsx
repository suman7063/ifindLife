
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';
import type { UserRole } from '@/contexts/auth/types';
import { supabase } from '@/lib/supabase';

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
  const { isAuthenticated: contextAuthenticated, role: contextRole, isLoading: contextLoading } = useAuth();
  const [directAuthChecked, setDirectAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(contextAuthenticated);
  const [userRole, setUserRole] = useState<UserRole | null>(contextRole);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  // Direct check with Supabase - only run once
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Direct auth check with Supabase...');
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const sessionType = localStorage.getItem('sessionType') as UserRole || 'user';
          console.log('ProtectedRoute: Session found, role:', sessionType);
          setIsAuthenticated(true);
          setUserRole(sessionType);
        } else {
          console.log('ProtectedRoute: No session found');
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error in direct auth check:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setDirectAuthChecked(true);
        setIsChecking(false);
      }
    };

    // Only run the check if we're not already authenticated from context
    if (!contextAuthenticated || !contextRole) {
      checkAuth();
    } else {
      console.log('ProtectedRoute: Already authenticated from context');
      setDirectAuthChecked(true);
      setIsChecking(false);
    }
  }, [contextAuthenticated, contextRole]);

  // Use either context auth or direct auth check
  const authResolved = directAuthChecked || !contextLoading;
  const finalIsAuthenticated = contextAuthenticated || isAuthenticated;
  const finalRole = contextRole || userRole;

  if ((isChecking || contextLoading) && !authResolved) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  console.log('ProtectedRoute final check:', {
    finalIsAuthenticated,
    finalRole,
    allowedRoles,
    currentPath: location.pathname
  });

  // If not authenticated, redirect to login
  if (!finalIsAuthenticated) {
    console.log('Not authenticated, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated but not in allowed roles, redirect to appropriate dashboard
  if (finalRole && !allowedRoles.includes(finalRole)) {
    console.log(`User role ${finalRole} not in allowed roles ${allowedRoles.join(', ')}`);
    
    // Redirect based on role
    if (finalRole === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    } else if (finalRole === 'expert') {
      return <Navigate to="/expert-dashboard" replace />;
    } else if (finalRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // If authenticated and has allowed role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
