
import { useInitialSessionCheck } from './initialization/useInitialSessionCheck';
import { useAuthStateListener } from './initialization/useAuthStateListener';
import { useAuthTimeoutCheck } from './initialization/useAuthTimeoutCheck';
import { UseExpertInitializationReturn, ExpertAuthState } from './types/authStateTypes';
import { ExpertProfile } from '../types';

export const useExpertInitialization = (
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>,
  setLoading: (loading: boolean) => void
): UseExpertInitializationReturn => {
  // Initialize with session check
  const { authState, setAuthState } = useInitialSessionCheck(fetchExpertProfile, setLoading);
  
  // Set up auth state change listener
  useAuthStateListener(authState, setAuthState, fetchExpertProfile);
  
  // Set up auth timeout check
  useAuthTimeoutCheck(authState, setAuthState);

  return { authState, setAuthState };
};
