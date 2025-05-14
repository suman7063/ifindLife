
import { useState, useEffect, useCallback } from 'react';
import { AuthState, initialAuthState } from '../types';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Fetch user data including profiles
  const fetchUserData = useCallback(async (user: User) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Fetch user profile
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      // Fetch expert profile
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Determine role based on profiles
      let role = userProfile ? 'user' : null;
      if (expertProfile) {
        role = expertProfile.is_admin ? 'admin' : 'expert';
      }
      
      // Determine session type
      let sessionType = 'none';
      if (userProfile && expertProfile) {
        sessionType = 'dual';
      } else if (userProfile) {
        sessionType = 'user';
      } else if (expertProfile) {
        sessionType = 'expert';
      }
      
      // Update state
      setAuthState(prev => ({
        ...prev,
        user: { 
          id: user.id, 
          email: user.email,
          role
        },
        profile: userProfile,
        userProfile: userProfile,
        expertProfile: expertProfile,
        role,
        sessionType,
        isAuthenticated: true,
        loading: false,
        isLoading: false,
        walletBalance: userProfile?.wallet_balance || 0
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        isLoading: false,
        error: error as Error
      }));
    }
  }, []);
  
  // Initialize auth state with session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setAuthState(prev => ({ 
            ...prev, 
            session,
            loading: true,
            isLoading: true
          }));
          
          await fetchUserData(session.user);
        } else {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false,
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState(prev => ({ 
          ...prev,
          loading: false,
          isLoading: false,
          error: error as Error
        }));
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setAuthState(initialAuthState);
      }
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);
  
  return { authState, setAuthState, fetchUserData };
};
