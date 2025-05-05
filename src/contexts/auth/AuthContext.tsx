
import React, { createContext, useContext, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useFetchUserProfile } from './hooks/useFetchUserProfile';
import { useFetchExpertProfile } from './hooks/useFetchExpertProfile';
import { useProfileActions } from './hooks/useProfileActions';
import { useExpertInteractions } from './hooks/useExpertInteractions';
import { useAuthJourneyPreservation } from '@/hooks/useAuthJourneyPreservation';

export interface AuthContextType {
  user: any;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: 'user' | 'expert' | 'admin' | null;
  userProfile: any;
  expertProfile: any;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUserProfile: (updates: any) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  addReview?: (expertId: string | object, rating?: number, comment?: string) => Promise<boolean>;
  reportExpert?: (expertId: string | object, reason?: string, details?: string) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  getExpertShareLink?: (expertId: string) => string;
  getReferralLink?: () => string | null;
  storePendingAction: (actionType: string, itemId: string, path?: string) => void;
  resetPassword?: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the base auth hook with Supabase
  const auth = useSupabaseAuth();
  const { user, session, loading: authLoading, signup: originalSignup, resetPassword } = auth;
  
  console.log('AuthProvider - Base auth state:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    authLoading,
    userId: user?.id
  });
  
  // Use profile fetching hooks
  const {
    userProfile,
    loading: userLoading,
    error: userError
  } = useFetchUserProfile(user?.id, session);
  
  const {
    expertProfile,
    loading: expertLoading,
    error: expertError
  } = useFetchExpertProfile(user?.id, session);
  
  // Debug any profile loading errors
  useEffect(() => {
    if (userError) {
      console.error('User profile loading error:', userError);
    }
    if (expertError) {
      console.error('Expert profile loading error:', expertError);
    }
  }, [userError, expertError]);
  
  // Use profile action hooks
  const {
    updateUserProfile,
    updatePassword,
    loading: actionsLoading
  } = useProfileActions(user?.id);
  
  // Use expert interaction hooks
  const {
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  } = useExpertInteractions(user?.id);
  
  // Use authentication journey preservation hook
  const { storePendingAction } = useAuthJourneyPreservation();

  // Wrap signup method to match expected signature
  const signup = async (email: string, password: string, userData: any): Promise<boolean> => {
    return originalSignup({ email, password, ...userData });
  };

  // Determine if the user is authenticated
  const isAuthenticated = !!session;
  
  // Determine the user role
  let role: 'user' | 'expert' | 'admin' | null = null;
  if (isAuthenticated) {
    if (expertProfile) {
      role = 'expert';
    } else if (userProfile) {
      // Check if this is an admin user
      if (userProfile.email === 'admin@ifindlife.com') {
        role = 'admin';
      } else {
        role = 'user';
      }
    }
  }
  
  // Determine session type
  const sessionType = !isAuthenticated ? 'none' 
    : userProfile && expertProfile ? 'dual'
    : userProfile ? 'user'
    : expertProfile ? 'expert'
    : 'none';
  
  // Debug output for auth state
  useEffect(() => {
    console.log('Auth state updated:', { 
      isAuthenticated, 
      role,
      hasUser: !!user,
      hasSession: !!session,
      hasUserProfile: !!userProfile,
      hasExpertProfile: !!expertProfile,
      sessionType,
      userLoading,
      expertLoading,
      authLoading,
      userProfileData: userProfile ? {
        id: userProfile.id,
        name: userProfile.name,
        hasFavoriteExperts: Array.isArray(userProfile.favorite_experts),
        favoriteExpertsCount: userProfile.favorite_experts?.length || 0,
        hasFavoritePrograms: Array.isArray(userProfile.favorite_programs),
        favoriteProgramsCount: userProfile.favorite_programs?.length || 0
      } : 'No user profile'
    });
  }, [isAuthenticated, role, user, session, userProfile, expertProfile, sessionType, userLoading, expertLoading, authLoading]);

  // Create the value object for the context
  const value: AuthContextType = {
    ...auth,
    isAuthenticated,
    isLoading: authLoading || userLoading || expertLoading || actionsLoading,
    role,
    userProfile,
    expertProfile,
    updateUserProfile,
    updatePassword,
    sessionType,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    storePendingAction,
    signup,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
