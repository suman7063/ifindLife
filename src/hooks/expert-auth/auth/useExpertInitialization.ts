
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertAuthState } from '../types';
import { toast } from 'sonner';

export const useExpertInitialization = (
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>,
  setLoading: (loading: boolean) => void
) => {
  const [authState, setAuthState] = useState<ExpertAuthState>({
    currentExpert: null,
    user: null,
    loading: true,
    error: null,
    initialized: false,
    isAuthenticated: false
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log('Initializing expert auth state');
        
        // Check for existing session
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log('No active session found');
          setAuthState({
            currentExpert: null,
            user: null,
            loading: false,
            error: null,
            initialized: true,
            isAuthenticated: false,
          });
          return;
        }
        
        console.log('Active session found, checking for expert profile');
        // Fetch expert profile
        const expertProfile = await fetchExpertProfile(data.session.user.id);
        
        if (!expertProfile) {
          console.log('No expert profile found for active session');
          setAuthState({
            currentExpert: null,
            user: null,
            loading: false,
            error: null,
            initialized: true,
            isAuthenticated: false,
          });
          return;
        }

        // Check if expert is approved
        if (expertProfile.status !== 'approved') {
          console.log(`Expert account status is ${expertProfile.status}, not approved`);
          
          // Sign out since the expert is not approved
          await supabase.auth.signOut({ scope: 'local' });
          
          // Show appropriate toast message
          if (expertProfile.status === 'pending') {
            toast.info('Your expert account is pending approval.');
            
            // Redirect to login page with status
            setTimeout(() => {
              window.location.href = '/expert-login?status=pending';
            }, 1500);
          } else if (expertProfile.status === 'disapproved') {
            toast.error('Your expert account has been disapproved. Please check your email for details.');
            
            // Redirect to login page with status
            setTimeout(() => {
              window.location.href = '/expert-login?status=disapproved';
            }, 1500);
          }
          
          setAuthState({
            currentExpert: null,
            user: null,
            loading: false,
            error: null,
            initialized: true,
            isAuthenticated: false,
          });
          return;
        }
        
        console.log('Expert profile found and approved, setting auth state');
        setAuthState({
          currentExpert: expertProfile,
          user: data.session.user,
          loading: false,
          error: null,
          initialized: true,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error initializing expert auth:', error);
        setAuthState({
          currentExpert: null,
          user: null,
          loading: false,
          error: 'Failed to initialize auth',
          initialized: true,
          isAuthenticated: false,
        });
      }
    };
    
    initializeAuth();
  }, [fetchExpertProfile, setLoading]);

  // Set up auth state change listener
  useEffect(() => {
    const setupAuthListener = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`Auth state change event: ${event}`);
          
          if (event === 'SIGNED_IN' && session) {
            console.log('Signed in event detected, fetching expert profile');
            // Don't set loading to true here to avoid UI flicker
            const expertProfile = await fetchExpertProfile(session.user.id);
            
            if (!expertProfile) {
              console.log('No expert profile found after sign in');
              setAuthState(prev => ({
                ...prev,
                currentExpert: null,
                isAuthenticated: false,
                initialized: true,
              }));
              return;
            }
            
            // Check if expert is approved
            if (expertProfile.status !== 'approved') {
              console.log(`Expert account status is ${expertProfile.status}, not approved`);
              
              // Sign out since the expert is not approved
              await supabase.auth.signOut({ scope: 'local' });
              
              // Show appropriate toast message
              if (expertProfile.status === 'pending') {
                toast.info('Your expert account is pending approval.');
                
                // Redirect to login page with status
                window.location.href = '/expert-login?status=pending';
              } else if (expertProfile.status === 'disapproved') {
                toast.error('Your expert account has been disapproved.');
                
                // Redirect to login page with status
                window.location.href = '/expert-login?status=disapproved';
              }
              
              setAuthState(prev => ({
                ...prev,
                currentExpert: null,
                isAuthenticated: false,
                initialized: true,
                loading: false,
              }));
              return;
            }
            
            console.log('Expert profile found and approved, updating auth state');
            setAuthState(prev => ({
              ...prev,
              currentExpert: expertProfile,
              loading: false,
              initialized: true,
              isAuthenticated: true,
            }));
          } else if (event === 'SIGNED_OUT') {
            console.log('Signed out event detected, clearing expert profile');
            setAuthState(prev => ({
              ...prev,
              currentExpert: null,
              loading: false,
              initialized: true,
              isAuthenticated: false,
            }));
          } else {
            // For other events, just update the initialized flag
            setAuthState(prev => ({
              ...prev,
              initialized: true,
            }));
          }
        }
      );
      
      return subscription;
    };
    
    const subscription = setupAuthListener();
    
    return () => {
      // Clean up subscription
      subscription.then(sub => sub.unsubscribe());
    };
  }, [fetchExpertProfile]);

  // Add a timeout to complete auth loading if it takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (authState.loading) {
        console.log('Auth loading timeout reached, forcing completion');
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
        }));
      }
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [authState.loading]);

  return { authState, setAuthState };
};
