
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Import hooks
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';
import { useProfileFunctions } from './hooks/useProfileFunctions';
import { useExpertInteractions } from './hooks/useExpertInteractions';

// Import types
import { AuthState, UserProfile, UserRole, ExpertProfile, AuthStatus } from './types';
import { supabase } from '@/lib/supabase';
import { ensureStringId } from '@/utils/idConverters';

// Define AuthContextType interface
export interface AuthContextType {
  // Authentication state
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  authStatus: AuthStatus;
  userProfile: UserProfile | null; // For backward compatibility
  profile: UserProfile | null;
  role: UserRole;
  expertProfile: ExpertProfile | null;
  walletBalance: number;
  sessionType?: 'none' | 'user' | 'expert' | 'dual';
  
  // Authentication methods
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  loginWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>; // Alias for backward compatibility
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<{ error: Error | null }>;
  
  // User profile methods
  getUserDisplayName: () => string;
  fetchProfile: () => Promise<UserProfile | null>;
  
  // Wallet methods
  addFunds: (amount: number) => Promise<{ error: Error | null }>;
  updateWalletBalance: (newBalance: number) => Promise<{ error: Error | null }>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  
  // Expert methods
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<{ error: Error | null }>;
  fetchExpertProfile: () => Promise<ExpertProfile | null>;
  registerAsExpert: (data: any) => Promise<{ error: Error | null }>;
  
  // User actions
  addReview: (reviewData: any) => Promise<boolean>;
  reportExpert: (reportData: any) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
  
  // Favorites
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
};

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth state from hook
  const {
    authState,
    setAuthState,
    checkUserRole,
    fetchUserData
  } = useAuthState();
  
  // Extract state properties
  const {
    isLoading,
    isAuthenticated,
    user,
    session,
    authStatus,
    userProfile,
    profile,
    role,
    expertProfile,
    walletBalance,
    sessionType
  } = authState;
  
  // Auth actions
  const { 
    login,
    signup,
    logout,
    actionLoading
  } = useAuthActions(fetchUserData); // Fixed: Pass the function without calling it
  
  // Profile functions
  const {
    updateProfile: updateProfileFn,
    getUserDisplayName,
    fetchProfile: fetchProfileFn,
    addFunds,
    updateWalletBalance
  } = useProfileFunctions(user, session, fetchUserData, checkUserRole); // Fixed: Pass all required arguments
  
  // Expert interactions
  const {
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  } = useExpertInteractions(profile?.id);

  // Wrapper for fetchProfile to match the expected interface
  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return fetchProfileFn();
  };

  // Default implementations for missing methods
  const loginWithOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error: error ? new Error(error.message) : null };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: error ? new Error(error.message) : null };
    } catch (error: any) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return !error;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      return { error: error ? new Error(error.message) : null };
    } catch (error: any) {
      return { error };
    }
  };

  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      return { error: error ? new Error(error.message) : null };
    } catch (error: any) {
      return { error };
    }
  };

  const updateExpertProfile = async (updates: Partial<ExpertProfile>) => {
    try {
      if (!user) return { error: new Error('No authenticated user') };
      
      // Ensure ID is string
      const updatedData = { ...updates };
      if (updatedData.id !== undefined) {
        updatedData.id = ensureStringId(updatedData.id);
      }
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(updatedData)
        .eq('auth_id', user.id);
        
      return { error: error ? new Error(error.message) : null };
    } catch (error: any) {
      return { error };
    }
  };

  const fetchExpertProfile = async () => {
    try {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      return null;
    }
  };

  const registerAsExpert = async (data: any) => {
    try {
      if (!user) return { error: new Error('No authenticated user') };
      
      const { error } = await supabase
        .from('expert_accounts')
        .insert({
          ...data,
          auth_id: user.id,
          status: 'pending'
        });
        
      return { error: error ? new Error(error.message) : null };
    } catch (error: any) {
      return { error };
    }
  };

  // Update signup function to match interface
  const wrappedSignup = async (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string): Promise<boolean> => {
    try {
      // Convert parameters to the format expected by the original signup function
      const signupData = {
        email,
        password,
        name: userData?.name || email.split('@')[0],
        phone: userData?.phone || '',
        country: userData?.country || '',
        city: userData?.city || '',
        referralCode: referralCode || ''
      };
      
      // Call the original signup function
      return await signup(signupData);
    } catch (error) {
      console.error('Error in wrapped signup:', error);
      return false;
    }
  };
  
  // Wrapper for logout to match the expected interface
  const wrappedLogout = async (): Promise<{ error: Error | null }> => {
    try {
      const success = await logout();
      return { error: success ? null : new Error('Logout failed') };
    } catch (error: any) {
      return { error };
    }
  };
  
  // Wrapper for updateProfile to match the expected interface
  const wrappedUpdateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const { error } = await updateProfileFn(updates);
      return !error;
    } catch (error) {
      console.error('Error in wrapped updateProfile:', error);
      return false;
    }
  };
  
  // Wrapper for updateUserProfile to match the expected interface (alias for updateProfile)
  const wrappedUpdateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    return wrappedUpdateProfile(updates);
  };

  // Alias methods for backward compatibility
  const rechargeWallet = async (amount: number) => {
    const { error } = await addFunds(amount);
    return !error;
  };
  
  // Add favorite methods
  const addToFavorites = async (expertId: number) => {
    try {
      if (!user) return false;
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, expert_id: expertId });
        
      return !error;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };
  
  const removeFromFavorites = async (expertId: number) => {
    try {
      if (!user) return false;
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('expert_id', expertId);
        
      return !error;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  // Combined context value
  const contextValue: AuthContextType = {
    // Auth state
    isLoading,
    isAuthenticated,
    user,
    session,
    authStatus,
    profile,
    userProfile: profile, // Alias for backward compatibility
    role,
    expertProfile,
    walletBalance,
    sessionType,
    
    // Auth methods
    login,
    loginWithOtp,
    signup: wrappedSignup,
    logout: wrappedLogout,
    resetPassword,
    updateProfile: wrappedUpdateProfile,
    updateUserProfile: wrappedUpdateUserProfile, // Alias for backward compatibility
    updatePassword,
    updateEmail,
    refreshSession,
    
    // Profile methods
    getUserDisplayName,
    fetchProfile,
    addFunds,
    updateWalletBalance,
    rechargeWallet,
    
    // Expert methods
    updateExpertProfile,
    fetchExpertProfile,
    registerAsExpert,
    
    // User actions
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    
    // Favorites
    addToFavorites,
    removeFromFavorites
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook for easy use
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
