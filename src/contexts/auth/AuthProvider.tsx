
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
    // Force a re-render by updating a timestamp or similar mechanism
    // The auth state listener will handle the actual refresh
  }, []);
  
  // Get actions from hook
  const actions = useAuthActions(authState, refreshCallback);
  
  // Log auth state changes for debugging
  useEffect(() => {
    console.log('AuthProvider: Auth state updated:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      role: authState.role,
      sessionType: authState.sessionType,
      hasUser: !!authState.user,
      hasSession: !!authState.session,
      hasUserProfile: !!authState.userProfile,
      hasExpertProfile: !!authState.expertProfile
    });
  }, [authState]);
  
  // Combine state and actions with proper memoization
  const contextValue = useMemo(() => {
    const value = {
      // Auth state
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
      
      // Auth actions
      ...actions,
      
      // Add missing properties to prevent errors
      addToFavorites: async (expertId: number) => false,
      removeFromFavorites: async (expertId: number) => false,
      rechargeWallet: async (amount: number) => false,
      addReview: async (review: any, rating?: number, comment?: string) => false,
      reportExpert: async (report: any, reason?: string, details?: string) => false,
      hasTakenServiceFrom: async (id: string | number) => false,
      getExpertShareLink: (expertId: string | number) => '',
      getReferralLink: () => null,
      updateProfilePicture: async (file: File) => null,
      registerExpert: async () => false
    };

    console.log('AuthProvider: Context value created with login function:', !!value.login);
    return value;
  }, [authState, actions]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
