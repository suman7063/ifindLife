import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  Session,
  User,
  AuthChangeEvent,
  SupabaseClient,
} from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  UserProfile,
  ReferralSettings as UserReferralSettings,
} from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';
import { Database } from '@/types/supabase';

interface AuthContextProps {
  supabaseClient: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isLoading: boolean;
  isExpert: boolean;
  isLoggedIn: boolean;
  isExpertLoggedIn: boolean;
  authState: AuthChangeEvent | null;
  error: Error | null;
  referralSettings: UserReferralSettings | null;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  hasDualSessions: boolean;
  isAuthenticated: boolean;
  role: 'admin' | 'user' | 'expert' | null;
  state: any;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (updates: UserProfile) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: ExpertProfile) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshExpertProfile: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string | null>;
  updateProfilePicture: (file: File) => Promise<string>;
  uploadExpertProfilePicture: (file: File) => Promise<string | null>;
  deleteProfilePicture: () => Promise<boolean>;
  deleteExpertProfilePicture: () => Promise<boolean>;
  fetchReferralSettings: () => Promise<void>;
  clearSession: () => void;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  reviewExpert: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
  addFunds: (amount: number) => Promise<boolean>;
}

type Table = keyof Database['public']['Tables'];

const AuthContext = createContext<AuthContextProps>({
  supabaseClient: null,
  session: null,
  user: null,
  userProfile: null,
  expertProfile: null,
  isLoading: true,
  isExpert: false,
  isLoggedIn: false,
  isExpertLoggedIn: false,
  authState: null,
  error: null,
  referralSettings: null,
  sessionType: 'none',
  hasDualSessions: false,
  isAuthenticated: false,
  role: null,
  state: {},
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  updateProfile: async () => {},
  updateUserProfile: async () => false,
  updateExpertProfile: async () => {},
  refreshUserProfile: async () => {},
  refreshExpertProfile: async () => {},
  uploadProfilePicture: async () => null,
  updateProfilePicture: async () => "",
  uploadExpertProfilePicture: async () => null,
  deleteProfilePicture: async () => false,
  deleteExpertProfilePicture: async () => false,
  fetchReferralSettings: async () => {},
  clearSession: () => {},
  updatePassword: async () => false,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  reviewExpert: async () => false,
  reportExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => "",
  getReferralLink: () => null,
  addFunds: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [supabaseClient] = useState<SupabaseClient>(supabase);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthChangeEvent | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [referralSettings, setReferralSettings] = useState<UserReferralSettings | null>(null);
  const [sessionType, setSessionType] = useState<'none' | 'user' | 'expert' | 'dual'>('none');
  const [hasDualSessions, setHasDualSessions] = useState<boolean>(false);
  const navigate = useNavigate();

  const isExpert = !!expertProfile;
  const isLoggedIn = !!user;
  const isExpertLoggedIn = !!expertProfile;

  useEffect(() => {
    const getInitialSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session: initialSession },
        } = await supabaseClient.auth.getSession();

        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          await Promise.all([
            refreshUserProfile(),
            refreshExpertProfile(),
          ]);
        } else {
          setUserProfile(null);
          setExpertProfile(null);
        }
      } catch (err: any) {
        setError(err);
        console.error('Error fetching initial session:', err);
        toast.error(`Unexpected error occurred: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event);
        setAuthState(event);
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Clear existing profiles
        setUserProfile(null);
        setExpertProfile(null);

        // Fetch profiles if user is authenticated
        if (currentSession?.user) {
          await Promise.all([
            refreshUserProfile(),
            refreshExpertProfile(),
          ]);
        }

        // Determine session type
        if (currentSession?.user) {
          const userType = userProfile ? 'user' : expertProfile ? 'expert' : 'none';
          setSessionType(userType as 'none' | 'user' | 'expert');
        } else {
          setSessionType('none');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  useEffect(() => {
    const checkDualSessions = () => {
      const userSession = !!userProfile;
      const expertSession = !!expertProfile;
      setHasDualSessions(userSession && expertSession);

      if (userSession && expertSession) {
        setSessionType('dual');
      } else if (userSession) {
        setSessionType('user');
      } else if (expertSession) {
        setSessionType('expert');
      } else {
        setSessionType('none');
      }
    };

    checkDualSessions();
  }, [userProfile, expertProfile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error);
        toast.error(`Login failed: ${error.message}`);
        return false;
      } else {
        toast.success('Check your email for the login link.');
        return true;
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
      return false;
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    try {
      if (!user) {
        console.warn('No user to refresh profile for.');
        return;
      }
  
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error(`Error fetching user profile: ${profileError.message}`);
      } else if (profileData) {
        setUserProfile(profileData as UserProfile);
      } else {
        console.warn('No user profile found, setting to null.');
        setUserProfile(null);
      }
    } catch (err: any) {
      console.error('Unexpected error while refreshing user profile:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
    }
  };

  const refreshExpertProfile = async (): Promise<void> => {
    try {
      if (!user) {
        console.warn('No user to refresh expert profile for.');
        return;
      }
  
      const { data: expertData, error: expertError } = await supabaseClient
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', user.id)
        .single();
  
      if (expertError) {
        console.error('Error fetching expert profile:', expertError);
        toast.error(`Error fetching expert profile: ${expertError.message}`);
      } else if (expertData) {
        setExpertProfile(expertData as ExpertProfile);
      } else {
        console.warn('No expert profile found, setting to null.');
        setExpertProfile(null);
      }
    } catch (err: any) {
      console.error('Unexpected error while refreshing expert profile:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
    }
  };

  const updateProfile = async (updates: UserProfile): Promise<void> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('User not logged in');

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        toast.error(`Profile update failed: ${updateError.message}`);
      } else {
        await refreshUserProfile();
        toast.success('Profile updated successfully.');
      }
    } catch (err: any) {
      console.error('Unexpected profile update error:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpertProfile = async (updates: ExpertProfile): Promise<void> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('Expert not logged in');

      const { error: updateError } = await supabaseClient
        .from('expert_profiles')
        .update(updates)
        .eq('auth_id', user.id);

      if (updateError) {
        console.error('Expert profile update error:', updateError);
        toast.error(`Expert profile update failed: ${updateError.message}`);
      } else {
        await refreshExpertProfile();
        toast.success('Expert profile updated successfully.');
      }
    } catch (err: any) {
      console.error('Unexpected expert profile update error:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfilePicture = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      if (!user || !userProfile?.profile_picture) {
        console.warn('No user or profile picture to delete.');
        return false;
      }
  
      // Extract the path from the URL
      const urlParts = userProfile.profile_picture.split('/avatars/');
      if (urlParts.length < 2) {
        console.error('Invalid profile picture URL format.');
        return false;
      }
      const filePath = `avatars/${urlParts[1]}`;
  
      // Delete the file from storage
      const { error: storageError } = await supabaseClient.storage
        .from('avatars')
        .remove([filePath]);
  
      if (storageError) {
        console.error('Storage delete error:', storageError);
        toast.error(`Failed to delete image: ${storageError.message}`);
        return false;
      }
  
      // Update the profile to set profile_picture to null
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ profile_picture: null })
        .eq('id', user.id);
  
      if (updateError) {
        console.error('Profile update error:', updateError);
        toast.error(`Failed to update profile: ${updateError.message}`);
        return false;
      }
  
      await refreshUserProfile();
      toast.success('Profile picture removed successfully.');
      return true;
    } catch (err: any) {
      console.error('Unexpected image deletion error:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  

  const deleteExpertProfilePicture = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      if (!user || !expertProfile?.imageUrl) {
        console.warn('No expert or profile picture to delete.');
        return false;
      }
  
      // Extract the path from the URL
      const urlParts = expertProfile.imageUrl.split('/expert_avatars/');
      if (urlParts.length < 2) {
        console.error('Invalid expert profile picture URL format.');
        return false;
      }
      const filePath = `expert_avatars/${urlParts[1]}`;
  
      // Delete the file from storage
      const { error: storageError } = await supabaseClient.storage
        .from('expert_avatars')
        .remove([filePath]);
  
      if (storageError) {
        console.error('Storage delete error:', storageError);
        toast.error(`Failed to delete image: ${storageError.message}`);
        return false;
      }
  
      // Update the profile to set imageUrl and avatar_url to null
      const { error: updateError } = await supabaseClient
        .from('expert_profiles')
        .update({ imageUrl: null, avatar_url: null })
        .eq('auth_id', user.id);
  
      if (updateError) {
        console.error('Expert profile update error:', updateError);
        toast.error(`Failed to update expert profile: ${updateError.message}`);
        return false;
      }
  
      await refreshExpertProfile();
      toast.success('Expert profile picture removed successfully.');
      return true;
    } catch (err: any) {
      console.error('Unexpected image deletion error:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReferralSettings = async (): Promise<void> => {
    try {
      const { data, error } = await supabaseClient
        .from('referral_settings')
        .select('*')
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching referral settings:', error);
        toast.error(`Failed to fetch referral settings: ${error.message}`);
      } else if (data) {
        setReferralSettings(data as UserReferralSettings);
      } else {
        console.warn('No active referral settings found.');
        setReferralSettings(null);
      }
    } catch (err: any) {
      console.error('Unexpected error while fetching referral settings:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
    }
  };

  const clearSession = () => {
    setSession(null);
    setUser(null);
    setUserProfile(null);
    setExpertProfile(null);
    setSessionType('none');
    setHasDualSessions(false);
  };

  const updateProfilePicture = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No authenticated user');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the image to storage
      const { error: uploadError, data: uploadData } = await supabaseClient
        .storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: urlData } = await supabaseClient
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Update the user profile with the new URL
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error(`Error updating profile: ${updateError.message}`);
      }
      
      await refreshUserProfile();
      return publicUrl;
    } catch (err: any) {
      console.error('Error updating profile picture:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('User not logged in');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the image to storage
      const { error: uploadError } = await supabaseClient
        .storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error(`Failed to upload image: ${uploadError.message}`);
        return null;
      }
      
      // Get the public URL
      const { data: urlData } = await supabaseClient
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Update the user profile with the new URL
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast.error(`Failed to update profile: ${updateError.message}`);
        return null;
      }
      
      await refreshUserProfile();
      toast.success('Profile picture updated successfully');
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(`Logout failed: ${error.message}`);
        return false;
      }
      
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setExpertProfile(null);
      return true;
    } catch (err: any) {
      console.error('Unexpected logout error:', err);
      toast.error(`Unexpected error occurred: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const { error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) return false;
      await refreshUserProfile();
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      return false;
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      
      if (error) {
        console.error('Password update error:', error);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'An error occurred during password update');
      return false;
    }
  };

  const addToFavorites = async (expertId: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('user_favorite_experts')
        .insert({ user_id: user?.id, expert_id: expertId });
      return !error;
    } catch (err) {
      console.error('Error adding to favorites:', err);
      return false;
    }
  };

  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('user_favorite_experts')
        .delete()
        .eq('user_id', user?.id)
        .eq('expert_id', expertId);
      return !error;
    } catch (err) {
      console.error('Error removing from favorites:', err);
      return false;
    }
  };

  const reviewExpert = async (expertId: string, rating: number, comment: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('user_reviews')
        .insert({ 
          user_id: user?.id, 
          expert_id: expertId, 
          rating,
          comment,
          date: new Date().toISOString()
        });
      return !error;
    } catch (err) {
      console.error('Error adding review:', err);
      return false;
    }
  };

  const reportExpert = async (expertId: string, reason: string, details: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('expert_reports')
        .insert({ 
          user_id: user?.id, 
          expert_id: expertId, 
          reason,
          details,
          date: new Date().toISOString(),
          status: 'pending'
        });
      return !error;
    } catch (err) {
      console.error('Error reporting expert:', err);
      return false;
    }
  };

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabaseClient
        .from('user_expert_services')
        .select('id')
        .eq('user_id', user?.id)
        .eq('expert_id', expertId)
        .limit(1);
      
      return !error && data && data.length > 0;
    } catch (err) {
      console.error('Error checking service history:', err);
      return false;
    }
  };

  const getExpertShareLink = (expertId: string | number): string => {
    return `${window.location.origin}/expert/${expertId}`;
  };

  const getReferralLink = (): string | null => {
    if (!userProfile?.referral_code) return null;
    return `${window.location.origin}/signup?ref=${userProfile.referral_code}`;
  };

  const addFunds = async (amount: number): Promise<boolean> => {
    try {
      // This is a placeholder - in a real app, this would connect to a payment processor
      const { error } = await supabaseClient
        .from('user_transactions')
        .insert({
          user_id: user?.id,
          amount,
          type: 'deposit',
          date: new Date().toISOString(),
          description: 'Wallet recharge',
          currency: userProfile?.currency || 'USD'
        });
      
      if (error) return false;
      
      // Update wallet balance
      if (userProfile) {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ wallet_balance: (userProfile.wallet_balance || 0) + amount })
          .eq('id', user?.id);
          
        return !updateError;
      }
      return false;
    } catch (err) {
      console.error('Error adding funds:', err);
      return false;
    }
  };

  const signup = async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return !error && !!data.user;
    } catch (err) {
      return false;
    }
  };

  const value: AuthContextProps = {
    supabaseClient,
    session,
    user,
    userProfile,
    expertProfile,
    isLoading,
    isExpert,
    isLoggedIn,
    isExpertLoggedIn,
    authState,
    error,
    referralSettings,
    sessionType,
    hasDualSessions,
    isAuthenticated: !!user,
    role: expertProfile ? 'expert' : userProfile?.email === 'admin@ifindlife.com' ? 'admin' : userProfile ? 'user' : null,
    state: {
      isLoading,
      userProfile,
      expertProfile,
      isAuthenticated: !!user,
      role: expertProfile ? 'expert' : userProfile?.email === 'admin@ifindlife.com' ? 'admin' : userProfile ? 'user' : null,
    },
    login,
    logout,
    updateProfile,
    updateUserProfile,
    updateExpertProfile,
    refreshUserProfile,
    refreshExpertProfile,
    uploadProfilePicture,
    updateProfilePicture,
    uploadExpertProfilePicture: async (file: File) => {
      try {
        // Implementation for expert profile picture upload
        return null;
      } catch (err) {
        return null;
      }
    },
    deleteProfilePicture,
    deleteExpertProfilePicture,
    fetchReferralSettings,
    clearSession,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    reviewExpert,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    addFunds,
    signup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
