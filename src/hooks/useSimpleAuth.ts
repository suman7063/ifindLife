
import { useSimpleAuth as useSimpleAuthContext, SessionType as UserType } from '@/contexts/SimpleAuthContext';

export const useSimpleAuth = () => {
  return useSimpleAuthContext();
};

// Export types for compatibility
export type { UserType };
export interface SimpleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType;
}
