
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '../types';

/**
 * Hook for fetching expert profile data
 */
export const useFetchExpertProfile = () => {
  const fetchExpertProfile = useCallback(async (userId: string): Promise<ExpertProfile | null> => {
    try {
      console.log(`Fetching expert profile for user ID: ${userId}`);
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }
      
      if (!data) {
        console.log('No expert profile found for user ID:', userId);
        return null;
      }
      
      console.log('Expert profile found:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  return { fetchExpertProfile };
};
