
import React, { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import PostLoginRedirectSystem from '@/utils/postLoginRedirect';

interface AuthHandlerProps {
  children: ReactNode;
}

const AuthHandler: React.FC<AuthHandlerProps> = ({ children }) => {
  const { isAuthenticated, isLoading, sessionType, user } = useEnhancedUnifiedAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('🔒 AuthHandler - Current state:', {
      isAuthenticated: Boolean(isAuthenticated),
      isLoading: Boolean(isLoading),
      sessionType,
      hasUser: Boolean(user),
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });
    
    // Only handle redirects when auth state is stable (not loading)
    if (!isLoading && isAuthenticated && user) {
      console.log('🔒 AuthHandler - User authenticated, checking redirect needs');
      
      // Handle post-login redirects
      if (location.pathname.includes('/login')) {
        console.log('🔒 AuthHandler - User on login page, executing redirect logic');
        
        setTimeout(async () => {
          const redirectExecuted = await PostLoginRedirectSystem.executeRedirect();
          
          if (!redirectExecuted) {
            console.log('🔒 AuthHandler - No redirect data, going to appropriate dashboard');
            const defaultPath = sessionType === 'expert' ? '/expert-dashboard' : 
                              sessionType === 'admin' ? '/admin-dashboard' : 
                              '/user-dashboard';
            navigate(defaultPath, { replace: true });
          }
        }, 100);
      }
    }
  }, [isAuthenticated, isLoading, sessionType, user, location.pathname, navigate]);
  
  return <>{children}</>;
};

export default AuthHandler;
