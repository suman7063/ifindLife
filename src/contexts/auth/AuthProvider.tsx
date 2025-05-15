
import React, { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get state from hook
  const state = useAuthState();
  
  // Get actions from hook
  const actions = useAuthActions(state, () => {});
  
  // Combine state and actions
  const value = {
    ...state,
    ...actions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
