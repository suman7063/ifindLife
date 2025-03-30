
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { useUserDataFetcher } from './useUserDataFetcher';
import { useUserProfileManagement } from './useUserProfileManagement';
import { useUserFavorites } from './useUserFavorites';
import { useUserReviews } from './useUserReviews';
import { useUserReports } from './useUserReports';
import { useUserWallet } from './useUserWallet';
import { useExpertInteraction } from './useExpertInteraction';
import { User } from '@supabase/supabase-js';

export const useUserAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Import functionality from separate hooks
  const { fetchUserData } = useUserDataFetcher(setCurrentUser, setLoading);
  const { updateProfileData } = useUserProfileManagement(currentUser, setCurrentUser);
  const { addToFavorites, removeFromFavorites } = useUserFavorites(currentUser, setCurrentUser);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);
  const { addReport: reportExpert } = useUserReports(currentUser, setCurrentUser);
  const { rechargeWallet } = useUserWallet(currentUser, setCurrentUser);
  const { hasTakenServiceFrom, getExpertShareLink } = useExpertInteraction(currentUser);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Has session" : "No session");
        
        setSession(session);
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);
        
        if (session?.user?.id) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Has session" : "No session");
        
        setSession(session);
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);
        
        if (session?.user?.id) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      return !!data.session;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userMetadata: Record<string, any> = {},
    referralCode?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userMetadata,
            referral_code: referralCode
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Sign up successful! Please check your email for verification.");
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  // Password management
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error(error.message || 'Failed to update password');
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || 'Failed to update password');
      return false;
    }
  };

  // This function can be used to update the profile after sign up
  const updateProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    // Delegate to the profile management hook
    return updateProfileData(userData);
  };

  return {
    currentUser,
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    signup,
    updatePassword,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert,
    rechargeWallet,
    hasTakenServiceFrom,
    getExpertShareLink,
  };
};
