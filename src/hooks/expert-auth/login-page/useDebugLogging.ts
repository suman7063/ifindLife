
import { useEffect } from 'react';
import { ExpertProfile } from '../types';
import { UserProfile } from '@/types/supabase';

export const useDebugLogging = (
  loading: boolean,
  initialized: boolean,
  expert: ExpertProfile | null,
  userProfile: UserProfile | null,
  redirectAttempted: boolean
) => {
  // Debug logging
  useEffect(() => {
    console.log('ExpertLogin component - Auth states:', {
      expertLoading: loading,
      expertAuthInitialized: initialized,
      hasExpertProfile: !!expert,
      directlyFetchedUserProfile: !!userProfile,
      redirectAttempted,
    });
  }, [loading, initialized, expert, userProfile, redirectAttempted]);
};
