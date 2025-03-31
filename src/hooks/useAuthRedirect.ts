
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (defaultPath: string) => {
  const navigate = useNavigate();

  /**
   * Redirects user to specified path or default path
   * @param replace Whether to replace current history entry (prevents back button going to login page)
   * @param path Optional custom path to redirect to
   */
  const redirectImmediately = useCallback((replace: boolean = true, path?: string) => {
    const redirectPath = path || defaultPath;
    console.log(`Redirecting to ${redirectPath} with replace=${replace}`);
    
    // Use direct navigation without timeout to prevent potential blocking
    navigate(redirectPath, { replace });
  }, [navigate, defaultPath]);

  return {
    redirectImmediately,
  };
};
