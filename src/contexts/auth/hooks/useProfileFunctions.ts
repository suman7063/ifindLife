
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { AuthState, ExpertProfile } from '../types';
import { toast } from 'sonner';

export const useProfileFunctions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user || !authState.userProfile) {
        toast.error("No authenticated user found");
        return false;
      }
      
      setIsUpdating(true);
      
      // First, try to update the users table
      let { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authState.user.id);
      
      if (error) {
        // If that fails, try to update the profiles table
        console.log("Falling back to profiles table update:", error.message);
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', authState.user.id);
          
        if (profileError) {
          console.error("Profile update error:", profileError);
          toast.error(profileError.message);
          return false;
        }
      }
      
      // Update the local state
      setAuthState((prev) => ({
        ...prev,
        userProfile: { ...prev.userProfile!, ...updates } as UserProfile,
      }));
      
      return true;
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "An error occurred during profile update");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateExpertProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      if (!authState.user || !authState.expertProfile) {
        toast.error("No authenticated expert found");
        return false;
      }
      
      setIsUpdating(true);
      
      // Ensure id is a string in updates
      const updatesWithStringId = {
        ...updates,
        id: updates.id ? String(updates.id) : undefined
      };
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .update(updatesWithStringId)
        .eq('auth_id', authState.user.id)
        .select()
        .single();
        
      if (error) {
        console.error("Expert profile update error:", error);
        toast.error(error.message);
        return false;
      }
      
      // Ensure we maintain the required status field when updating state
      const updatedExpertProfile: ExpertProfile = {
        ...authState.expertProfile,
        ...updates,
        id: String(authState.expertProfile.id), // Ensure ID is always a string
        status: (updates.status || authState.expertProfile.status) as 'pending' | 'approved' | 'disapproved'
      };
      
      setAuthState((prev) => ({
        ...prev,
        expertProfile: updatedExpertProfile,
      }));
      
      toast.success("Expert profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Expert profile update error:", error);
      toast.error(error.message || "An error occurred during profile update");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
        return false;
      }
      
      toast.success("Password reset instructions sent to your email");
      return true;
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "An error occurred during password reset");
      return false;
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message);
        return false;
      }
      
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "An error occurred during password update");
      return false;
    }
  };

  return {
    updateUserProfile,
    updateExpertProfile,
    resetPassword,
    updatePassword,
    isUpdating
  };
};
