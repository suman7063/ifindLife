
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/features/expert-auth';
import { AuthSyncState, SessionType } from './types';

export const useAuthCheckEffect = (
  currentUser: UserProfile | null,
  currentExpert: ExpertProfile | null,
  isUserAuthenticated: boolean,
  isExpertAuthenticated: boolean
): AuthSyncState => {
  const [isSynchronizing, setIsSynchronizing] = useState(true);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('none');
  const [hasDualSessions, setHasDualSessions] = useState(false);

  useEffect(() => {
    if (currentUser && currentExpert) {
      setSessionType('dual');
      setHasDualSessions(true);
    } else if (currentUser) {
      setSessionType('user');
      setHasDualSessions(false);
    } else if (currentExpert) {
      setSessionType('expert');
      setHasDualSessions(false);
    } else {
      setSessionType('none');
      setHasDualSessions(false);
    }
    
    setAuthCheckCompleted(true);
    setIsSynchronizing(false);
    setIsAuthInitialized(true);
  }, [currentUser, currentExpert]);
  
  return {
    isUserAuthenticated,
    isExpertAuthenticated,
    isSynchronizing,
    isAuthInitialized,
    authCheckCompleted,
    hasDualSessions,
    sessionType
  };
};

export default useAuthCheckEffect;
