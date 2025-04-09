import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { Review, Report, NewReview, NewReport } from '@/types/supabase/tables';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean;
  profileNotFound: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: NewReview) => Promise<boolean>;
  reportExpert: (report: NewReport) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
  user: any;
  loading: boolean;
}

export const UserAuthContext = createContext<UserAuthContextType>({} as UserAuthContextType);

export const UserAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      setAuthLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error during session retrieval:", error);
        toast.error("Failed to retrieve session. Please try again.");
      } finally {
        setAuthLoading(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentUser(null);
      }
    });
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    setAuthLoading(true);
    setProfileNotFound(false);
    try {
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        setProfileNotFound(true);
        setCurrentUser(null);
      } else {
        setCurrentUser(userProfile);
      }
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
      setProfileNotFound(true);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        await fetchUserProfile(data.user.id);
        return true;
      }

      return false;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
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

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        await fetchUserProfile(data.user.id);
        return true;
      }

      return false;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return false;
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUser(null);
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
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentUser(updatedProfile);
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
      // Upload the file to Supabase storage
      const filePath = `profile-pictures/${user?.id}/${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error('Failed to upload image. Please try again.');
        return null;
      }

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update the user's profile with the public URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_picture: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        toast.error('Failed to update profile. Please try again.');
        return null;
      }

      // Update local state
      setCurrentUser(prev => ({ ...prev, profile_picture: publicUrl } as UserProfile));
      return publicUrl;
    } catch (error) {
      console.error("Error in updateProfilePicture:", error);
      toast.error('An unexpected error occurred. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (expertId: number): Promise<boolean> => {
    // Placeholder implementation
    console.log(`Adding expert ${expertId} to favorites`);
    return true;
  };

  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    // Placeholder implementation
    console.log(`Removing expert ${expertId} from favorites`);
    return true;
  };

  const rechargeWallet = async (amount: number): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate wallet recharge
      const newBalance = (currentUser?.wallet_balance || 0) + amount;

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', currentUser?.id)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return false;
      }

      setCurrentUser(data);
      toast.success(`Wallet recharged with $${amount}`);
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (review: NewReview): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to add a review');
      return false;
    }

    try {
      const newReview = {
        user_id: currentUser.id,
        expert_id: parseInt(String(review.expertId), 10), // Convert to number for database
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_reviews')
        .insert(newReview)
        .select()

      if (error) throw error;

      // Create a safer way to get the ID
      let newId = `temp_${Date.now()}`;

      if (data && data.length > 0 && data[0].id) {
          newId = data[0].id;
      }

      // Optimistically update the local state
      const adaptedReview: Review = {
        id: newId,
        expertId: review.expertId,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString(),
      };

      const updatedUser = {
        ...currentUser,
        reviews: [...(currentUser.reviews || []), adaptedReview],
      };
      setCurrentUser(updatedUser);

      toast.success('Review added successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
      return false;
    }
  };

  const reportExpert = async (report: NewReport): Promise<boolean> => {
    setLoading(true);
    try {
      const newReport = {
        expertId: report.expertId,
        reason: report.reason,
        details: report.details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      // Insert the new report into the 'expert_reports' table
      const { data, error } = await supabase
        .from('expert_reports')
        .insert([newReport])
        .select()

      if (error) {
        console.error("Error submitting report:", error);
        toast.error('Failed to submit report. Please try again.');
        return false;
      }

      // Optimistically update the local state
      const adaptedReport: Report = {
        id: data[0].id,
        expertId: report.expertId,
        reason: report.reason,
        details: report.details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const updatedUser = {
        ...currentUser,
        reports: [...(currentUser.reports || []), adaptedReport],
      };
      setCurrentUser(updatedUser);

      toast.success('Report submitted successfully! Our team will review it shortly.');
      return true;
    } catch (error: any) {
      console.error("Error reporting expert:", error);
      toast.error('Failed to submit report. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    try {
      // Check if the current user has any past appointments with the expert
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
      console.error("Error in hasTakenServiceFrom:", error);
      return false;
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
    return `${baseUrl}/signup?referralCode=${currentUser.referral_code}`;
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    authLoading,
    profileNotFound,
    updateProfile,
    updateProfilePicture,
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
    loading
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => React.useContext(UserAuthContext);
