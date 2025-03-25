
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  updateProfilePicture 
} from '@/utils/userProfileUtils';
import { UserProfile, Expert, Review, Report, Course, UserTransaction, User } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { processReferralCode } from '@/utils/referralUtils';

// Re-export the useUserAuth hook for backwards compatibility
import { useUserAuth } from '@/hooks/useUserAuth';
export { useUserAuth };

type UserAuthContextType = {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  updateProfilePicture: (file: File) => Promise<string>;
  addToFavorites: (expert: Expert) => void;
  removeFromFavorites: (expertId: string) => void;
  rechargeWallet: (amount: number) => void;
  addReview: (expertId: string, rating: number, comment: string) => void;
  reportExpert: (expertId: string, reason: string, details: string) => void;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => boolean;
  getReferralLink: () => string;
};

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { login: authLogin, signup: authSignup, logout: authLogout, getSession, user, session } = useSupabaseAuth();

  useEffect(() => {
    // This useEffect will run whenever the session or user changes
    const fetchProfile = async () => {
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
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchProfile();
  }, [user, session]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await authLogin(email, password);
      return success;
    } catch (error) {
      console.error("Login error:", error);
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
    const success = await authSignup(userData);
    
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

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser || !currentUser.id) return;

    const result = await updateUserProfile(currentUser.id, profileData);
    if (result) {
      setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
    }
  };

  const handleUpdateProfilePicture = async (file: File): Promise<string> => {
    if (!currentUser || !currentUser.id) throw new Error('User not authenticated');

    const publicUrl = await updateProfilePicture(currentUser.id, file);
    setCurrentUser(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        profilePicture: publicUrl 
      };
    });
    return publicUrl;
  };

  const addToFavorites = (expert: Expert) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const removeFromFavorites = (expertId: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const rechargeWallet = (amount: number) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const hasTakenServiceFrom = (expertId: string): boolean => {
    if (!currentUser) return false;
    return false;
  };

  const addReview = (expertId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };
  
  const reportExpert = (expertId: string, reason: string, details: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };
  
  const getExpertShareLink = (expertId: string): string => {
    return `${window.location.origin}/experts/${expertId}?ref=${currentUser?.id || 'guest'}`;
  };
  
  const getReferralLink = (): string => {
    if (!currentUser?.referralCode) return '';
    return `${window.location.origin}/signup?ref=${currentUser.referralCode}`;
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
        updateProfilePicture: handleUpdateProfilePicture,
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

export type { UserProfile, Expert, Review, Report, Course, UserTransaction, User };
