
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

/**
 * Hook for fetching expert profile data
 * FIXED: Now uses correct table name and column
 */
export const useFetchExpertProfile = () => {
  const fetchExpertProfile = useCallback(async (userId: string): Promise<ExpertProfile | null> => {
    if (!userId) return null;
    
    try {
      console.log(`🔒 Fetching expert profile for user ID: ${userId}`);
      
      // ✅ FIXED: Use correct table name and column
      const { data, error } = await supabase
        .from('expert_accounts')  // ✅ Correct table name
        .select('*')
        .eq('auth_id', userId)    // ✅ Correct column name  
        .eq('status', 'approved') // ✅ Only approved experts
        .maybeSingle();          // ✅ Use maybeSingle to avoid errors when not found
        
      if (error) {
        console.error('🔒 Error fetching expert profile:', error);
        return null;
      }
      
      if (!data) {
        console.log('🔒 No approved expert profile found for user ID:', userId);
        return null;
      }
      
      console.log('🔒 Expert profile found:', data.name);
      return data as ExpertProfile;
    } catch (error) {
      console.error('🔒 Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  return { fetchExpertProfile };
};
