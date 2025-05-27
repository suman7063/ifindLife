
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/database/unified';

export const useProfileActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user?.id) return false;
    
    setLoading(true);
    try {
      // First check which table has the user's profile
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      const table = userData ? 'users' : 'profiles';
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', user.id);
        
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
