
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { fetchUserProfile } from '@/utils/profileFetcher';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

export interface AuthInitializationState {
  currentUser: UserProfile | null;
  authInitialized: boolean;
  authLoading: boolean;
  profileNotFound: boolean;
}

export const useAuthInitialization = (): [
  AuthInitializationState,
  React.Dispatch<React.SetStateAction<UserProfile | null>>,
  () => Promise<void>,
  (loading: boolean) => void
] => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [profileFetchInProgress, setProfileFetchInProgress] = useState(false);
  const navigate = useNavigate();
  const { user, session } = useSupabaseAuth();

  // Function to directly control loading state
  const setLoading = useCallback((loading: boolean) => {
    setAuthLoading(loading);
    if (!loading) {
      setAuthInitialized(true);
    }
  }, []);

  // Modified to handle id as string
  const fetchProfile = useCallback(async () => {
    if (profileFetchInProgress) return;
    
    try {
      setProfileFetchInProgress(true);
      
      if (!user) {
        console.log("No user available for profile fetch");
        setCurrentUser(null);
        setProfileNotFound(false);
        setAuthInitialized(true);
        setAuthLoading(false);
        return;
      }
      
      console.log("Fetching user profile for:", user.id);
      const userProfile = await fetchUserProfile(user.id);
      
      if (userProfile) {
        console.log("User profile fetched successfully:", userProfile.id);
        setCurrentUser(userProfile);
        setProfileNotFound(false);
        
        // Only redirect if user is on login page and this isn't an initial load
        if (authInitialized && window.location.pathname.includes('/login')) {
          console.log("Redirecting to dashboard after successful profile fetch");
          // Use navigate instead of directly modifying window.location for better React integration
          navigate('/user-dashboard');
        }
      } else {
        console.error("No user profile found for:", user.id);
        setProfileNotFound(true);
        setCurrentUser(null);
        
        // Don't toast error on initial load
        if (authInitialized) {
          toast.error("Profile not found. Please register to create an account.");
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileNotFound(true);
      setCurrentUser(null);
    } finally {
      setAuthInitialized(true);
      setAuthLoading(false);
      setProfileFetchInProgress(false);
    }
  }, [user, navigate, authInitialized]);

  // Add a maximum loading timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (authLoading) {
        console.log("Maximum auth loading time reached");
        setAuthLoading(false);
        setAuthInitialized(true);
      }
    }, 3000); // 3 seconds maximum loading time
    
    return () => clearTimeout(timeoutId);
  }, [authLoading]);

  return [
    { currentUser, authInitialized, authLoading, profileNotFound }, 
    setCurrentUser,
    fetchProfile,
    setLoading
  ];
};
