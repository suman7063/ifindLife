
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
        } else {
          console.error("No user profile found for:", user.id);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setAuthInitialized(true);
      }
    } else {
      setCurrentUser(null);
      setAuthInitialized(true);
    }
  }, [user]);

  useEffect(() => {
    // This useEffect will run whenever the session or user changes
    fetchProfile();
  }, [user, session, fetchProfile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login in context with:", email);
      const success = await authLogin(email, password);
      console.log("Login in context result:", success);
      return success;
    } catch (error) {
      console.error("Login error in context:", error);
      return false;
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
        // Don't fail the signup if referral processing fails
      }
    }
    
    return success;
  };

  const logout = async () => {
    const success = await authLogout();
    if (success) {
      setCurrentUser(null);
      navigate('/login');
      toast.info('You have been logged out');
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        updateProfile,
        updateProfilePicture,
        addToFavorites,
        removeFromFavorites,
        rechargeWallet,
        addReview,
        reportExpert,
        getExpertShareLink,
        hasTakenServiceFrom,
        getReferralLink
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
