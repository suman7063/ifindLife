
import React, { ReactNode, useCallback, useEffect } from 'react';
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
  
  // Verify login function exists
  useEffect(() => {
    if (!actions.login || typeof actions.login !== 'function') {
      console.error('AuthProvider: login function is missing or not a function:', {
        loginExists: !!actions.login,
        loginType: typeof actions.login
      });
    } else {
      console.log('AuthProvider: login function initialized correctly');
    }
  }, [actions.login]);
  
  // Combine state and actions
  const value = {
    ...state,
    ...actions
  };

  console.log('AuthProvider rendering with values:', {
    isAuthenticated: value.isAuthenticated,
    isLoading: value.isLoading,
    role: value.role,
    hasLogin: !!value.login,
    loginType: typeof value.login,
    actionKeys: Object.keys(actions)
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
