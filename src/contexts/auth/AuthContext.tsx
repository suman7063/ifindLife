
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState } from './types';
import { useAuthState } from './hooks/useAuthState';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';
import { getUserDisplayName } from '@/utils/profileConverters';
import { toast } from 'sonner';

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authState, setAuthState, fetchUserData } = useAuthState();
  
  // Login method
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    }
  };

  // Register method
  const signup = async (email: string, password: string, userData?: any, referralCode?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            referred_by: referralCode
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast.error(error.message);
        return false;
      }

      toast.success('Account created! Please check your email for verification.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred during signup');
      return false;
    }
  };

  // Logout method
  const logout = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      return false;
    }
  };

  // Update profile method
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Error updating profile:', error.message);
        toast.error(error.message);
        return false;
      }
      
      // Refresh user data
      if (authState.user) {
        await fetchUserData(authState.user);
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    }
  };

  // Update password method
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Error updating password:', error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred while updating your password');
      return false;
    }
  };

  // Update profile picture
  const updateProfilePicture = async (file: File): Promise<string | null> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to update your profile picture');
        return null;
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${authState.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile_pictures/${fileName}`;
      
      // Upload file to Supabase storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (storageError) {
        console.error('Error uploading file:', storageError.message);
        toast.error(storageError.message);
        return null;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Update profile with new picture URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', authState.user.id);
        
      if (updateError) {
        console.error('Error updating profile:', updateError.message);
        toast.error(updateError.message);
        return null;
      }
      
      // Refresh user data
      if (authState.user) {
        await fetchUserData(authState.user);
      }
      
      toast.success('Profile picture updated successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('An error occurred while updating your profile picture');
      return null;
    }
  };

  // Add to favorites
  const addToFavorites = async (expertId: number): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to add favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: authState.user.id,
          expert_id: expertId
        });
        
      if (error) {
        console.error('Error adding favorite:', error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('An error occurred while adding to favorites');
      return false;
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to remove favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', authState.user.id)
        .eq('expert_id', expertId);
        
      if (error) {
        console.error('Error removing favorite:', error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('An error occurred while removing from favorites');
      return false;
    }
  };

  // Recharge wallet
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to recharge your wallet');
        return false;
      }
      
      // First, get current wallet balance
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', authState.user.id)
        .single();
        
      if (fetchError) {
        console.error('Error fetching wallet balance:', fetchError.message);
        toast.error(fetchError.message);
        return false;
      }
      
      const currentBalance = userData?.wallet_balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update wallet balance
      const { error: updateError } = await supabase
        .from('users')
        .update({ wallet_balance: newBalance })
        .eq('id', authState.user.id);
        
      if (updateError) {
        console.error('Error updating wallet balance:', updateError.message);
        toast.error(updateError.message);
        return false;
      }
      
      // Record transaction
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          user_id: authState.user.id,
          amount,
          date: new Date().toISOString(),
          type: 'credit',
          currency: 'USD',
          description: 'Wallet recharge'
        });
        
      if (transactionError) {
        console.error('Error recording transaction:', transactionError.message);
        // Don't fail the entire operation if just the transaction record fails
      }
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        walletBalance: newBalance,
        profile: prev.profile ? { ...prev.profile, wallet_balance: newBalance } : null
      }));
      
      toast.success(`Wallet recharged with $${amount}`);
      return true;
    } catch (error) {
      console.error('Error recharging wallet:', error);
      toast.error('An error occurred while recharging your wallet');
      return false;
    }
  };

  // Add a review
  const addReview = async (review: any): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to leave a review');
        return false;
      }
      
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          ...review,
          user_id: authState.user.id,
          date: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error adding review:', error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Review submitted successfully');
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('An error occurred while submitting your review');
      return false;
    }
  };

  // Report an expert
  const reportExpert = async (report: any): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to report an expert');
        return false;
      }
      
      const { error } = await supabase
        .from('user_reports')
        .insert({
          ...report,
          user_id: authState.user.id,
          date: new Date().toISOString(),
          status: 'pending'
        });
        
      if (error) {
        console.error('Error reporting expert:', error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      toast.error('An error occurred while submitting your report');
      return false;
    }
  };

  // Check if user has taken a service from an expert
  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    try {
      if (!authState.user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', authState.user.id)
        .eq('expert_id', expertId)
        .limit(1);
        
      if (error) {
        console.error('Error checking service history:', error.message);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    }
  };

  // Get expert share link
  const getExpertShareLink = (expertId: string | number): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
  };

  // Get referral link
  const getReferralLink = (): string | null => {
    if (!authState.profile || !authState.profile.referral_code) {
      return null;
    }
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${authState.profile.referral_code}`;
  };

  // Clear session
  const clearSession = () => {
    setAuthState(prev => ({
      ...prev,
      user: null,
      session: null,
      profile: null,
      userProfile: null,
      expertProfile: null,
      isAuthenticated: false,
      role: null,
      sessionType: 'none'
    }));
  };

  // Provide the auth context value
  const authContextValue = {
    ...authState,
    signIn: login,
    signUp: signup,
    signOut: logout,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    updateProfilePicture,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    clearSession,
    userProfile: authState.profile // Alias for backward compatibility
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
