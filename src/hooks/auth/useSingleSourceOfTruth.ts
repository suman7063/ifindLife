
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/database/unified';
import { ExpertProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  role: 'user' | 'expert' | 'admin' | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Central hook for managing authentication state
 * This hook provides a single source of truth for auth data
 */
export const useSingleSourceOfTruth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    expertProfile: null,
    isAuthenticated: false,
    role: null,
    loading: true,
    error: null
  });

  // Fetch user profile
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      // First check the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!userError && userData) {
        return adaptUserProfile(userData);
      }
      
      // If not found, check the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!profileError && profileData) {
        return adaptUserProfile(profileData);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);
  
  // Fetch expert profile
  const fetchExpertProfile = useCallback(async (userId: string): Promise<ExpertProfile | null> => {
    try {
      // First check expert_accounts table
      const { data: accountData, error: accountError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
      
      if (!accountError && accountData) {
        return accountData as unknown as ExpertProfile;
      }
      
      // If not found, check experts table
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
      
      if (!expertError && expertData) {
        return expertData as unknown as ExpertProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      return null;
    }
  }, []);
  
  // Determine user role based on profiles
  const determineRole = useCallback((
    userProfile: UserProfile | null, 
    expertProfile: ExpertProfile | null
  ): 'user' | 'expert' | 'admin' | null => {
    // Check if user has admin privileges
    if (userProfile?.email?.endsWith('@ifindlife.com') || 
        userProfile?.email?.includes('admin')) {
      return 'admin';
    }
    
    if (expertProfile) {
      return 'expert';
    }
    
    if (userProfile) {
      return 'user';
    }
    
    return null;
  }, []);

  // Function to update auth state on login/logout
  const updateAuthState = useCallback(async (user: User | null) => {
    try {
      if (!user) {
        // User is logged out
        setAuthState({
          user: null,
          userProfile: null,
          expertProfile: null,
          isAuthenticated: false,
          role: null,
          loading: false,
          error: null
        });
        return;
      }
      
      // Fetch profiles
      const [userProfile, expertProfile] = await Promise.all([
        fetchUserProfile(user.id),
        fetchExpertProfile(user.id)
      ]);
      
      // Determine role
      const role = determineRole(userProfile, expertProfile);
      
      // Update state
      setAuthState({
        user,
        userProfile,
        expertProfile,
        isAuthenticated: true,
        role,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error updating auth state:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as Error
      }));
    }
  }, [fetchUserProfile, fetchExpertProfile, determineRole]);

  // Set up auth state listener
  useEffect(() => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // FIRST: Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          updateAuthState(session.user);
        } else {
          updateAuthState(null);
        }
      }
    );
    
    // SECOND: Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateAuthState(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [updateAuthState]);
  
  return {
    ...authState,
    refreshState: () => {
      if (authState.user) {
        updateAuthState(authState.user);
      }
    }
  };
};
