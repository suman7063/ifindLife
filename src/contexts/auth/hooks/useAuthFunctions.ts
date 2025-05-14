
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, UserRole } from '../types';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase/user';
import { ExpertProfile } from '@/types/database/unified';

export const useAuthFunctions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  // Sign in function
  const signIn = useCallback(async (
    email: string, 
    password: string, 
    loginAs?: 'user' | 'expert'
  ): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('An unexpected error occurred during login');
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      return false;
    }
  }, [setAuthState]);
  
  // Sign up function
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData?: any,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            referral_code: referralCode
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      // Create user profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              ...userData,
              referred_by: referralCode
            }
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      toast.success('Registration successful! Please check your email to verify your account.');
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      return true;
    } catch (error) {
      console.error('Signup exception:', error);
      toast.error('An unexpected error occurred during registration');
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      return false;
    }
  }, [setAuthState]);
  
  // Sign out function
  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      // Reset auth state
      setAuthState(prev => ({ 
        ...initialAuthState,
        loading: false,
        isLoading: false
      }));
      
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Logout exception:', error);
      toast.error('An unexpected error occurred during logout');
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      return false;
    }
  }, [setAuthState]);
  
  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Update profile error:', error);
        toast.error(error.message);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
        userProfile: prev.profile ? { ...prev.profile, ...updates } : null,
        loading: false,
        isLoading: false
      }));
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile exception:', error);
      toast.error('An unexpected error occurred while updating your profile');
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      return false;
    }
  }, [authState.user, setAuthState]);
  
  // Update expert profile function
  const updateExpertProfile = useCallback(async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      const { error } = await supabase
        .from('expert_profiles')
        .update(updates)
        .eq('user_id', authState.user.id);
      
      if (error) {
        console.error('Update expert profile error:', error);
        toast.error(error.message);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        expertProfile: prev.expertProfile ? { ...prev.expertProfile, ...updates } : null,
        loading: false,
        isLoading: false
      }));
      
      toast.success('Expert profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update expert profile exception:', error);
      toast.error('An unexpected error occurred while updating your expert profile');
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      return false;
    }
  }, [authState.user, setAuthState]);
  
  // Clear session
  const clearSession = useCallback(() => {
    setAuthState(prev => ({
      ...initialAuthState
    }));
  }, [setAuthState]);
  
  // Update password function
  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Update password error:', error);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Update password exception:', error);
      toast.error('An unexpected error occurred while updating your password');
      return false;
    }
  }, []);
  
  // Add to favorites function
  const addToFavorites = useCallback(async (expertId: number): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to add favorites');
        return false;
      }
      
      // Update favorites array in user profile
      const { data: currentProfile } = await supabase
        .from('user_profiles')
        .select('favorite_experts')
        .eq('id', authState.user.id)
        .single();
      
      const favorites = currentProfile?.favorite_experts || [];
      
      if (favorites.includes(expertId)) {
        return true; // Already favorited
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          favorite_experts: [...favorites, expertId] 
        })
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Add favorite error:', error);
        toast.error('Failed to add to favorites');
        return false;
      }
      
      // Update local state
      setAuthState(prev => {
        const updatedProfile = prev.profile ? {
          ...prev.profile,
          favorite_experts: [...(prev.profile.favorite_experts || []), expertId]
        } : null;
        
        return {
          ...prev,
          profile: updatedProfile,
          userProfile: updatedProfile
        };
      });
      
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Add favorite exception:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [authState.user, setAuthState]);
  
  // Remove from favorites function
  const removeFromFavorites = useCallback(async (expertId: number): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to manage favorites');
        return false;
      }
      
      // Update favorites array in user profile
      const { data: currentProfile } = await supabase
        .from('user_profiles')
        .select('favorite_experts')
        .eq('id', authState.user.id)
        .single();
      
      const favorites = currentProfile?.favorite_experts || [];
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          favorite_experts: favorites.filter(id => id !== expertId)
        })
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Remove favorite error:', error);
        toast.error('Failed to remove from favorites');
        return false;
      }
      
      // Update local state
      setAuthState(prev => {
        const updatedProfile = prev.profile ? {
          ...prev.profile,
          favorite_experts: (prev.profile.favorite_experts || []).filter(id => id !== expertId)
        } : null;
        
        return {
          ...prev,
          profile: updatedProfile,
          userProfile: updatedProfile
        };
      });
      
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Remove favorite exception:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [authState.user, setAuthState]);
  
  // Recharge wallet function
  const rechargeWallet = useCallback(async (amount: number): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to recharge your wallet');
        return false;
      }
      
      // Get current wallet balance
      const { data: currentProfile } = await supabase
        .from('user_profiles')
        .select('wallet_balance')
        .eq('id', authState.user.id)
        .single();
      
      const currentBalance = currentProfile?.wallet_balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update wallet balance
      const { error } = await supabase
        .from('user_profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Recharge wallet error:', error);
        toast.error('Failed to recharge wallet');
        return false;
      }
      
      // Update local state
      setAuthState(prev => {
        const updatedProfile = prev.profile ? {
          ...prev.profile,
          wallet_balance: newBalance
        } : null;
        
        return {
          ...prev,
          profile: updatedProfile,
          userProfile: updatedProfile,
          walletBalance: newBalance
        };
      });
      
      toast.success(`Wallet recharged with ${amount}`);
      return true;
    } catch (error) {
      console.error('Recharge wallet exception:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [authState.user, setAuthState]);
  
  // Add review function
  const addReview = useCallback(async (review: any): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to leave a review');
        return false;
      }
      
      // Add review to database
      const { error } = await supabase
        .from('reviews')
        .insert([{
          ...review,
          user_id: authState.user.id,
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Add review error:', error);
        toast.error('Failed to submit review');
        return false;
      }
      
      toast.success('Review submitted successfully');
      return true;
    } catch (error) {
      console.error('Add review exception:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [authState.user]);
  
  // Report expert function
  const reportExpert = useCallback(async (report: any): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to report an expert');
        return false;
      }
      
      // Add report to database
      const { error } = await supabase
        .from('reports')
        .insert([{
          ...report,
          user_id: authState.user.id,
          created_at: new Date().toISOString(),
          status: 'pending'
        }]);
      
      if (error) {
        console.error('Report expert error:', error);
        toast.error('Failed to submit report');
        return false;
      }
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Report expert exception:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [authState.user]);
  
  // Has taken service from function
  const hasTakenServiceFrom = useCallback(async (expertId: string | number): Promise<boolean> => {
    try {
      if (!authState.user) {
        return false;
      }
      
      // Check if user has taken service from expert
      const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', authState.user.id)
        .eq('expert_id', expertId)
        .limit(1);
      
      if (error) {
        console.error('Check service history error:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Check service history exception:', error);
      return false;
    }
  }, [authState.user]);
  
  // Get expert share link function
  const getExpertShareLink = useCallback((expertId: string | number): string => {
    // Generate a shareable link to expert profile
    const baseUrl = window.location.origin;
    return `${baseUrl}/expert/${expertId}`;
  }, []);
  
  // Get referral link function
  const getReferralLink = useCallback((): string | null => {
    if (!authState.profile?.referral_code) {
      return null;
    }
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${authState.profile.referral_code}`;
  }, [authState.profile]);
  
  // Update profile picture function
  const updateProfilePicture = useCallback(async (file: File): Promise<string | null> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to update your profile picture');
        return null;
      }
      
      // Upload image to storage
      const fileName = `profile/${authState.user.id}/${Date.now()}-${file.name}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload profile picture');
        return null;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      const publicUrl = urlData?.publicUrl;
      
      // Update profile with new URL
      await updateProfile({ profile_picture: publicUrl });
      
      return publicUrl;
    } catch (error) {
      console.error('Update profile picture exception:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }, [authState.user, updateProfile]);
  
  return {
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateExpertProfile,
    clearSession,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    updateProfilePicture
  };
};
