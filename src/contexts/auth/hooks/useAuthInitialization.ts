
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
  () => Promise<void>
] => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const navigate = useNavigate();
  const { user, session } = useSupabaseAuth();

  const fetchProfile = useCallback(async () => {
    if (user) {
      console.log("Fetching user profile for:", user.id);
      try {
        setAuthLoading(true);
        const userProfile = await fetchUserProfile(user);
        
        if (userProfile) {
          console.log("User profile fetched:", userProfile);
          setCurrentUser(userProfile);
          setProfileNotFound(false);
          
          // If user is on login or user-login page, and has successfully logged in,
          // redirect to dashboard
          if (window.location.pathname.includes('/login') || window.location.pathname.includes('/user-login')) {
            console.log("Redirecting to dashboard after successful profile fetch");
            navigate('/user-dashboard');
          }
        } else {
          console.error("No user profile found for:", user.id);
          setProfileNotFound(true);
          toast.error("Profile not found. Please register to create an account.");
          
          // Redirect back to login page if no profile
          if (!window.location.pathname.includes('/user-login')) {
            navigate('/user-login');
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfileNotFound(true);
        toast.error("Could not load your profile. Please try again or register for a new account.");
        
        // Redirect back to login page if profile fetch fails
        if (!window.location.pathname.includes('/user-login')) {
          navigate('/user-login');
        }
      } finally {
        setAuthInitialized(true);
        setAuthLoading(false);
      }
    } else {
      setCurrentUser(null);
      setProfileNotFound(false);
      setAuthInitialized(true);
      setAuthLoading(false);
    }
  }, [user, navigate]);

  return [
    { currentUser, authInitialized, authLoading, profileNotFound }, 
    setCurrentUser,
    fetchProfile
  ];
};
