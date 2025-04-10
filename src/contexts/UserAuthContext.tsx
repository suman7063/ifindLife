
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase/userProfile';
import { toast } from 'sonner';
import { UserAuthContextType } from './auth/UserAuthContext';
import { getPublicUrl } from '@/utils/storage';

// Create the context with a default empty object
export const UserAuthContext = createContext<UserAuthContextType>({} as UserAuthContextType);

// Custom hook to use the auth context
export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

// Provider component
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        if (session?.user) {
          // Fetch user profile here
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setProfileNotFound(true);
          } else {
            setCurrentUser(profileData as UserProfile);
            setProfileNotFound(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        if (session?.user) {
          // Fetch user profile here
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setProfileNotFound(true);
          } else {
            setCurrentUser(profileData as UserProfile);
            setProfileNotFound(false);
          }
        } else {
          setCurrentUser(null);
          setProfileNotFound(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfilePicture = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to update your profile picture');
      return null;
    }

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Error uploading profile picture');
        return null;
      }

      // Get the public URL safely using a utility function
      const publicUrl = getPublicUrl('avatars', filePath);

      // Update the user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile with new picture:', updateError);
        toast.error('Error updating profile');
        return null;
      }

      // Update the local state
      setCurrentUser((prev) => prev ? { ...prev, profile_picture: publicUrl } : null);
      toast.success('Profile picture updated');
      
      return publicUrl;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  // Add the required methods to match the UserAuthContextType
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const signup = async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            ...userData,
            referral_code: referralCode
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Signup successful! Please check your email to verify your account.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      return false;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);
        
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('An error occurred while updating your password');
      return false;
    }
  };

  // Add more required methods with placeholder implementations
  const addToFavorites = async (expertId: number): Promise<boolean> => {
    toast.info(`Adding expert #${expertId} to favorites`);
    return true;
  };

  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    toast.info(`Removing expert #${expertId} from favorites`);
    return true;
  };

  const rechargeWallet = async (amount: number): Promise<boolean> => {
    toast.info(`Recharging wallet with ${amount}`);
    return true;
  };

  const addReview = async (review: any): Promise<boolean> => {
    toast.info(`Adding review for expert #${review.expertId}`);
    return true;
  };

  const reportExpert = async (report: any): Promise<boolean> => {
    toast.info(`Reporting expert #${report.expertId}`);
    return true;
  };

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    return true;
  };

  const getExpertShareLink = (expertId: string | number): string => {
    return `/expert/${expertId}?shared=true`;
  };

  const getReferralLink = (): string | null => {
    if (!currentUser?.referral_code) return null;
    return `/signup?ref=${currentUser.referral_code}`;
  };

  return (
    <UserAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authLoading: loading,
        loading,
        user,
        login,
        signup,
        logout,
        updateProfile,
        updatePassword,
        updateProfilePicture,
        profileNotFound,
        addToFavorites,
        removeFromFavorites,
        rechargeWallet,
        addReview,
        reportExpert,
        hasTakenServiceFrom,
        getExpertShareLink,
        getReferralLink
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export { UserAuthProvider };
