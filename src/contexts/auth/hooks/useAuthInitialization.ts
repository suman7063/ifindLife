
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
  const navigate = useNavigate();
  const { user, session } = useSupabaseAuth();

  // Function to directly control loading state
  const setLoading = useCallback((loading: boolean) => {
    setAuthLoading(loading);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setCurrentUser(null);
      setProfileNotFound(false);
      setAuthInitialized(true);
      setAuthLoading(false);
      return;
    }
    
    console.log("Fetching user profile for:", user.id);
    try {
      setAuthLoading(true);
      const userProfile = await fetchUserProfile(user);
      
      if (userProfile) {
        console.log("User profile fetched:", userProfile.id);
        setCurrentUser(userProfile);
        setProfileNotFound(false);
        
        // Only redirect if user is on login page and this isn't an initial load
        if (authInitialized && 
            (window.location.pathname.includes('/login') || 
             window.location.pathname.includes('/user-login'))) {
          console.log("Redirecting to dashboard after successful profile fetch");
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
      
      // Don't toast error on initial load
      if (authInitialized) {
        toast.error("Could not load your profile. Please try again or register for a new account.");
      }
    } finally {
      setAuthInitialized(true);
      setAuthLoading(false);
    }
  }, [user, navigate, authInitialized]);

  // Add a maximum loading timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (authLoading) {
      timeoutId = setTimeout(() => {
        console.log("Maximum auth loading time reached");
        setAuthLoading(false);
        setAuthInitialized(true);
      }, 2000); // 2 seconds maximum loading time
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authLoading]);

  return [
    { currentUser, authInitialized, authLoading, profileNotFound }, 
    setCurrentUser,
    fetchProfile,
    setLoading
  ];
};
