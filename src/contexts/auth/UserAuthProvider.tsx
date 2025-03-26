
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { fetchUserProfile } from '@/utils/profileFetcher';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { processReferralCode } from '@/utils/referralUtils';
import { UserAuthContext } from './UserAuthContext';
import { useProfileManagement } from './useProfileManagement';
import { useExpertInteractions } from './useExpertInteractions';
import { useWalletManagement } from './useWalletManagement';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, signup: authSignup, logout: authLogout, getSession, user, session } = useSupabaseAuth();

  // Import functionality from separate hooks
  const { updateProfile, updateProfilePicture } = useProfileManagement(currentUser, setCurrentUser);
  const { 
    addToFavorites, 
    removeFromFavorites, 
    addReview, 
    reportExpert, 
    hasTakenServiceFrom, 
    getExpertShareLink 
  } = useExpertInteractions(currentUser, setCurrentUser);
  const { rechargeWallet, getReferralLink } = useWalletManagement(currentUser);

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
          
          // Log out the user since they don't have a profile
          setTimeout(() => {
            authLogout();
          }, 500);
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
  }, [user, navigate, authLogout]);

  useEffect(() => {
    // This useEffect will run whenever the session or user changes
    fetchProfile();
    
    // Set a timeout to force loading to complete after 5 seconds if it's stuck
    const timeoutId = setTimeout(() => {
      if (authLoading) {
        console.log("Auth loading timeout reached, forcing completion");
        setAuthLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [user, session, fetchProfile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      console.log("Attempting login in context with:", email);
      const success = await authLogin(email, password);
      console.log("Login in context result:", success);
      
      if (success) {
        // Login successful, but we'll let the fetchProfile handle redirection
        // based on whether a profile exists or not
        toast.success('Login successful');
        return true;
      } else {
        toast.error('Login failed. Please check your credentials.');
        setAuthLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error("Login error in context:", error);
      toast.error(error.message || 'Login failed. Please try again.');
      setAuthLoading(false);
      throw error;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }): Promise<boolean> => {
    console.log("Context: Attempting signup with:", userData.email);
    setAuthLoading(true);
    
    try {
      const success = await authSignup(userData);
      console.log("Context: Signup result:", success);
      
      // If signup was successful and there's a referral code, process it
      if (success && userData.referralCode) {
        try {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            await processReferralCode(userData.referralCode, data.user.id);
          }
        } catch (error) {
          console.error("Error processing referral:", error);
        }
      }
      
      if (success) {
        toast.success('Account created successfully! Please check your email to confirm your account');
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
      return success;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await authLogout();
      setCurrentUser(null);
      
      // Redirect to home page instead of login
      navigate('/');
      toast.info('You have been logged out');
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!user, // Use Supabase user directly
        login,
        signup,
        logout,
        authLoading,
        profileNotFound,
        updateProfile,
        updateProfilePicture,
        addToFavorites,
        removeFromFavorites,
        rechargeWallet,
        addReview,
        reportExpert,
        getExpertShareLink,
        hasTakenServiceFrom,
        getReferralLink,
        user
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
