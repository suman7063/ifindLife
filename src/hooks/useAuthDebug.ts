
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useAuthDebug = (componentName: string) => {
  const auth = useAuth();
  
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`${componentName} received auth update:`, {
        componentName,
        hasUser: !!auth?.user,
        hasSession: !!auth?.session,
        sessionType: auth?.sessionType,
        isAuthenticated: auth?.isAuthenticated,
        isLoading: auth?.isLoading,
        authKeys: auth ? Object.keys(auth) : 'null'
      });
    }
  }, [auth, componentName]);
  
  return auth;
};
