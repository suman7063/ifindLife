
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

// Define the hook return type explicitly to avoid recursive type issues
export interface UseSingleSourceOfTruthReturn {
  // Auth state
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  
  // Loading states
  isLoading: boolean;
  isUserLoading: boolean;
  isExpertLoading: boolean;
  
  // Error states
  error: Error | null;
  userError: Error | null;
  expertError: Error | null;
  
  // Session type
  sessionType: SessionType;
  
  // Auth methods
  initiateAuth: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  refreshExpertProfile: () => Promise<ExpertProfile | null>;
  setUserProfileData: (data: UserProfile | null) => void;
  setExpertProfileData: (data: ExpertProfile | null) => void;
}

export const useSingleSourceOfTruth = (): UseSingleSourceOfTruthReturn => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isExpertLoading, setIsExpertLoading] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<Error | null>(null);
  const [userError, setUserError] = useState<Error | null>(null);
  const [expertError, setExpertError] = useState<Error | null>(null);
  
  // Session type state
  const [sessionType, setSessionType] = useState<SessionType>('none');
  
  // Public method to set user profile data
  const setUserProfileData = (data: UserProfile | null) => {
    setUserProfile(data);
  };
  
  // Public method to set expert profile data
  const setExpertProfileData = (data: ExpertProfile | null) => {
    setExpertProfile(data);
  };
  
  // Fetch user profile
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      setIsUserLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        // Try profiles table as fallback
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setUserError(profileError);
          return null;
        }
        
        setUserProfile(profileData as UserProfile);
        return profileData as UserProfile;
      }
      
      setUserProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUserError(error instanceof Error ? error : new Error(String(error)));
      return null;
    } finally {
      setIsUserLoading(false);
    }
  }, []);
  
  // Fetch expert profile
  const fetchExpertProfile = useCallback(async (userId: string): Promise<ExpertProfile | null> => {
    try {
      setIsExpertLoading(true);
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching expert profile:', error);
        setExpertError(error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      setExpertProfile(data as ExpertProfile);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      setExpertError(error instanceof Error ? error : new Error(String(error)));
      return null;
    } finally {
      setIsExpertLoading(false);
    }
  }, []);
  
  // Refresh user profile (public method)
  const refreshUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return await fetchUserProfile(user.id);
  }, [user, fetchUserProfile]);
  
  // Refresh expert profile (public method)
  const refreshExpertProfile = useCallback(async (): Promise<ExpertProfile | null> => {
    if (!user) return null;
    return await fetchExpertProfile(user.id);
  }, [user, fetchExpertProfile]);
  
  // Determine session type based on profiles
  useEffect(() => {
    if (!isAuthenticated) {
      setSessionType('none');
    } else if (userProfile && expertProfile) {
      setSessionType('dual');
    } else if (userProfile) {
      setSessionType('user');
    } else if (expertProfile) {
      setSessionType('expert');
    } else {
      setSessionType('none');
    }
  }, [isAuthenticated, userProfile, expertProfile]);
  
  // Initial auth check and setup auth state listener
  const initiateAuth = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state changed:', event, newSession?.user?.id);
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setIsAuthenticated(!!newSession?.user);
          
          // If signed in, fetch profiles
          if (newSession?.user) {
            await Promise.all([
              fetchUserProfile(newSession.user.id),
              fetchExpertProfile(newSession.user.id)
            ]);
          } else {
            // Clear profiles on sign out
            setUserProfile(null);
            setExpertProfile(null);
          }
        }
      );
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession?.user);
      
      // If already signed in, fetch profiles
      if (currentSession?.user) {
        await Promise.all([
          fetchUserProfile(currentSession.user.id),
          fetchExpertProfile(currentSession.user.id)
        ]);
      }
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error in initAuth:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile, fetchExpertProfile]);
  
  // Call initiateAuth on mount
  useEffect(() => {
    initiateAuth();
  }, [initiateAuth]);
  
  return {
    // Auth state
    user,
    session,
    isAuthenticated,
    userProfile,
    expertProfile,
    
    // Loading states
    isLoading,
    isUserLoading,
    isExpertLoading,
    
    // Error states
    error,
    userError,
    expertError,
    
    // Session type
    sessionType,
    
    // Methods
    initiateAuth,
    refreshUserProfile,
    refreshExpertProfile,
    setUserProfileData,
    setExpertProfileData
  };
};
