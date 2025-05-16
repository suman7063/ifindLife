
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';
import type { UserRole } from '@/contexts/auth/types';
import { checkAuthStatus } from '@/utils/directAuth';

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
  const [directAuthData, setDirectAuthData] = useState<{
    isAuthenticated: boolean;
    role?: UserRole;
  }>({ isAuthenticated: false });
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication directly with Supabase as a fallback
  useEffect(() => {
    const verifyAuthWithSupabase = async () => {
      try {
        // Only do a direct check if context auth is not yet available
        if (!contextAuthenticated && !directAuthChecked) {
          console.log('ProtectedRoute: performing direct auth check with Supabase');
          const authData = await checkAuthStatus();
          
          if (authData.isAuthenticated) {
            const sessionType = localStorage.getItem('sessionType') as UserRole || 'user';
            console.log('ProtectedRoute: direct auth check successful, user is authenticated as:', sessionType);
            setDirectAuthData({
              isAuthenticated: true,
              role: sessionType
            });
          } else {
            console.log('ProtectedRoute: direct auth check failed, user is not authenticated');
          }
          
          setDirectAuthChecked(true);
        }
        
        // Only finish checking when we have results from both methods
        if (!contextLoading || directAuthChecked) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error in direct auth check:', error);
        setIsChecking(false);
        setDirectAuthChecked(true);
      }
    };

    verifyAuthWithSupabase();
  }, [contextAuthenticated, contextLoading, directAuthChecked]);

  // Determine final authentication state (use context if available, fallback to direct check)
  const isAuthenticated = contextAuthenticated || directAuthData.isAuthenticated;
  const role = contextRole || directAuthData.role;

  // Show loading screen while checking authentication
  if (contextLoading || isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // Log authentication details for debugging
  console.log('ProtectedRoute final check:', { 
    isAuthenticated, 
    role, 
    allowedRoles,
    contextAuthenticated,
    directAuthData,
    currentPath: location.pathname
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated but not in allowed roles, redirect to appropriate dashboard
  if (role && !allowedRoles.includes(role as UserRole)) {
    console.log(`User role ${role} not in allowed roles ${allowedRoles.join(', ')}`);
    
    // Redirect based on role
    if (role === 'user') {
      console.log('Redirecting to user dashboard');
      return <Navigate to="/user-dashboard" replace />;
    } else if (role === 'expert') {
      console.log('Redirecting to expert dashboard');
      return <Navigate to="/expert-dashboard" replace />;
    } else if (role === 'admin') {
      console.log('Redirecting to admin dashboard');
      return <Navigate to="/admin" replace />;
    }
  }

  // If authenticated and has allowed role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
