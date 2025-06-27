
import { useSimpleAuth as useSimpleAuthContext, SessionType as UserType } from '@/contexts/SimpleAuthContext';

export const useSimpleAuth = () => {
  const context = useSimpleAuthContext();
  
  console.log('useSimpleAuth hook: Detailed context return:', {
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    userType: context.userType,
    hasUser: !!context.user,
    hasUserProfile: !!context.userProfile,
    hasExpert: !!context.expert,
    userEmail: context.user?.email,
    userProfileName: context.userProfile?.name,
    expertName: context.expert?.name
  });
  
  return context;
};

// Export types for compatibility
export type { UserType };
export interface SimpleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType;
}
