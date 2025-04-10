
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';
import { toast } from 'sonner';
import { AuthState, initialAuthState, UserRole } from './types';
import { useAuthAccount } from './hooks/useAuthAccount';
import { useProfile } from './hooks/useProfile';
import { useFavorites } from './hooks/useFavorites';
import { useWallet } from './hooks/useWallet';
import { useReferrals } from './hooks/useReferrals';
import { useExpertInteractions } from './hooks/useExpertInteractions';
import { UserSettings } from '@/types/user';
import { useProfileFunctions } from './hooks/useProfileFunctions';

export interface AuthContextValue {
  state: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  user: User | null;
  session: Session | null;
  role: UserRole;
  
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<boolean>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  checkIsFavorite: (expertId: string) => Promise<boolean>;
  refreshFavoritesCount: () => Promise<number | void>;
  
  getReferrals: () => Promise<any[]>;
  refreshWalletBalance: () => Promise<number>;
  addFunds: (amount: number) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  reviewExpert: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
            
            setState(prev => ({ 
              ...prev, 
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session,
              isLoading: prev.isLoading
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

  const fetchUserData = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, profileLoading: true }));
      
      const [userProfile, expertData, settings] = await Promise.all([
        fetchUserProfile(userId),
        checkExpertAccount(userId),
        fetchUserSettings(userId)
      ]);
      
      const { isExpertUser, expertId } = expertData;
      
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
      
      const favCount = await refreshFavoritesCount();
      const walletBal = await fetchWalletBalance(userId);
      const referralsList = await getReferrals();
      
      setState(prev => ({
        ...prev,
        favoritesCount: favCount || 0,
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

  const updateExpertProfile = async (data: Partial<ExpertProfile>): Promise<boolean> => {
    if (!state.user || !state.expertProfile) {
      toast.error("No authenticated expert found");
      return false;
    }
    
    try {
      setState(prev => ({ ...prev, profileLoading: true }));
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(data)
        .eq('auth_id', state.user.id);
        
      if (error) {
        console.error("Expert profile update error:", error);
        toast.error(error.message);
        return false;
      }
      
      setState(prev => ({
        ...prev,
        expertProfile: { ...prev.expertProfile!, ...data },
        profileLoading: false
      }));
      
      toast.success("Expert profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Expert profile update error:", error);
      toast.error(error.message || "An error occurred during profile update");
      setState(prev => ({ ...prev, profileLoading: false }));
      return false;
    }
  };

  const contextValue: AuthContextValue = {
    state,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    userProfile: state.userProfile,
    expertProfile: state.expertProfile,
    user: state.user,
    session: state.session,
    role: state.role,
    
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
