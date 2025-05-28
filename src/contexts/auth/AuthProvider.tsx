
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
    // The refresh will be handled by the auth state listener
  }, []);
  
  // Get actions from hook
  const actions = useAuthActions(state, refreshCallback);
  
  // Verify login function exists and log initialization
  useEffect(() => {
    console.log('AuthProvider: Initializing with state:', {
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      role: state.role,
      hasUserProfile: !!state.userProfile,
      hasExpertProfile: !!state.expertProfile,
      sessionType: state.sessionType
    });

    console.log('AuthProvider: Actions initialized:', {
      hasLogin: !!actions.login,
      loginType: typeof actions.login,
      hasSignup: !!actions.signup,
      hasLogout: !!actions.logout
    });
  }, [state, actions]);
  
  // Combine state and actions
  const value = {
    ...state,
    ...actions,
    hasUserAccount: state.hasUserAccount || false
  };

  console.log('AuthProvider rendering with login function:', !!value.login);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
