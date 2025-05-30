
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
  const [state, setState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event, session ? 'Session exists' : 'No session');
        
        if (!mounted) return;

        if (session?.user) {
          try {
            // Set loading state first
            setState(prev => ({
              ...prev,
              isLoading: true,
              session,
              user: {
                id: session.user.id,
                email: session.user.email || '',
                role: 'user' // Default role, will be updated based on profiles
              },
              isAuthenticated: true,
              error: null
            }));

            // Get session type from localStorage or determine from profiles
            let sessionType = localStorage.getItem('sessionType') as SessionType;
            
            // Fetch profiles to determine proper session type
            let userProfile = null;
            let expertProfile = null;
            let role: UserRole = 'user';

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

            // Determine proper session type based on available profiles
            const actualSessionType = determineSessionType(userProfile, expertProfile);
            
            // Update localStorage with correct session type
            if (actualSessionType !== 'none') {
              localStorage.setItem('sessionType', actualSessionType);
            }
            
            // Set role based on session type
            if (actualSessionType === 'expert' && expertProfile) {
              role = 'expert';
            } else if (actualSessionType === 'user' && userProfile) {
              role = 'user';
            }

            console.log('Auth profiles loaded:', {
              userProfile: !!userProfile,
              expertProfile: !!expertProfile,
              sessionType: actualSessionType,
              role
            });

            // Final state update with all data
            setState({
              user: {
                id: session.user.id,
                email: session.user.email || '',
                role
              },
              userProfile,
              expertProfile,
              profile: userProfile || expertProfile, // For backward compatibility
              isAuthenticated: true,
              isLoading: false,
              role,
              session,
              error: null,
              walletBalance: userProfile?.wallet_balance || 0,
              sessionType: actualSessionType,
              hasUserAccount: !!userProfile
            });

          } catch (error) {
            console.error('Error fetching user profiles:', error);
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: error as Error,
              sessionType: 'none'
            }));
          }
        } else {
          // No session - reset to initial state
          localStorage.removeItem('sessionType');
          setState({
            ...initialAuthState,
            isLoading: false,
            sessionType: 'none'
          });
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session ? 'Session exists' : 'No session');
        // The onAuthStateChange will handle this, so we don't need to duplicate logic here
      } catch (error) {
        console.error('Error checking initial session:', error);
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

  // Add debugging for auth state changes
  useEffect(() => {
    console.log('Auth state updated:', {
      hasUser: !!state.user,
      hasSession: !!state.session,
      sessionType: state.sessionType,
      userProfile: !!state.userProfile,
      expertProfile: !!state.expertProfile,
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated
    });
  }, [state.user, state.session, state.sessionType, state.userProfile, state.expertProfile, state.isLoading, state.isAuthenticated]);

  return state;
};
