
import React, { createContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase';
import { useAuthSession, useAuthLogin, useAuthLogout, useAuthPassword } from '@/features/auth';
import { useUserReviews } from '@/features/reviews';
import { UserAuthContextType } from './auth/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Review, Report, NewReview, NewReport } from '@/types/supabase/tables';

export const UserAuthContext = createContext<UserAuthContextType>({} as UserAuthContextType);

export const UserAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { getSession } = useAuthSession(setLoading, setSession);
  const { login } = useAuthLogin(setLoading, setSession);
  const { logout } = useAuthLogout(setLoading);
  const { updatePassword } = useAuthPassword(setLoading);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);

  useEffect(() => {
    const fetchSession = async () => {
      setAuthLoading(true);
      const currentSession = await getSession();
      if (currentSession) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        setAuthLoading(false);
      }
    };

    fetchSession();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setAuthLoading(true);
    try {
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setProfileNotFound(true);
      } else if (userProfile) {
        setCurrentUser(userProfile);
        setUser(userProfile);
      } else {
        setProfileNotFound(true);
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      setProfileNotFound(true);
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city || '',
            referralCode: referralCode || null,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data?.user?.identities?.length === 0) {
        toast.error('This email is already registered. Please login instead.');
        return false;
      }

      toast.success('Account created successfully! Please check your email for verification.');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', currentUser?.id)
        .single();

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentUser({ ...currentUser, ...updatedProfile });
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePicture = async (file: File): Promise<string | null> => {
    setLoading(true);
    try {
      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      const filePath = `profile-pictures/${currentUser.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Error uploading image:", error);
        toast.error('Failed to upload image. Please try again.');
        return null;
      }

      const publicURL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;

      // Update user profile with the new profile picture URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_picture: publicURL })
        .eq('id', currentUser.id);

      if (updateError) {
        console.error("Error updating profile picture URL:", updateError);
        toast.error('Failed to update profile picture URL. Please try again.');
        return null;
      }

      setCurrentUser({ ...currentUser, profilePicture: publicURL });
      toast.success('Profile picture updated successfully!');
      return publicURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (expertId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_favorite_experts')
        .insert([{ user_id: currentUser?.id, expert_id: expertId }]);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Expert added to favorites');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_favorite_experts')
        .delete()
        .eq('user_id', currentUser?.id)
        .eq('expert_id', expertId);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Expert removed from favorites');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rechargeWallet = async (amount: number): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate adding funds to the wallet
      const newBalance = (currentUser?.wallet_balance || 0) + amount;

      const { error } = await supabase
        .from('user_profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', currentUser?.id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentUser({ ...currentUser, wallet_balance: newBalance });
      toast.success(`Successfully recharged wallet with $${amount}`);
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reportExpert = async (report: NewReport): Promise<boolean> => {
    setLoading(true);
    try {
      const newReport = {
        expertId: parseInt(String(report.expertId), 10),
        reason: report.reason,
        details: report.details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const { error } = await supabase
        .from('user_reports')
        .insert(newReport);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Report submitted successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Check if the user has any past appointments with the expert
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', currentUser?.id)
        .eq('expert_id', expertId)
        .limit(1);

      if (error) {
        console.error("Error checking appointments:", error);
        return false;
      }

      // If there's at least one appointment, the user has taken service from the expert
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking service history:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getExpertShareLink = (expertId: string | number): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/expert/${expertId}`;
  };

  const getReferralLink = (): string | null => {
    if (!currentUser?.referral_code) {
      return null;
    }
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?referralCode=${currentUser.referral_code}`;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    authLoading,
    profileNotFound,
    updateProfile,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    user,
    loading,
    updateProfilePicture,
    session,
    expertId: null,
    isExpertUser: false,
    userSettings: null,
    walletBalance: currentUser?.wallet_balance || 0,
    referrals: [],
    profileLoading: loading,
    profileError: null,
    favoritesCount: 0,
    authError: null,
    refreshFavoritesCount: async () => Promise.resolve(),
    getReferrals: async () => Promise.resolve([]),
    refreshWalletBalance: async () => Promise.resolve(currentUser?.wallet_balance || 0),
    addFunds: rechargeWallet,
    deductFunds: async () => Promise.resolve(false),
    reviewExpert: async () => Promise.resolve(false),
    updateEmail: async () => Promise.resolve(false),
    resetPassword: async () => Promise.resolve(false),
    sendVerificationEmail: async () => Promise.resolve(false),
    checkIsFavorite: async () => Promise.resolve(false),
    updateUserSettings: async () => Promise.resolve(false)
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => React.useContext(UserAuthContext);
