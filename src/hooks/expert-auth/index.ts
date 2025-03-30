
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  ExpertProfile, 
  UseExpertAuthReturn, 
  ExpertAuthState 
} from './types';
import { useExpertAuthentication } from './useExpertAuthentication';
import { useExpertProfile } from './useExpertProfile';
import { useExpertCertificates } from './useExpertCertificates';

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  // Create a fetchExpertProfile function that can be used directly
  const fetchExpertProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching expert profile for user ID:", userId);
      
      // Use standard select without attempting to get a single row
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId);

      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('No expert profile found for this user');
        return null;
      }

      // Take the first record if multiple exist
      const expertProfile = data[0] as ExpertProfile;
      console.log('Expert profile retrieved:', expertProfile);
      return expertProfile;
    } catch (error) {
      console.error('Exception in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  const { 
    login, 
    logout, 
    register
  } = useExpertAuthentication(setExpert, setLoading, fetchExpertProfile);
  
  const { updateProfile } = useExpertProfile(expert, setExpert, setLoading);
  const { uploadCertificate, removeCertificate } = useExpertCertificates(expert, setExpert, setLoading);

  // Initialize authentication and fetch expert profile
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Expert auth state changed:', event, session ? 'Has session' : 'No session');
            
            if (!session) {
              setExpert(null);
              setLoading(false);
              return;
            }

            const expertProfile = await fetchExpertProfile(session.user.id);
            
            // Only set the expert profile if we found one
            if (expertProfile) {
              setExpert(expertProfile);
            } else {
              // If no expert profile but we have a session, this is likely a regular user
              setExpert(null);
            }
            
            setLoading(false);
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Found existing session, fetching expert profile');
          const expertProfile = await fetchExpertProfile(session.user.id);
          
          if (expertProfile) {
            setExpert(expertProfile);
          }
        }
        
        setLoading(false);
        setAuthInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing expert auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate, fetchExpertProfile]);

  return {
    expert,
    loading,
    login,
    logout,
    register,
    updateProfile,
    uploadCertificate,
    removeCertificate,
    authInitialized,
    fetchExpertProfile
  };
};

// Export types
export * from './types';
