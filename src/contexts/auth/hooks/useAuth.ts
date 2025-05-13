
import { useAuth as useReactAuth } from '../AuthContext';
import { AuthContextType } from '../types';

/**
 * Custom hook to access the auth context
 * This is a pass-through hook that ensures we use the correct auth context
 */
export const useAuth = (): AuthContextType => {
  return useReactAuth();
};
