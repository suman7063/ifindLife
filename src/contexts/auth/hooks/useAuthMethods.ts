
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '../types';
import { ensureStringId } from '@/utils/idConverters';
import { ExpertProfile } from '@/types/supabase/expert';
import { UserProfile } from '@/types/supabase/userProfile';

export const useAuthMethods = (authState: AuthState) => {
  // Get the user display name for UI purposes
  const getUserDisplayName = useCallback(() => {
    if (authState.userProfile?.name) {
      return authState.userProfile.name;
    } else if (authState.user?.user_metadata?.name) {
      return authState.user.user_metadata.name;
    } else if (authState.user?.email) {
      return authState.user.email.split('@')[0];
    }
    return 'User';
  }, [authState.userProfile, authState.user]);
  
  // Check if the user has taken service from an expert
  const hasTakenServiceFrom = useCallback(async (expertId: string | number): Promise<boolean> => {
    if (!authState.user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('*')
        .eq('user_id', authState.user.id)
        .eq('expert_id', ensureStringId(expertId));
      
      if (error) {
        console.error('Error checking service history:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking if user has taken service:', error);
      return false;
    }
  }, [authState.user]);
  
  // Get a shareable link for an expert
  const getExpertShareLink = useCallback((expertId: string | number): string => {
    return `${window.location.origin}/experts/${ensureStringId(expertId)}`;
  }, []);
  
  // Get the user's referral link
  const getReferralLink = useCallback((): string | null => {
    if (!authState.userProfile?.referral_code) return null;
    return `${window.location.origin}/signup?ref=${authState.userProfile.referral_code}`;
  }, [authState.userProfile]);
  
  return {
    getUserDisplayName,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };
};
