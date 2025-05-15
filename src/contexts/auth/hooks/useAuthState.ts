
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { AuthState, initialAuthState, UserRole } from '../types';
import { convertUserToUserProfile } from '@/utils/profileConverters';
import { UserProfile } from '@/types/database/unified';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Helper function to determine user role from data
  const determineRole = async (user: User): Promise<UserRole> => {
    // Check if user has an expert profile
    const { data: expertProfile } = await supabase
      .from('expert_accounts')
      .select('*')
      .eq('auth_id', user.id)
      .single();
    
    // Check if user has an admin role
    const { data: adminProfile } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (adminProfile) return 'admin';
    if (expertProfile) return 'expert';
    return 'user';
  };

  // Function to fetch user data, including role and profile
  const fetchUserData = async (user: User) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Determine the user's role
      const role = await determineRole(user);
      
      // Fetch user profile data
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      // Fetch expert profile if the role is expert
      const { data: expertProfile } = role === 'expert' ? await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', user.id)
        .single() : { data: null };
      
      // Convert userProfile to standardized UserProfile format
      const convertedProfile = convertUserToUserProfile(userProfile);
      
      // Update auth state with all the data
      const newState: AuthState = {
        user: {
          id: user.id, 
          email: user.email,
          role
        },
        session: null, // Will be updated by the auth state listener
        profile: convertedProfile as UserProfile,
        userProfile: convertedProfile as UserProfile,
        expertProfile,
        role,
        loading: false,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        sessionType: expertProfile ? (userProfile ? 'dual' : 'expert') : 'user',
        walletBalance: userProfile?.wallet_balance || 0
      };
      
      setAuthState(newState);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        isLoading: false, 
        error: error as Error 
      }));
    }
  };

  // Set up the auth state listener
  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update session state immediately
        setAuthState(prev => ({
          ...prev,
          session,
          isAuthenticated: !!session,
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email,
            role: prev.role
          } : null
        }));
        
        // If there's a session, fetch user data
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(() => {
            fetchUserData(session.user);
          }, 0);
        } else {
          // Clear profiles when no session
          setAuthState(prev => ({
            ...prev,
            profile: null,
            userProfile: null,
            expertProfile: null,
            role: null,
            isAuthenticated: false,
            sessionType: 'none',
            walletBalance: 0
          }));
        }
      }
    );
    
    // Then, check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState(prev => ({
          ...prev,
          session,
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email,
            role: prev.role
          }
        }));
        
        // Fetch user data
        fetchUserData(session.user);
      } else {
        // No session, clear loading state
        setAuthState(prev => ({
          ...prev,
          loading: false,
          isLoading: false
        }));
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { authState, setAuthState, fetchUserData };
};
