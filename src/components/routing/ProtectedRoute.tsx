
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user', 'expert', 'admin'], 
  redirectPath = '/login' 
}) => {
  const [authState, setAuthState] = useState<{
    isChecking: boolean;
    isAuthenticated: boolean;
    role?: string;
  }>({
    isChecking: true,
    isAuthenticated: false
  });
  
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking authentication...');
        const { data } = await supabase.auth.getSession();
        
        const sessionExists = !!data.session;
        
        // Get role from local storage as a fallback
        const storedRole = localStorage.getItem('sessionType') || 'user';
        
        console.log('ProtectedRoute: Auth check result:', { 
          sessionExists, 
          storedRole 
        });
        
        setAuthState({
          isChecking: false,
          isAuthenticated: sessionExists,
          role: storedRole
        });
        
        if (!sessionExists) {
          toast.error('Please log in to access this page');
        }
      } catch (error) {
        console.error('ProtectedRoute: Error checking authentication:', error);
        setAuthState({
          isChecking: false,
          isAuthenticated: false
        });
        toast.error('Authentication error. Please log in again.');
      }
    };
    
    checkAuth();
  }, []);
  
  // Show loading while checking
  if (authState.isChecking) {
    return <LoadingScreen message="Verifying your access..." />;
  }
  
  console.log('ProtectedRoute: Auth state resolved:', {
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,
    allowedRoles,
    currentPath: location.pathname
  });
  
  // Not authenticated at all
  if (!authState.isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Check for required roles
  if (authState.role && allowedRoles.length > 0 && !allowedRoles.includes(authState.role)) {
    console.log(`ProtectedRoute: User role ${authState.role} not in allowed roles ${allowedRoles.join(', ')}`);
    
    // Redirect based on actual role
    if (authState.role === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    } else if (authState.role === 'expert') {
      return <Navigate to="/expert-dashboard" replace />;
    } else if (authState.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }
  
  // All checks passed
  return <>{children}</>;
};

export default ProtectedRoute;
