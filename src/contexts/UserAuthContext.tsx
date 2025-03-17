
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
};

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { login: authLogin, signup: authSignup, logout: authLogout, getSession } = useSupabaseAuth();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setCurrentUser(null);
      }
    });

    const initializeAuth = async () => {
      const session = await getSession();
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        if (userProfile) {
          setCurrentUser(userProfile);
        }
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const success = await authLogin(email, password);
    return success;
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
  }): Promise<boolean> => {
    const success = await authSignup(userData);
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
        hasTakenServiceFrom
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export type { UserProfile, Expert, Review, Report, Course, UserTransaction, User };
