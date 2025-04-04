
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useExpertAuthentication } from './useExpertAuthentication';
import { useExpertProfile } from './useExpertProfile';
import { ExpertProfile, ExpertAuthState, UseExpertAuthReturn, ExpertRegistrationData } from './types';

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // This function will fetch the expert profile from the database
  const fetchExpertProfile = async (userId: string): Promise<ExpertProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }
      
      return data as ExpertProfile;
    } catch (error) {
      console.error('Unexpected error fetching expert profile:', error);
      return null;
    }
  };

  // Import the authentication functions
  const {
    login,
    logout,
    register,
    isUserLoggedIn,
    hasUserAccount
  } = useExpertAuthentication(setExpert, setLoading, fetchExpertProfile);

  // Import profile update functionality
  const { updateProfile } = useExpertProfile(expert, setExpert, setLoading);

  // Initialization effect to check for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // There's an active session, try to fetch the expert profile
          const profile = await fetchExpertProfile(data.session.user.id);
          if (profile) {
            console.log('Found existing expert profile');
            setExpert(profile);
          } else {
            console.log('No expert profile found for logged in user');
            // Handle case where user is authenticated but no expert profile exists
            await logout(); // Log them out if no profile exists
          }
        }
      } catch (error) {
        console.error('Error initializing expert auth:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
        setAuthInitialized(true);
      }
    };
    
    initializeAuth();
  }, []);

  // Construct the auth state and return
  const authState: ExpertAuthState = {
    isAuthenticated: !!expert,
    isLoading: loading,
    currentExpert: expert
  };

  return {
    ...authState,
    expert,
    loading,
    authInitialized,
    hasUserAccount,
    login,
    logout,
    register,
    updateProfile
  };
};
