
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get state from hook
  const authState = useAuthState();
  
  // Create a refresh callback
  const refreshCallback = useCallback(() => {
    console.log('Auth state refresh triggered');
    // The refresh will be handled by the auth state listener
  }, []);
  
  // Get actions from hook
  const actions = useAuthActions(authState, refreshCallback);
  
  // Verify login function exists and log initialization
  useEffect(() => {
    console.log('AuthProvider: Initializing with state:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      role: authState.role,
      hasUserProfile: !!authState.userProfile,
      hasExpertProfile: !!authState.expertProfile,
      sessionType: authState.sessionType
    });

    console.log('AuthProvider: Actions initialized:', {
      hasLogin: !!actions.login,
      loginType: typeof actions.login,
      hasSignup: !!actions.signup,
      hasLogout: !!actions.logout
    });
  }, [authState, actions]);
  
  // Combine state and actions with proper memoization
  const contextValue = useMemo(() => {
    const value = {
      user: authState.user,
      session: authState.session,
      userProfile: authState.userProfile,
      expertProfile: authState.expertProfile,
      profile: authState.profile,
      sessionType: authState.sessionType,
      isLoading: authState.isLoading,
      isAuthenticated: authState.isAuthenticated,
      role: authState.role,
      error: authState.error,
      walletBalance: authState.walletBalance,
      hasUserAccount: authState.hasUserAccount,
      ...actions
    };

    console.log('Auth context providing value:', {
      hasUser: !!value.user,
      hasSession: !!value.session,
      sessionType: value.sessionType,
      isAuthenticated: value.isAuthenticated,
      isLoading: value.isLoading,
      hasLoginFunction: !!value.login
    });

    return value;
  }, [authState, actions]);

  console.log('AuthProvider rendering with login function:', !!contextValue.login);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
