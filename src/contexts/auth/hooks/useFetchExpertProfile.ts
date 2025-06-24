
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';
import { expertRepository } from '@/repositories'; // Fixed import path

/**
 * Hook for fetching expert profile data
 */
export const useFetchExpertProfile = () => {
  const fetchExpertProfile = useCallback(async (userId: string): Promise<ExpertProfile | null> => {
    if (!userId) return null;
    
    try {
      console.log(`Fetching expert profile for user ID: ${userId}`);
      return await expertRepository.getExpertByAuthId(userId);
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  return { fetchExpertProfile };
};
