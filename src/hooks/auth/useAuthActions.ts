
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';
import { toast } from 'sonner';

export const useAuthActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);

  // Update user profile in the appropriate table
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      // Check which table has the user's profile
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      // Determine the table to update
      const table = userData ? 'users' : 'profiles';
      
      // Ensure we have an ID in the updates
      const updatesWithId = {
        ...updates,
        id: userId
      };
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update(updatesWithId)
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error(`Failed to update profile: ${error.message}`);
        return false;
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update user password
  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    if (!password) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error(`Failed to update password: ${error.message}`);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    updateProfile,
    updatePassword,
    loading
  };
};
