
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { SessionType } from '@/contexts/auth/AuthContext';
import { ExpertProfile, UserProfile } from '@/types/database/unified';

/**
 * Hook to provide a single source of truth for authentication state
 * This helps components get the correct user or expert profile based on the current session type
 */
export const useSingleSourceOfTruth = () => {
  const auth = useAuth();
  const [sessionType, setSessionType] = useState<SessionType>('none');
  const [currentProfile, setCurrentProfile] = useState<UserProfile | ExpertProfile | null>(null);
  
  useEffect(() => {
    // Get the session type from auth
    if (auth.sessionType) {
      setSessionType(auth.sessionType);
    }
    
    // Set the current profile based on session type
    if (auth.sessionType === 'user') {
      setCurrentProfile(auth.userProfile);
    } else if (auth.sessionType === 'expert') {
      setCurrentProfile(auth.expertProfile);
    } else if (auth.sessionType === 'dual') {
      // In dual mode, default to user profile unless otherwise specified
      setCurrentProfile(auth.userProfile);
    } else {
      setCurrentProfile(null);
    }
  }, [auth.userProfile, auth.expertProfile, auth.sessionType]);
  
  return {
    sessionType,
    currentProfile,
    userProfile: auth.userProfile,
    expertProfile: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading
  };
};
