
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authenticate, UserRole } from '@/modules/authentication';
import LoadingScreen from '@/components/auth/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user', 'expert', 'admin'], 
  redirectPath = '/user-login'
}) => {
  const [authState, setAuthState] = useState<{
    isChecking: boolean;
    isAuthenticated: boolean;
    role?: UserRole;
    checkAttempted: boolean;
  }>({
    isChecking: true,
    isAuthenticated: false,
    checkAttempted: false
  });
  
  const location = useLocation();
  
  useEffect(() => {
    // Prevent multiple check attempts
    if (authState.checkAttempted) return;
    
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking authentication...');
        const result = await authenticate.checkSession();
        
        console.log('ProtectedRoute: Auth check result:', result);
        
        setAuthState({
          isChecking: false,
          isAuthenticated: result.isAuthenticated,
          role: result.role,
          checkAttempted: true
        });
      } catch (error) {
        console.error('ProtectedRoute: Error checking authentication:', error);
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          checkAttempted: true
        });
      }
    };
    
    checkAuth();
  }, [authState.checkAttempted]);
  
  // Show loading while checking
  if (authState.isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
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
  if (authState.role && !allowedRoles.includes(authState.role)) {
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
