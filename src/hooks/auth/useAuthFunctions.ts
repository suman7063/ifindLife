import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '@/contexts/auth/types';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export function useAuthFunctions(
  authState: AuthState, 
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) {
  const [processingAuth, setProcessingAuth] = useState(false);

  // Authentication functions
  const login = async (email: string, password: string, loginAs?: 'user' | 'expert'): Promise<boolean> => {
    try {
      setProcessingAuth(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Session is handled by the onAuthStateChanged listener
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setProcessingAuth(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Session clearing is handled by the onAuthStateChanged listener
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData?: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setProcessingAuth(true);
      
      // First, sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name,
            email: email,
            // Add other user metadata as needed
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Additional profile data will be inserted by the database trigger
      // that watches for new auth.users entries

      // Handle referral if code provided
      if (referralCode) {
        try {
          // Process referral code here
          console.log('Processing referral code:', referralCode);
          // This would typically involve updating the user's profile and 
          // the referrer's wallet balance, etc.
        } catch (refError: any) {
          console.error('Referral processing error:', refError);
          // Don't fail signup if referral processing fails
        }
      }

      return true;
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed');
      return false;
    } finally {
      setProcessingAuth(false);
    }
  };
  
  // Profile management functions
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id);
        
      if (error) throw error;
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile as UserProfile,
          ...updates
        },
        profile: {
          ...prev.profile as UserProfile,
          ...updates
        }
      }));
      
      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      return false;
    }
  };
  
  const updateExpertProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('auth_id', authState.user.id);
        
      if (error) throw error;
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        expertProfile: {
          ...prev.expertProfile as ExpertProfile,
          ...updates
        }
      }));
      
      toast.success('Expert profile updated successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update expert profile');
      return false;
    }
  };
  
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
      return false;
    }
  };
  
  const updateProfilePicture = async (file: File): Promise<string | null> => {
    try {
      if (!authState.user) return null;
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${authState.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile_pictures/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Update profile with new picture URL
      const isUser = authState.role === 'user';
      const table = isUser ? 'profiles' : 'expert_accounts';
      const idField = isUser ? 'id' : 'auth_id';
      
      const { error: updateError } = await supabase
        .from(table)
        .update({ profile_picture: publicUrl })
        .eq(idField, authState.user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        userProfile: prev.userProfile ? {
          ...prev.userProfile,
          profile_picture: publicUrl
        } : null,
        profile: prev.profile ? {
          ...prev.profile,
          profile_picture: publicUrl
        } : null,
        expertProfile: prev.expertProfile ? {
          ...prev.expertProfile,
          profile_picture: publicUrl
        } : null
      }));
      
      toast.success('Profile picture updated!');
      return publicUrl;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile picture');
      return null;
    }
  };
  
  // Favorites management
  const addToFavorites = async (expertId: string | number): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: authState.user.id,
          expert_id: typeof expertId === 'string' ? parseInt(expertId) : expertId
        });
        
      if (error) throw error;
      
      toast.success('Added to favorites!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
      return false;
    }
  };
  
  const removeFromFavorites = async (expertId: string | number): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ 
          user_id: authState.user.id,
          expert_id: typeof expertId === 'string' ? parseInt(expertId) : expertId  
        });
        
      if (error) throw error;
      
      toast.success('Removed from favorites!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
      return false;
    }
  };
  
  // Wallet management
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    try {
      if (!authState.user || !authState.userProfile) return false;
      
      // In a real app, you would integrate with a payment gateway here
      // For now, we'll just update the balance directly for demo purposes
      
      const newBalance = (authState.userProfile.wallet_balance || 0) + amount;
      
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', authState.user.id);
        
      if (error) throw error;
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        userProfile: prev.userProfile ? {
          ...prev.userProfile,
          wallet_balance: newBalance
        } : null,
        profile: prev.profile ? {
          ...prev.profile,
          wallet_balance: newBalance
        } : null,
        walletBalance: newBalance
      }));
      
      // Record transaction
      await supabase.from('user_transactions').insert({
        user_id: authState.user.id,
        amount,
        type: 'deposit',
        date: new Date().toISOString(),
        currency: authState.userProfile.currency || 'USD',
        description: 'Wallet recharge'
      });
      
      toast.success(`Added ${amount} to your wallet!`);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Wallet recharge failed');
      return false;
    }
  };
  
  // Reviews and reporting
  const addReview = async (reviewData: any): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const review = {
        user_id: authState.user.id,
        expert_id: reviewData.expertId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString(),
        verified: !!reviewData.verified
      };
      
      const { error } = await supabase
        .from('user_reviews')
        .insert(review);
        
      if (error) throw error;
      
      toast.success('Review submitted successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
      return false;
    }
  };
  
  const reportExpert = async (reportData: any): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const report = {
        user_id: authState.user.id,
        expert_id: reportData.expertId,
        reason: reportData.reason,
        details: reportData.details,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      const { error } = await supabase
        .from('user_reports')
        .insert(report);
        
      if (error) throw error;
      
      toast.success('Report submitted. Our team will review it shortly.');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
      return false;
    }
  };
  
  // Service verification
  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('*')
        .eq('user_id', authState.user.id)
        .eq('expert_id', typeof expertId === 'number' ? expertId.toString() : expertId)
        .eq('status', 'completed')
        .limit(1);
        
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error: any) {
      console.error('Error checking service history:', error);
      return false;
    }
  };
  
  // Linking methods
  const getExpertShareLink = (expertId: string | number): string => {
    // Generate a share link for the expert's profile
    const baseUrl = window.location.origin;
    return `${baseUrl}/expert/${expertId}`;
  };
  
  const getReferralLink = (): string | null => {
    // Generate a referral link using the user's referral code
    if (!authState.userProfile?.referral_code) return null;
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${authState.userProfile.referral_code}`;
  };

  return {
    login,
    logout,
    signup,
    updateProfile,
    updateExpertProfile,
    updatePassword,
    updateProfilePicture,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };
}
