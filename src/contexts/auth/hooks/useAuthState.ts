
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';
import { AuthState, initialAuthState, UserRole, SessionType } from '../types';

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
            // Get session type from localStorage or default to 'user'
            const sessionType = localStorage.getItem('sessionType') as SessionType || 'user';
            
            // Fetch profiles based on session type
            let userProfile = null;
            let expertProfile = null;
            let role: UserRole = 'user';

            if (sessionType === 'expert' || sessionType === 'dual') {
              expertProfile = await expertRepository.getExpertByAuthId(session.user.id);
              if (expertProfile) {
                role = 'expert';
              }
            }

            if (sessionType === 'user' || sessionType === 'dual' || !expertProfile) {
              userProfile = await userRepository.getUser(session.user.id);
              if (userProfile && !expertProfile) {
                role = 'user';
              }
            }

            // Determine final session type
            let finalSessionType: SessionType = 'none';
            if (userProfile && expertProfile) {
              finalSessionType = 'dual';
            } else if (expertProfile) {
              finalSessionType = 'expert';
            } else if (userProfile) {
              finalSessionType = 'user';
            }

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
              sessionType: finalSessionType,
              hasUserAccount: !!userProfile
            });

          } catch (error) {
            console.error('Error fetching user profiles:', error);
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: error as Error
            }));
          }
        } else {
          // No session - reset to initial state
          setState({
            ...initialAuthState,
            isLoading: false
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');
      // The onAuthStateChange will handle this, so we don't need to duplicate logic here
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
