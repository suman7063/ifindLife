
import { useEffect } from 'react';
import { ExpertAuthState } from '../types/authStateTypes';

export const useAuthTimeoutCheck = (
  authState: ExpertAuthState,
  setAuthState: React.Dispatch<React.SetStateAction<ExpertAuthState>>
) => {
  // Add a timeout to complete auth loading if it takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (authState.loading) {
        console.log('Auth loading timeout reached, forcing completion');
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
        }));
      }
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [authState.loading, setAuthState]);
};
