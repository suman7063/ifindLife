import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ensureStringId } from '@/utils/idConverters';

export const useAuthMethods = (user: User | null) => {
  // Default implementations for auth methods
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

  return {
    loginWithOtp,
    resetPassword,
    updatePassword,
    updateEmail,
    refreshSession,
    updateExpertProfile,
    fetchExpertProfile,
    registerAsExpert,
    addToFavorites,
    removeFromFavorites
  };
};
