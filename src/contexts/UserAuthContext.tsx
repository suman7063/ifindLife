
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { AuthUser, AuthSession } from '@/types/supabase/auth';
import { handleAuthError } from '@/lib/authUtils';
import { toast } from 'sonner';

// Define the context type
export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean;
  profileNotFound: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: any) => Promise<boolean>;
  reportExpert: (report: any) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string; 
  getReferralLink: () => string | null;
  user: AuthUser | null;
  loading: boolean;
  updateProfilePicture: (file: File) => Promise<string | null>;
}

// Create the context with a default empty value
export const UserAuthContext = createContext<UserAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  authLoading: false,
  profileNotFound: false,
  updateProfile: async () => false,
  updatePassword: async () => false,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  rechargeWallet: async () => false,
  addReview: async () => false,
  reportExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => '',
  getReferralLink: () => null,
  user: null,
  loading: true,
  updateProfilePicture: async () => null
});

// Provider component
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);

  // Initialize auth state by setting up listener and checking for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        setUser(session?.user as AuthUser || null);
        
        if (session?.user) {
          // Only fetch profile after a small delay to avoid race conditions
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as AuthUser || null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setProfileNotFound(true);
        setCurrentUser(null);
      } else if (data) {
        setCurrentUser(data);
        setProfileNotFound(false);
      } else {
        setProfileNotFound(true);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setProfileNotFound(true);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        handleAuthError(error, 'Login failed');
        return false;
      }

      return !!data.session;
    } catch (error: any) {
      handleAuthError(error, 'Login failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign up user
  const signup = async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name,
            phone: userData?.phone
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        handleAuthError(error, 'Signup failed');
        return false;
      }

      if (!data.user) {
        toast.error('Signup failed: No user data returned');
        return false;
      }

      // Create user profile
      const profile = {
        id: data.user.id,
        name: userData?.name || '',
        email: email,
        phone: userData?.phone || '',
        country: userData?.country || '',
        city: userData?.city || '',
        created_at: new Date().toISOString(),
        avatar_url: userData?.avatar_url || null,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        referred_by: referralCode || null
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profile]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error('Account created but profile setup failed. Please contact support.');
      }

      toast.success('Signup successful! Please check your email for verification.');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Signup failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout user
  const logout = async (): Promise<boolean> => {
    try {
      setAuthLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleAuthError(error, 'Logout failed');
        return false;
      }
      
      setUser(null);
      setCurrentUser(null);
      toast.success('Successfully logged out');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Logout failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      setAuthLoading(true);
      
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        handleAuthError(error, 'Profile update failed');
        return false;
      }

      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Profile update failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Update password
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      
      if (!user) {
        toast.error('You must be logged in to update your password');
        return false;
      }

      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        handleAuthError(error, 'Password update failed');
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Password update failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Update profile picture
  const updateProfilePicture = async (file: File): Promise<string | null> => {
    try {
      setAuthLoading(true);
      
      if (!user) {
        toast.error('You must be logged in to update your profile picture');
        return null;
      }

      const fileName = `${user.id}-${Date.now()}`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        handleAuthError(uploadError, 'Profile picture upload failed');
        return null;
      }

      const avatarUrl = `${supabase.storageUrl}/object/avatars/${fileName}`;

      await updateProfile({ avatar_url: avatarUrl });
      
      return avatarUrl;
    } catch (error: any) {
      handleAuthError(error, 'Profile picture update failed');
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // Add to favorites (placeholder implementation)
  const addToFavorites = async (expertId: number): Promise<boolean> => {
    toast.info('Add to favorites functionality not fully implemented yet');
    return false;
  };

  // Remove from favorites (placeholder implementation)
  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    toast.info('Remove from favorites functionality not fully implemented yet');
    return false;
  };

  // Recharge wallet (placeholder implementation)
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    toast.info('Wallet recharge functionality not fully implemented yet');
    return false;
  };

  // Add review (placeholder implementation)
  const addReview = async (review: any): Promise<boolean> => {
    toast.info('Review functionality not fully implemented yet');
    return false;
  };

  // Report expert (placeholder implementation)
  const reportExpert = async (report: any): Promise<boolean> => {
    toast.info('Report functionality not fully implemented yet');
    return false;
  };

  // Check if user has taken service from expert (placeholder implementation)
  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    return false;
  };

  // Get expert share link (placeholder implementation)
  const getExpertShareLink = (expertId: string | number): string => {
    return `${window.location.origin}/experts/${expertId}`;
  };

  // Get referral link (placeholder implementation)
  const getReferralLink = (): string | null => {
    if (!currentUser?.referral_code) return null;
    return `${window.location.origin}/register?ref=${currentUser.referral_code}`;
  };

  // Context value
  const authContextValue: UserAuthContextType = {
    currentUser,
    isAuthenticated: !!user,
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
    updateProfilePicture
  };

  return (
    <UserAuthContext.Provider value={authContextValue}>
      {children}
    </UserAuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
