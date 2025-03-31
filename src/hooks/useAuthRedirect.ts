
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook that provides functions to handle authentication-related redirects
 * @param redirectPath - The path to redirect to
 * @returns Object containing the redirect functions
 */
export const useAuthRedirect = (redirectPath: string) => {
  const navigate = useNavigate();
  
  const redirectIfAuthenticated = useCallback(() => {
    console.log(`Redirecting authenticated user to ${redirectPath}`);
    navigate(redirectPath, { replace: true });
  }, [navigate, redirectPath]);
  
  // Automatically redirect if this hook is used with immediate=true
  const redirectImmediately = useCallback((condition: boolean = true) => {
    if (condition) {
      console.log(`Immediately redirecting to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
      return true;
    }
    return false;
  }, [navigate, redirectPath]);
  
  return { 
    redirectIfAuthenticated,
    redirectImmediately
  };
};
