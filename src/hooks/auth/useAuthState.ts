
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState, UserRole } from '@/contexts/auth/types';
import { User } from '@supabase/supabase-js';
import { getUserDisplayName } from '@/utils/profileConverters';
import { UserProfile } from '@/types/database/unified';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);
  
  // Fetch expert profile data
  const fetchExpertProfile = useCallback(async (userId: string): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('auth_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
        console.error('Error fetching expert profile:', error.message);
      }
      
      return data || null;
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  // Determine user role based on profiles
  const determineRole = useCallback((userProfile: UserProfile | null, expertProfile: any | null): UserRole => {
    // Check if user is an admin
    const isAdmin = false; // We would need to check an admin table here
    
    if (isAdmin) return 'admin';
    if (expertProfile) return 'expert';
    if (userProfile) return 'user';
    return null;
  }, []);

  // Function to update auth state with all user data
  const fetchUserData = useCallback(async (user: User) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Fetch user profile
      const userProfile = await fetchUserProfile(user.id);
      
      // Fetch expert profile
      const expertProfile = await fetchExpertProfile(user.id);
      
      // Determine role
      const role = determineRole(userProfile, expertProfile);
      
      // Determine session type
      let sessionType: 'none' | 'user' | 'expert' | 'dual' = 'none';
      if (userProfile && expertProfile) sessionType = 'dual';
      else if (userProfile) sessionType = 'user';
      else if (expertProfile) sessionType = 'expert';
      
      // Update auth state
      setAuthState({
        user: {
          id: user.id,
          email: user.email,
          role
        },
        session: null, // Will be updated by the auth state listener
        profile: userProfile,
        userProfile: userProfile, // Alias for backward compatibility
        expertProfile,
        loading: false,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        role,
        sessionType,
        walletBalance: userProfile?.wallet_balance || 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false, error: error as Error }));
    }
  }, [fetchUserProfile, fetchExpertProfile, determineRole]);

  // Initialize auth state on component mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Update session immediately
          setAuthState(prev => ({
            ...prev,
            session,
            isAuthenticated: true
          }));
          
          // Fetch user data
          await fetchUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          // Reset auth state
          setAuthState(initialAuthState);
        }
      }
    );
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Update session immediately
        setAuthState(prev => ({
          ...prev,
          session,
          isAuthenticated: true
        }));
        
        // Fetch user data
        fetchUserData(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);
  
  return { authState, setAuthState, fetchUserData };
};
