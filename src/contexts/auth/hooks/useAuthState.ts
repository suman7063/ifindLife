
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';
import { AuthState, initialAuthState, UserRole, SessionType } from '../types';

// Helper function to determine session type
const determineSessionType = (userProfile: any, expertProfile: any): SessionType => {
  if (expertProfile) return 'expert';
  if (userProfile) return 'user';
  return 'none';
};

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    ...initialAuthState,
    isLoading: true,
    isAuthenticated: false
  });

  // Helper function to update auth state with computed properties
  const updateAuthState = (user: any, session: any, userProfile: any, expertProfile: any, isLoading = false) => {
    const sessionType = determineSessionType(userProfile, expertProfile);
    const isAuthenticated = !!(user && session && sessionType !== 'none');
    
    const newState = {
      user: user ? {
        id: user.id,
        email: user.email || '',
        role: sessionType === 'expert' ? 'expert' as UserRole : 'user' as UserRole
      } : null,
      session,
      userProfile,
      expertProfile,
      profile: userProfile || expertProfile,
      sessionType,
      isLoading,
      isAuthenticated,
      role: sessionType === 'expert' ? 'expert' as UserRole : 'user' as UserRole,
      error: null,
      walletBalance: userProfile?.wallet_balance || 0,
      hasUserAccount: !!userProfile
    };
    
    console.log('useAuthState: Updating auth state:', {
      hasUser: !!user,
      hasSession: !!session,
      sessionType,
      isAuthenticated,
      userEmail: user?.email
    });
    
    setState(newState);
    return newState;
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth state change event:', event);
        
        if (!mounted) return;

        if (session?.user) {
          try {
            // Set loading state first
            updateAuthState(session.user, session, null, null, true);

            // Get session type from localStorage or determine from profiles
            const storedSessionType = localStorage.getItem('sessionType') as SessionType;
            
            // Fetch profiles to determine proper session type
            let userProfile = null;
            let expertProfile = null;

            // Always try to fetch both profiles to determine proper session type
            const [userResult, expertResult] = await Promise.allSettled([
              userRepository.getUser(session.user.id),
              expertRepository.getExpertByAuthId(session.user.id)
            ]);

            if (userResult.status === 'fulfilled') {
              userProfile = userResult.value;
            }
            if (expertResult.status === 'fulfilled') {
              expertProfile = expertResult.value;
            }

            // Determine proper session type based on available profiles and stored preference
            let actualSessionType = determineSessionType(userProfile, expertProfile);
            
            // If we have a stored preference and the corresponding profile exists, use it
            if (storedSessionType === 'expert' && expertProfile) {
              actualSessionType = 'expert';
            } else if (storedSessionType === 'user' && userProfile) {
              actualSessionType = 'user';
            }
            
            // Update localStorage with correct session type
            if (actualSessionType !== 'none') {
              localStorage.setItem('sessionType', actualSessionType);
            }

            console.log('useAuthState: Profiles loaded:', {
              userProfile: !!userProfile,
              expertProfile: !!expertProfile,
              storedSessionType,
              actualSessionType
            });

            // Final state update with all data
            updateAuthState(session.user, session, userProfile, expertProfile, false);

          } catch (error) {
            console.error('useAuthState: Error fetching user profiles:', error);
            updateAuthState(session.user, session, null, null, false);
          }
        } else {
          // No session - reset to initial state
          localStorage.removeItem('sessionType');
          updateAuthState(null, null, null, null, false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('useAuthState: Initial session check:', session ? 'Session exists' : 'No session');
        // The onAuthStateChange will handle this, so we don't need to duplicate logic here
      } catch (error) {
        console.error('useAuthState: Error checking initial session:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error
        }));
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
