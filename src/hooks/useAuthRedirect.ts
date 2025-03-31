
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook that provides a function to redirect authenticated users
 * @param redirectPath - The path to redirect to
 * @returns Object containing the redirect function
 */
export const useAuthRedirect = (redirectPath: string) => {
  const navigate = useNavigate();
  
  const redirectIfAuthenticated = useCallback(() => {
    console.log(`Redirecting authenticated user to ${redirectPath}`);
    navigate(redirectPath, { replace: true });
  }, [navigate, redirectPath]);
  
  return { redirectIfAuthenticated };
};
