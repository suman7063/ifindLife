
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertAuthState } from '../types/authStateTypes';
import { ExpertProfile } from '../../types';
import { toast } from 'sonner';

export const useInitialSessionCheck = (
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
          } else if (expertProfile.status === 'rejected') {
            toast.error('Your expert account has been rejected. Please check your email for details.');
            
            // Redirect to login page with status
            setTimeout(() => {
              window.location.href = '/expert-login?status=rejected';
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
  
  return { authState, setAuthState };
};
