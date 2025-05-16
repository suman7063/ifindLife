
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthUser, UserRole, SessionType, initialAuthState } from '@/contexts/auth/types';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';

export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>(initialAuthState);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Ensure we have sessionType in localStorage before proceeding
    const existingSessionType = localStorage.getItem('sessionType');
    if (!existingSessionType) {
      localStorage.setItem('sessionType', 'user');
      console.log('useAuthState: Setting default sessionType as user');
    }

    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    // First, perform initial auth check
    const checkAuth = async () => {
      try {
        console.log('useAuthState: Initial auth check');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Initial auth check error:', error);
          if (isMounted) {
            setState({
              ...initialAuthState,
              error,
              isLoading: false
            });
            setInitialCheckDone(true);
          }
          return;
        }
        
        if (data.session) {
          console.log('Initial auth check: Session found');
          
          // Process user data from session
          const sessionType = localStorage.getItem('sessionType') || 'user';
          
          // Create basic auth user
          const authUser: AuthUser = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: sessionType as UserRole
          };
          
          // Update state with basic auth data first
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              user: authUser,
              session: data.session,
              isAuthenticated: true,
              role: sessionType as UserRole,
              sessionType: sessionType as SessionType,
              isLoading: true // Still loading profiles
            }));
          }
          
          try {
            // Load user profile if needed
            let userProfile = null;
            let expertProfile = null;
            let walletBalance = 0;
            
            if (sessionType === 'user' || sessionType === 'dual') {
              userProfile = await userRepository.getUser(data.session.user.id);
              walletBalance = userProfile?.wallet_balance || 0;
            }
            
            if (sessionType === 'expert' || sessionType === 'dual') {
              expertProfile = await expertRepository.getExpertByAuthId(data.session.user.id);
            }
            
            // Finally update with full profile data
            if (isMounted) {
              setState(prevState => ({
                ...prevState,
                userProfile,
                expertProfile,
                profile: userProfile, // Backward compatibility
                walletBalance,
                isLoading: false
              }));
              setInitialCheckDone(true);
            }
          } catch (error) {
            console.error('Error loading profiles:', error);
            if (isMounted) {
              setState(prevState => ({
                ...prevState,
                error: error as Error,
                isLoading: false
              }));
              setInitialCheckDone(true);
            }
          }
        } else {
          console.log('Initial auth check: No session found');
          if (isMounted) {
            setState({
              ...initialAuthState,
              isLoading: false
            });
            setInitialCheckDone(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
          setState({
            ...initialAuthState,
            error: error as Error,
            isLoading: false
          });
          setInitialCheckDone(true);
        }
      }
    };
    
    // Run initial check first
    checkAuth();
    
    // Only set up the auth state change listener after the initial check
    setTimeout(() => {
      if (!isMounted) return;
      
      // Then define the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          // Skip processing if initial check is not done to prevent race condition
          if (!initialCheckDone) return;
          
          if (event === 'SIGNED_OUT') {
            console.log('Auth event: User signed out');
            localStorage.removeItem('sessionType');
            if (isMounted) {
              setState({
                ...initialAuthState,
                isLoading: false
              });
            }
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
            if (isMounted) {
              setState(prevState => ({
                ...prevState,
                user: authUser,
                session,
                isAuthenticated: true,
                isLoading: true, // Still loading profiles
                role: sessionType as UserRole,
                sessionType: sessionType as SessionType
              }));
            }
            
            // Use setTimeout to avoid blocking the auth state change event
            setTimeout(async () => {
              if (!isMounted) return;
              
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
                if (isMounted) {
                  setState(prevState => ({
                    ...prevState,
                    userProfile,
                    expertProfile,
                    profile: userProfile, // Backward compatibility
                    walletBalance,
                    isLoading: false
                  }));
                }
              } catch (error) {
                console.error('Error loading profiles:', error);
                if (isMounted) {
                  setState(prevState => ({
                    ...prevState,
                    error: error as Error,
                    isLoading: false
                  }));
                }
              }
            }, 0);
          } else {
            console.log('Auth event: No session available');
            if (isMounted) {
              setState({
                ...initialAuthState,
                isLoading: false
              });
            }
          }
        }
      );
      
      authSubscription = subscription;
    }, 100); // Small delay to ensure initial check completes first
    
    // Cleanup function to unsubscribe and prevent memory leaks
    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [initialCheckDone]); // Only re-run if initialCheckDone changes

  return state;
};
