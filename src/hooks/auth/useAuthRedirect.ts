
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthRedirect = (defaultRedirectPath: string = '/') => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getRedirectPath = useCallback((role?: string | null): string => {
    // Check for pending booking action in sessionStorage
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (pendingActionStr) {
      try {
        const pendingAction = JSON.parse(pendingActionStr);
        console.log('Found pending action:', pendingAction);
        
        // Clear the action after using it
        sessionStorage.removeItem('pendingAction');
        
        if (pendingAction.type === 'book' && pendingAction.expertId) {
          console.log('Redirecting to expert booking page');
          return `/experts/${pendingAction.expertId}?book=true`;
        }
        if (pendingAction.type === 'call' && pendingAction.expertId) {
          console.log('Redirecting to expert call page');
          return `/experts/${pendingAction.expertId}?call=true`;
        }
        if (pendingAction.type === 'connect' && pendingAction.expertId) {
          console.log('Redirecting to expert connect page');
          return `/experts/${pendingAction.expertId}?connect=true`;
        }
        if (pendingAction.currentPath) {
          console.log('Redirecting to stored current path:', pendingAction.currentPath);
          return pendingAction.currentPath;
        }
      } catch (error) {
        console.error('Error parsing pending action:', error);
        sessionStorage.removeItem('pendingAction');
      }
    }
    
    // Check for intended URL in state if coming from a protected route
    const state = location.state as { from?: { pathname: string } } | undefined;
    
    // First try to get from state (used when redirected from protected routes)
    if (state && state.from && state.from.pathname) {
      return state.from.pathname;
    }
    
    // Then try to get from URL search parameter (for login/register pages)
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    if (redirectParam) {
      return redirectParam;
    }
    
    // For role-specific redirects - only if no other redirect found
    if (role === 'expert') {
      return '/expert-dashboard';
    } else if (role === 'user') {
      // For users, redirect to home instead of dashboard by default
      return '/';
    }
    
    // Finally, use the default path
    return defaultRedirectPath;
  }, [location, defaultRedirectPath]);
  
  const redirectImmediately = useCallback((role?: string | null) => {
    const redirectPath = getRedirectPath(role);
    console.log(`Redirecting to: ${redirectPath}`);
    navigate(redirectPath, { replace: true });
  }, [getRedirectPath, navigate]);
  
  return {
    redirectImmediately,
    getRedirectPath
  };
};
