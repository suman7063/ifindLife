
import React, { useEffect, useCallback } from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { UserProfile } from '@/types/supabase';
import { useProfileManagement } from './useProfileManagement';
import { useExpertInteractions } from './useExpertInteractions';
import { useWalletManagement } from './useWalletManagement';
import { useAuthInitialization } from './hooks/useAuthInitialization';
import { useAuthSessionEffects } from './hooks/useAuthSessionEffects';
import { useAuthActions } from './hooks/useAuthActions';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state using our custom hooks
  const [authState, setCurrentUser, fetchProfile, setAuthLoading] = useAuthInitialization();
  const { login, signup, logout, actionLoading } = useAuthActions(fetchProfile);
  const { user, updatePassword } = useSupabaseAuth();
  
  // Set up session effects - pass the setAuthLoading function to allow direct control
  useAuthSessionEffects(authState, fetchProfile, setAuthLoading);

  // Import functionality from separate hooks
  const { updateProfile, updateProfilePicture } = useProfileManagement(authState.currentUser, setCurrentUser);
  const { 
    addToFavorites, 
    removeFromFavorites, 
    addReview, 
    reportExpert, 
    hasTakenServiceFrom, 
    getExpertShareLink 
  } = useExpertInteractions(authState.currentUser, setCurrentUser);
  const { rechargeWallet, getReferralLink } = useWalletManagement(authState.currentUser);

  // Combine loading states
  const isLoading = authState.authLoading || actionLoading;

  // Add a timeout effect to prevent infinite loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (authState.authLoading) {
      timeoutId = setTimeout(() => {
        console.log("Force completing auth loading after timeout");
        setAuthLoading(false);
      }, 3000); // 3 second maximum loading time
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authState.authLoading, setAuthLoading]);

  return (
    <UserAuthContext.Provider
      value={{
        currentUser: authState.currentUser,
        isAuthenticated: !!user, // Use Supabase user directly
        login,
        signup,
        logout,
        authLoading: isLoading,
        profileNotFound: authState.profileNotFound,
        updateProfile,
        updateProfilePicture,
        updatePassword,
        addToFavorites,
        removeFromFavorites,
        rechargeWallet,
        addReview,
        reportExpert,
        getExpertShareLink,
        hasTakenServiceFrom,
        getReferralLink,
        user
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
