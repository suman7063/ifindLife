
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthRedirect = (defaultRedirectPath: string = '/') => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getRedirectPath = (): string => {
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
  };
  
  const redirectImmediately = () => {
    const redirectPath = getRedirectPath();
    console.log(`Redirecting to: ${redirectPath}`);
    navigate(redirectPath, { replace: true });
  };
  
  return {
    redirectImmediately,
    getRedirectPath
  };
};
