
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';
import { User } from '@supabase/supabase-js';
import { UseAuthSynchronizationReturn } from '@/hooks/auth-sync/types';

export interface UseAuthBackCompatReturn {
  currentUser: UserProfile;
  user: User;
  currentExpert: ExpertProfile;
  isAuthenticated: boolean;
  isExpertAuthenticated: boolean;
  loading: boolean;
  expertAuth: {
    currentExpert: ExpertProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
  };
  authSync: UseAuthSynchronizationReturn;
}

export const useAuthBackCompat = (): UseAuthBackCompatReturn => {
  const auth = useAuth();
  
  // Create a backward compatible API
  return {
    currentUser: auth.userProfile || {} as UserProfile,
    user: auth.user || {} as User,
    currentExpert: auth.expertProfile || {} as ExpertProfile,
    isAuthenticated: auth.isAuthenticated,
    isExpertAuthenticated: auth.role === 'expert',
    loading: auth.isLoading,
    
    // Expert auth backward compatibility
    expertAuth: {
      currentExpert: auth.expertProfile,
      isAuthenticated: auth.role === 'expert',
      isLoading: auth.isLoading,
      login: auth.login,
      logout: auth.logout,
      register: async (data) => {
        // Placeholder for expert registration
        console.warn('Expert registration through legacy API is deprecated');
        return false;
      }
    },
    
    // Auth sync compatibility
    authSync: {
      syncAuthState: async () => true,
      isUserAuthenticated: auth.role === 'user',
      isExpertAuthenticated: auth.role === 'expert',
      isAuthenticated: auth.isAuthenticated,
      isAuthInitialized: !auth.isLoading,
      isAuthLoading: auth.isLoading,
      authCheckCompleted: !auth.isLoading,
      isSynchronizing: auth.isLoading,
      currentUser: auth.userProfile,
      currentExpert: auth.expertProfile,
      userLogout: auth.logout,
      expertLogout: auth.logout,
      fullLogout: auth.logout,
      hasDualSessions: false,
      sessionType: auth.role === 'user' ? 'user' : auth.role === 'expert' ? 'expert' : 'none',
      isLoggingOut: false
    }
  };
};
