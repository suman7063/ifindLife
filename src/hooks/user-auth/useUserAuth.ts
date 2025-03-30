
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/supabase';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';

// First create a hook that only provides the base functionality
export const useUserAuthBase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to fetch user profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setProfileNotFound(true);
        setCurrentUser(null);
        return null;
      }

      if (!data) {
        setProfileNotFound(true);
        setCurrentUser(null);
        return null;
      }

      // Only set authenticated if we have both a user session AND a profile
      setIsAuthenticated(true);
      setCurrentUser(data as UserProfile);
      setProfileNotFound(false);
      return data as UserProfile;
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
      setProfileNotFound(true);
      setCurrentUser(null);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    setAuthLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Has session' : 'No session');
        
        // Clear auth state when user signs out
        if (!session) {
          setUser(null);
          setCurrentUser(null);
          setIsAuthenticated(false);
          setAuthLoading(false);
          return;
        }

        setUser(session.user);
        
        // Check if there's a profile for this user in the profiles table
        // This distinguishes between regular users and experts
        const userProfile = await fetchUserProfile(session.user.id);
        
        // Only set authenticated if we have both a user session AND a profile
        setIsAuthenticated(!!userProfile);
        setAuthLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        const userProfile = await fetchUserProfile(session.user.id);
        setIsAuthenticated(!!userProfile);
      }
      
      setAuthLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Expose the user auth methods and state
  return {
    user,
    currentUser,
    isAuthenticated,
    authLoading,
    profileNotFound,
    fetchUserProfile,
    // Other user auth methods will be added by the context provider
  };
};

// Then create a hook that uses the context for the full set of features
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  
  return context;
};
