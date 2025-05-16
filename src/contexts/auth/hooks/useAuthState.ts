
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthUser, UserRole, SessionType, initialAuthState } from '@/contexts/auth/types';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';

export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    // Ensure we have sessionType in localStorage before proceeding
    const existingSessionType = localStorage.getItem('sessionType');
    if (!existingSessionType) {
      localStorage.setItem('sessionType', 'user');
      console.log('useAuthState: Setting default sessionType as user');
    }

    // First, define the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          console.log('Auth event: User signed out');
          localStorage.removeItem('sessionType');
          setState({
            ...initialAuthState,
            isLoading: false
          });
          return;
        }
        
        if (session) {
          console.log('Auth event: Session available');
          // Process user data from session
          const sessionType = localStorage.getItem('sessionType') || 'user';
          
          // Create basic auth user
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: sessionType as UserRole
          };
          
          // Update state with basic auth data first
          setState(prevState => ({
            ...prevState,
            user: authUser,
            session,
            isAuthenticated: true,
            isLoading: true, // Still loading profiles
            role: sessionType as UserRole,
            sessionType: sessionType as SessionType
          }));
          
          try {
            // Load user profile if needed
            let userProfile = null;
            let expertProfile = null;
            let walletBalance = 0;
            
            if (sessionType === 'user' || sessionType === 'dual') {
              userProfile = await userRepository.getUser(session.user.id);
              walletBalance = userProfile?.wallet_balance || 0;
            }
            
            if (sessionType === 'expert' || sessionType === 'dual') {
              expertProfile = await expertRepository.getExpertByAuthId(session.user.id);
            }
            
            // Finally update with full profile data
            setState(prevState => ({
              ...prevState,
              userProfile,
              expertProfile,
              profile: userProfile, // Backward compatibility
              walletBalance,
              isLoading: false
            }));
          } catch (error) {
            console.error('Error loading profiles:', error);
            setState(prevState => ({
              ...prevState,
              error: error as Error,
              isLoading: false
            }));
          }
        } else {
          console.log('Auth event: No session available');
          setState({
            ...initialAuthState,
            isLoading: false
          });
        }
      }
    );
    
    // Then perform initial auth check
    const checkAuth = async () => {
      try {
        console.log('useAuthState: Initial auth check');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Initial auth check error:', error);
          setState({
            ...initialAuthState,
            error,
            isLoading: false
          });
          return;
        }
        
        if (data.session) {
          console.log('Initial auth check: Session found');
          // The session will be handled by the onAuthStateChange listener
        } else {
          console.log('Initial auth check: No session found');
          setState({
            ...initialAuthState,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setState({
          ...initialAuthState,
          error: error as Error,
          isLoading: false
        });
      }
    };
    
    // Run initial check
    checkAuth();
    
    // Cleanup function to unsubscribe
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
