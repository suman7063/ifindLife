
import React, { useEffect } from 'react';
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
  const { user, updatePassword, loading: supabaseLoading } = useSupabaseAuth();
  
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

  // Create the modified signup function to match our type definition
  const handleSignup = async (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => {
    return await signup({
      name: userData.name || '',
      email: email,
      phone: userData.phone || '',
      password: password,
      country: userData.country || '',
      city: userData.city,
      referralCode: referralCode
    });
  };

  // Log auth state for debugging
  useEffect(() => {
    console.log("UserAuthProvider state:", {
      hasUser: !!user,
      hasProfile: !!authState.currentUser,
      isLoading,
      isInitialized: authState.authInitialized,
      profileNotFound: authState.profileNotFound
    });
  }, [user, authState, isLoading]);

  return (
    <UserAuthContext.Provider
      value={{
        currentUser: authState.currentUser,
        isAuthenticated: !!user && !!authState.currentUser, // Require both user and profile
        login,
        signup: handleSignup,
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
        user,
        loading: isLoading || supabaseLoading
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
