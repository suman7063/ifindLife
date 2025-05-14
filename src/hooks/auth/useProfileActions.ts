
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified'; // Use the unified type

export const useProfileActions = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      // First check which table has the user's profile
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      const table = userData ? 'users' : 'profiles';
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', userId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserProfile,
    updatePassword,
    loading
  };
};
