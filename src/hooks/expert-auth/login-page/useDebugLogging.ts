
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
  // Monitor auth states for debugging in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Auth state monitoring for development debugging
    }
  }, [loading, initialized, expert, userProfile, redirectAttempted]);
};
