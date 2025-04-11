
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile as SBExpertProfile } from '@/types/supabase/expert';
import { ExpertProfile as AppExpertProfile } from '@/types/expert';
import { User } from '@supabase/supabase-js';
import { UseAuthSynchronizationReturn } from '@/hooks/auth-sync/types';

export interface UseAuthBackCompatReturn {
  currentUser: UserProfile;
  user: User;
  currentExpert: AppExpertProfile;
  isAuthenticated: boolean;
  isExpertAuthenticated: boolean;
  loading: boolean;
  expertAuth: {
    currentExpert: AppExpertProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
  };
  authSync: UseAuthSynchronizationReturn;
}

// Helper to convert between ExpertProfile types
const convertExpertProfile = (expert: SBExpertProfile | null): AppExpertProfile | null => {
  if (!expert) return null;
  
  return {
    ...expert,
    id: String(expert.id) // Ensure id is a string
  } as AppExpertProfile;
};

export const useAuthBackCompat = (): UseAuthBackCompatReturn => {
  const auth = useAuth();
  
  const expertProfile = convertExpertProfile(auth.expertProfile);
  
  // Create a backward compatible API
  return {
    currentUser: auth.userProfile || {} as UserProfile,
    user: auth.user || {} as User,
    currentExpert: expertProfile || {} as AppExpertProfile,
    isAuthenticated: auth.isAuthenticated,
    isExpertAuthenticated: auth.role === 'expert',
    loading: auth.isLoading,
    
    // Expert auth backward compatibility
    expertAuth: {
      currentExpert: expertProfile,
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
      currentExpert: expertProfile,
      userLogout: auth.logout,
      expertLogout: auth.logout,
      fullLogout: auth.logout,
      hasDualSessions: false,
      sessionType: auth.role === 'user' ? 'user' : auth.role === 'expert' ? 'expert' : 'none',
      isLoggingOut: false
    }
  };
};
