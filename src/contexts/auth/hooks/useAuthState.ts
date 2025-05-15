
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/contexts/auth/types';
import { AuthState, initialAuthState } from '@/contexts/auth/types';
import { userRepository } from '@/repositories';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  const getProfileByUserId = async (userId: string) => {
    try {
      const userProfile = await userRepository.getUser(userId);
      
      if (!userProfile) {
        console.error('User profile not found', userId);
        return null;
      }
      
      // Ensure the profile has all required fields by using the adapter
      const adaptedProfile = adaptUserProfile(userProfile);
      
      return adaptedProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const handleSessionChange = async (session: Session | null) => {
    if (!session || !session.user) {
      setState({
        ...initialAuthState,
        loading: false,
        isLoading: false
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Fetch user profile
      const profile = await getProfileByUserId(session.user.id);
      
      // Set role based on session claims or default to 'user'
      let role = session.user?.app_metadata?.role as UserRole || 'user';
      
      // Set authentication state based on fetched data
      setState({
        user: {
          id: session.user.id,
          email: session.user.email || '',
          role
        },
        session,
        profile,
        userProfile: profile,
        expertProfile: null, // Will be populated if needed
        loading: false,
        isLoading: false,
        error: null,
        isAuthenticated: !!profile,
        role,
        sessionType: 'user',
        walletBalance: profile?.wallet_balance || 0
      });
    } catch (error) {
      console.error('Error in session handling:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        isLoading: false,
        error: error as Error
      }));
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        await handleSessionChange(data.session);
        
        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
          handleSessionChange(session);
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          isLoading: false,
          error: error as Error
        }));
      }
    };

    initializeAuth();
  }, []);

  return state;
};
