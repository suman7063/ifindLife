
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { fetchUserProfile } from '@/utils/userProfileUtils';
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
  const [authLoading, setAuthLoading] = useState(false);
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
        const userProfile = await fetchUserProfile(user);
        if (userProfile) {
          console.log("User profile fetched:", userProfile);
          setCurrentUser(userProfile);
          // If user has successfully logged in and we have their profile, navigate to dashboard
          if (!window.location.pathname.includes('/user-dashboard')) {
            console.log("Redirecting to dashboard after successful profile fetch");
            navigate('/user-dashboard');
          }
        } else {
          console.error("No user profile found for:", user.id);
          // If we can't find a profile, we might need to create one or handle this case
          // For now, we'll still consider the user as authenticated, even without a profile
          if (!window.location.pathname.includes('/user-dashboard') && 
              window.location.pathname.includes('/user-login')) {
            console.log("Redirecting to dashboard even without profile");
            navigate('/user-dashboard');
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Even if there's an error fetching the profile, we'll still redirect
        // This is a fallback to ensure users don't get stuck on the login page
        if (!window.location.pathname.includes('/user-dashboard') && 
            window.location.pathname.includes('/user-login')) {
          console.log("Redirecting to dashboard despite profile fetch error");
          navigate('/user-dashboard');
        }
      } finally {
        setAuthInitialized(true);
        setAuthLoading(false);
      }
    } else {
      setCurrentUser(null);
      setAuthInitialized(true);
      setAuthLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    // This useEffect will run whenever the session or user changes
    fetchProfile();
  }, [user, session, fetchProfile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      console.log("Attempting login in context with:", email);
      const success = await authLogin(email, password);
      console.log("Login in context result:", success);
      
      if (success) {
        console.log("Login successful, navigating to dashboard");
        toast.success('Login successful');
        // Forcefully navigate to dashboard after a brief timeout
        // This ensures the user isn't stuck on the login page
        setTimeout(() => {
          if (window.location.pathname.includes('/user-login')) {
            navigate('/user-dashboard');
          }
        }, 1500);
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
      const success = await authLogout();
      if (success) {
        setCurrentUser(null);
        navigate('/login');
        toast.info('You have been logged out');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('An error occurred during logout');
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
