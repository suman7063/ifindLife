
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  ExpertProfile, 
  UseExpertAuthReturn
} from './types';
import { useExpertAuthentication } from './useExpertAuthentication';
import { useExpertProfile } from './useExpertProfile';
import { useExpertCertificates } from './useExpertCertificates';

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Create a fetchExpertProfile function that can be used directly
  const fetchExpertProfile = useCallback(async (userId: string) => {
    try {
      if (!isMounted.current) return null;
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
    register,
    isUserLoggedIn
  } = useExpertAuthentication(setExpert, setLoading, fetchExpertProfile);
  
  const { updateProfile } = useExpertProfile(expert, setExpert, setLoading);
  const { uploadCertificate, removeCertificate } = useExpertCertificates(expert, setExpert, setLoading);

  // Handle session state changes and cleanup properly
  useEffect(() => {
    isMounted.current = true;
    console.log('Initializing expert auth');
    setLoading(true);

    const initAuth = async () => {
      try {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted.current) return;
            
            console.log('Expert auth state changed:', event, session ? 'Has session' : 'No session');
            
            if (!session) {
              setExpert(null);
              setLoading(false);
              setAuthInitialized(true);
              return;
            }

            // Use setTimeout to break potential Supabase event loop
            setTimeout(async () => {
              if (!isMounted.current) return;
              
              console.log('Expert auth state event - fetching profile for:', session.user.id);
              const expertProfile = await fetchExpertProfile(session.user.id);
              
              if (expertProfile && isMounted.current) {
                console.log('Expert profile found after auth state change');
                setExpert(expertProfile);
              } else if (isMounted.current) {
                // If no expert profile but we have a session, this is likely a regular user
                console.log('No expert profile found after auth state change');
                setExpert(null);
              }
              
              if (isMounted.current) {
                setLoading(false);
                setAuthInitialized(true);
              }
            }, 0);
          }
        );

        // Store subscription reference for cleanup
        subscriptionRef.current = data.subscription;

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted.current) {
          console.log('Found existing session, fetching expert profile');
          const expertProfile = await fetchExpertProfile(session.user.id);
          
          if (isMounted.current) {
            if (expertProfile) {
              console.log('Expert profile found on init');
              setExpert(expertProfile);
            } else {
              console.log('No expert profile found on init');
              setExpert(null);
            }
            setLoading(false);
            setAuthInitialized(true);
          }
        } else if (isMounted.current) {
          setLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing expert auth:', error);
        if (isMounted.current) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    initAuth();

    // Set a maximum timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current && loading) {
        console.log('Expert auth loading timeout reached');
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 3000);
    
    return () => {
      isMounted.current = false;
      
      // Clean up subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [navigate, fetchExpertProfile]);

  // Function to check if someone is logged in with this email but as a user
  const hasUserAccount = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        return false;
      }
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', data.session.user.id)
        .maybeSingle();
        
      return userProfile?.email === email;
    } catch (error) {
      console.error('Error checking for user account:', error);
      return false;
    }
  }, []);

  return {
    expert,
    loading,
    login,
    logout,
    register,
    updateProfile,
    uploadCertificate, // This now matches the correct type signature
    removeCertificate,
    authInitialized,
    fetchExpertProfile,
    isUserLoggedIn,
    hasUserAccount
  };
};

// Export types
export * from './types';
