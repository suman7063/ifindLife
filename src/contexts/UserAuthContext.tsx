import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { UserProfile, Expert, Review, Report, Course, UserTransaction } from '@/types/supabase';

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
  removeFromFavorites: (expertId: number) => void;
  rechargeWallet: (amount: number) => void;
  addReview: (expertId: number, rating: number, comment: string) => void;
  reportExpert: (expertId: number, reason: string, details: string) => void;
  getExpertShareLink: (expertId: number) => string;
  hasTakenServiceFrom: (expertId: number) => boolean;
};

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

const DEFAULT_CURRENCY_MAP: Record<string, string> = {
  'India': 'INR',
  'United States': 'USD',
  'United Kingdom': 'GBP',
  'Canada': 'CAD',
  'Australia': 'AUD',
  // Add more as needed
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setCurrentUser(null);
      }
    });

    // Initial session check
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile when session changes
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile(session.user);
    }
  }, [session]);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Convert from Supabase profile format to our app's User format
        setCurrentUser({
          id: data.id,
          name: data.name,
          email: data.email || authUser.email,
          phone: data.phone,
          country: data.country,
          city: data.city,
          currency: data.currency || 'USD',
          profilePicture: data.profile_picture,
          walletBalance: Number(data.wallet_balance) || 0,
          favoriteExperts: [],  // We'll fetch these separately
          enrolledCourses: [],  // We'll fetch these separately
          transactions: [],     // We'll fetch these separately
          reviews: [],          // We'll fetch these separately
          reports: []           // We'll fetch these separately
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Error loading user profile');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
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
        toast.success(`Welcome back, ${data.user.email}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
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
  }): Promise<boolean> => {
    try {
      // Determine currency based on country
      const currency = DEFAULT_CURRENCY_MAP[userData.country] || 'USD';

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
            currency
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      navigate('/login');
      toast.info('You have been logged out');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          country: profileData.country,
          city: profileData.city,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) {
        throw error;
      }

      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const updateProfilePicture = async (file: File): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Create a readable stream from the file
      const { error: uploadError } = await supabase.storage
        .from('user-profiles')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('user-profiles')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile with new picture URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture: publicUrl })
        .eq('id', currentUser.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setCurrentUser(prev => prev ? { ...prev, profilePicture: publicUrl } : null);
      toast.success('Profile picture updated successfully');
      return publicUrl;
    } catch (error: any) {
      console.error('Error updating profile picture:', error);
      toast.error(error.message || 'Failed to update profile picture');
      throw error;
    }
  };

  const addToFavorites = (expert: Expert) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const removeFromFavorites = (expertId: number) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const rechargeWallet = (amount: number) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const hasTakenServiceFrom = (expertId: number): boolean => {
    if (!currentUser) return false;
    // Stub implementation
    return false;
  };

  const addReview = (expertId: number, rating: number, comment: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };
  
  const reportExpert = (expertId: number, reason: string, details: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };
  
  const getExpertShareLink = (expertId: number): string => {
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
        updateProfilePicture,
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

export { Expert, Review, Report, Course, UserTransaction };
