
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertAuthState, UseExpertAuthReturn } from './types';
import { useExpertAuthentication } from './useExpertAuthentication';
import { useExpertProfile } from './useExpertProfile';
import { toast } from 'sonner';

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [authState, setAuthState] = useState<ExpertAuthState>({
    currentExpert: null,
    user: null,
    loading: true,
    error: null,
    initialized: false,
    isAuthenticated: false,
  });
  
  const fetchExpertProfile = useCallback(async (userId: string) => {
    try {
      console.log(`Fetching expert profile for user ID: ${userId}`);
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }
      
      if (!data) {
        console.log('No expert profile found for user ID:', userId);
        return null;
      }
      
      console.log('Expert profile found:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  const setExpertProfile = useCallback((expert: ExpertProfile | null) => {
    console.log('Setting expert profile:', expert ? `ID: ${expert.id}` : 'null');
    setAuthState(prev => ({ 
      ...prev, 
      currentExpert: expert, 
      isAuthenticated: !!expert,
      loading: false
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({ ...prev, loading }));
  }, []);

  const { 
    login, 
    logout, 
    register, 
    hasUserAccount 
  } = useExpertAuthentication(
    setExpertProfile,
    setLoading,
    fetchExpertProfile
  );
  
  const { 
    updateProfile, 
    updateAvailability, 
    updateServices 
  } = useExpertProfile(
    authState.currentExpert,
    setExpertProfile
  );

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
    
    // Set up auth state change listener
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchExpertProfile, setLoading]);

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

  return {
    ...authState,
    login,
    logout,
    register,
    hasUserAccount,
    updateProfile,
    updateAvailability,
    updateServices,
    // Add aliases to match the updated interface
    isLoading: authState.loading,
    authInitialized: authState.initialized
  };
};
