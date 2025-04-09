
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';
import { AuthState } from './types';
import { useAuthAccount } from './hooks/useAuthAccount';
import { useProfile } from './hooks/useProfile';
import { useFavorites } from './hooks/useFavorites';
import { useWallet } from './hooks/useWallet';
import { useReferrals } from './hooks/useReferrals';
import { useExpertInteractions } from './hooks/useExpertInteractions';
import { UserSettings } from '@/types/user';

// Create the context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (data: any) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<boolean>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  checkIsFavorite: (expertId: string) => Promise<boolean>;
  refreshFavoritesCount: () => Promise<void>;
  getReferrals: () => Promise<any[]>;
  refreshWalletBalance: () => Promise<number>;
  addFunds: (amount: number) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  reviewExpert: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
}>({
  state: {
    user: null,
    session: null,
    userProfile: null,
    expertProfile: null,
    isAuthenticated: false,
    isLoading: true,
    hasProfile: false,
    profileLoading: false,
    authError: null,
    profileError: null,
    role: null,
    isExpertUser: false,
    expertId: null,
    favoritesCount: 0,
    referrals: [],
    userSettings: null,
    walletBalance: 0
  },
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  updateUserProfile: async () => false,
  updateExpertProfile: async () => false,
  updatePassword: async () => false,
  updateEmail: async () => false,
  resetPassword: async () => false,
  sendVerificationEmail: async () => false,
  updateUserSettings: async () => false,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  checkIsFavorite: async () => false,
  refreshFavoritesCount: async () => {},
  getReferrals: async () => [],
  refreshWalletBalance: async () => 0,
  addFunds: async () => false,
  deductFunds: async () => false,
  reportExpert: async () => false,
  reviewExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => '',
  getReferralLink: () => null
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    userProfile: null,
    expertProfile: null,
    isAuthenticated: false,
    isLoading: true,
    hasProfile: false,
    profileLoading: false,
    authError: null,
    profileError: null,
    role: null,
    isExpertUser: false,
    expertId: null,
    favoritesCount: 0,
    referrals: [],
    userSettings: null,
    walletBalance: 0
  });

  const { 
    authLoading, 
    authError, 
    login: authLogin, 
    signup: authSignup, 
    logout: authLogout,
    updateEmail: authUpdateEmail,
    updatePassword: authUpdatePassword,
    resetPassword: authResetPassword,
    sendVerificationEmail: authSendVerification,
    checkExpertAccount
  } = useAuthAccount();

  const {
    updateProfile,
    updateUserSettings,
    fetchUserProfile,
    fetchUserSettings
  } = useProfile(state.user, (profile) => {
    setState(prev => ({ ...prev, userProfile: profile }));
  });

  const {
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
    refreshFavoritesCount
  } = useFavorites(state.user);

  const {
    walletBalance,
    fetchWalletBalance,
    refreshWalletBalance,
    addFunds,
    deductFunds
  } = useWallet(state.user);

  const {
    referrals,
    getReferrals,
    getReferralLink
  } = useReferrals(state.user);

  const {
    reportExpert,
    reviewExpert,
    hasTakenServiceFrom,
    getExpertShareLink
  } = useExpertInteractions(state.user);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
            
            setState(prev => ({ 
              ...prev, 
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session,
              isLoading: prev.isLoading // Don't change loading state here
            }));
            
            if (session?.user) {
              setTimeout(async () => {
                await fetchUserData(session.user.id);
              }, 0); 
            } else {
              setState(prev => ({ 
                ...prev,
                userProfile: null,
                expertProfile: null,
                hasProfile: false,
                role: null,
                isExpertUser: false,
                expertId: null
              }));
            }
          }
        );

        // THEN check for existing session
        const { data } = await supabase.auth.getSession();
        setState(prev => ({ 
          ...prev, 
          session: data.session,
          user: data.session?.user ?? null,
          isAuthenticated: !!data.session,
        }));
        
        if (data.session?.user) {
          await fetchUserData(data.session.user.id);
        }
        
        setState(prev => ({ ...prev, isLoading: false }));
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ ...prev, isLoading: false, authError: 'Failed to initialize authentication' }));
      }
    };

    initAuth();
  }, []);

  // Fetch all user data
  const fetchUserData = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, profileLoading: true }));
      
      // Fetch profile and determine if user is also an expert
      const [userProfile, expertData, settings] = await Promise.all([
        fetchUserProfile(userId),
        checkExpertAccount(userId),
        fetchUserSettings(userId)
      ]);
      
      const { isExpertUser, expertId } = expertData;
      
      // Update state with user and expert data
      setState(prev => ({ 
        ...prev, 
        userProfile,
        hasProfile: !!userProfile,
        isExpertUser,
        expertId,
        role: isExpertUser ? 'expert' : 'user',
        userSettings: settings,
        profileError: null
      }));
      
      // Now fetch non-critical data
      const [favCount, walletBal, referralsList] = await Promise.all([
        refreshFavoritesCount(),
        fetchWalletBalance(userId),
        getReferrals()
      ]);
      
      // Update state with additional data
      setState(prev => ({
        ...prev,
        favoritesCount: favCount ?? 0,
        walletBalance: walletBal,
        referrals: referralsList
      }));
      
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setState(prev => ({ 
        ...prev, 
        profileError: error.message || 'Failed to load user data'
      }));
      toast.error('Failed to load user data');
    } finally {
      setState(prev => ({ ...prev, profileLoading: false }));
    }
  };

  // Auth handlers with state updates
  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, authLoading: true }));
    const success = await authLogin(email, password);
    setState(prev => ({ 
      ...prev, 
      authLoading: false,
      authError: authError
    }));
    return success;
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, authLoading: true }));
    const success = await authSignup(email, password, userData, referralCode);
    setState(prev => ({ 
      ...prev, 
      authLoading: false,
      authError: authError
    }));
    return success;
  };

  const logout = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, authLoading: true }));
    const success = await authLogout();
    if (success) {
      setState({
        user: null,
        session: null,
        userProfile: null,
        expertProfile: null,
        isAuthenticated: false,
        isLoading: false,
        hasProfile: false,
        profileLoading: false,
        authLoading: false,
        authError: null,
        profileError: null,
        role: null,
        isExpertUser: false,
        expertId: null,
        favoritesCount: 0,
        referrals: [],
        userSettings: null,
        walletBalance: 0
      });
    } else {
      setState(prev => ({ ...prev, authLoading: false }));
    }
    return success;
  };

  const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    setState(prev => ({ ...prev, profileLoading: true }));
    const success = await updateProfile(data);
    if (success && state.userProfile) {
      setState(prev => ({ 
        ...prev, 
        userProfile: { ...prev.userProfile!, ...data },
        profileLoading: false 
      }));
    } else {
      setState(prev => ({ ...prev, profileLoading: false }));
    }
    return success;
  };

  // Placeholder for expert profile update
  const updateExpertProfile = async (data: any): Promise<boolean> => {
    // This would be implemented when expert functionality is needed
    toast.info('Expert profile update not implemented yet');
    return false;
  };
  
  const contextValue = {
    state: {
      ...state,
      authLoading,
    },
    login,
    signup,
    logout,
    updateUserProfile,
    updateExpertProfile,
    updatePassword: (password: string) => authUpdatePassword(password, state.user),
    updateEmail: (email: string) => authUpdateEmail(email, state.user),
    resetPassword: authResetPassword,
    sendVerificationEmail: () => authSendVerification(state.user),
    updateUserSettings,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
    refreshFavoritesCount,
    getReferrals,
    refreshWalletBalance,
    addFunds,
    deductFunds,
    reportExpert,
    reviewExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
