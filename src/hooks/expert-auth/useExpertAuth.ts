
import { useState, useCallback } from 'react';
import { ExpertProfile, UseExpertAuthReturn } from './types';
import { useExpertAuthentication } from './useExpertAuthentication';
import { useExpertProfile } from './useExpertProfile';
import { useFetchExpertProfile } from './auth/useFetchExpertProfile';
import { useExpertInitialization } from './auth/useExpertInitialization';

export const useExpertAuth = (): UseExpertAuthReturn => {
  // State management hooks
  const [loading, setLoading] = useState(true);
  
  // Custom hook for fetching expert profile
  const { fetchExpertProfile } = useFetchExpertProfile();
  
  // Set expert profile callback
  const setExpertProfile = useCallback((expert: ExpertProfile | null) => {
    console.log('Setting expert profile:', expert ? `ID: ${expert.id}` : 'null');
    if (expert) {
      setAuthState(prev => ({ 
        ...prev, 
        currentExpert: expert, 
        isAuthenticated: true,
        loading: false
      }));
    } else {
      setAuthState(prev => ({
        ...prev,
        currentExpert: null,
        isAuthenticated: false,
        loading: false
      }));
    }
  }, []);
  
  // Use the expert initialization hook
  const { authState, setAuthState } = useExpertInitialization(
    fetchExpertProfile,
    setLoading
  );

  // Use the authentication hooks
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
  
  // Use the profile management hook
  const { 
    updateProfile, 
    updateAvailability, 
    updateServices 
  } = useExpertProfile(
    authState.currentExpert,
    setExpertProfile
  );

  // Return the combined state and methods
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
    isLoading: loading,
    authInitialized: authState.initialized
  };
};
