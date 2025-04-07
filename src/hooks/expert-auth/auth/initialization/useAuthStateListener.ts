
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertAuthState } from '../types/authStateTypes';
import { ExpertProfile } from '../../types';
import { toast } from 'sonner';

export const useAuthStateListener = (
  authState: ExpertAuthState,
  setAuthState: React.Dispatch<React.SetStateAction<ExpertAuthState>>,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
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
  }, [fetchExpertProfile, setAuthState]);
};
