
import React, { ReactNode, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get state from hook
  const state = useAuthState();
  
  // Create a refresh callback
  const refreshCallback = useCallback(() => {
    console.log('Auth state refresh triggered');
  }, []);
  
  // Get actions from hook
  const actions = useAuthActions(state, refreshCallback);
  
  // Combine state and actions
  const value = {
    ...state,
    ...actions
  };

  console.log('AuthProvider rendering with values:', {
    isAuthenticated: value.isAuthenticated,
    isLoading: value.isLoading,
    role: value.role,
    hasLogin: !!value.login
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
