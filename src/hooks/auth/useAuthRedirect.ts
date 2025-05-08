
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
        if (pendingAction.type === 'book' && pendingAction.id) {
          console.log('Found pending booking action, redirecting to expert page');
          return `/experts/${pendingAction.id}?book=true`;
        }
        if (pendingAction.path) {
          console.log('Found pending action with path, redirecting to:', pendingAction.path);
          return pendingAction.path;
        }
      } catch (error) {
        console.error('Error parsing pending action:', error);
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
    
    // For role-specific redirects
    if (role === 'expert') {
      return '/expert-dashboard';
    } else if (role === 'user') {
      return '/user-dashboard';
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
