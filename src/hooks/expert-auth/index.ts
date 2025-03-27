
import { useState, useEffect } from 'react';
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

  const { 
    login, 
    logout, 
    register, 
    fetchExpertProfile 
  } = useExpertAuthentication(setExpert, setLoading);
  
  const { updateProfile } = useExpertProfile(expert, setExpert, setLoading);
  const { uploadCertificate, removeCertificate } = useExpertCertificates(expert, setExpert, setLoading);

  // Initialize authentication and fetch expert profile
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session ? 'Has session' : 'No session');
            
            if (!session) {
              setExpert(null);
              setLoading(false);
              return;
            }

            const expertProfile = await fetchExpertProfile(session.user.id);
            setExpert(expertProfile);
            setLoading(false);
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Found existing session, fetching expert profile');
          const expertProfile = await fetchExpertProfile(session.user.id);
          setExpert(expertProfile);
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
    authInitialized
  };
};

// Export types
export * from './types';
