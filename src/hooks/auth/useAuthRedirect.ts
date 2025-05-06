
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthRedirect = (defaultRedirectPath: string = '/') => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getRedirectPath = useCallback((role?: string | null): string => {
    // First check role-specific default paths
    if (role === 'expert') {
      return '/expert-dashboard';
    } else if (role === 'user') {
      return '/user-dashboard';
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
