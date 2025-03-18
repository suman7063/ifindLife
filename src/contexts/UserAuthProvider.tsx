import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';
import { processReferralCode } from '@/utils/referralUtils';

interface UserAuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const session = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        await fetchProfile();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          await fetchProfile();
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      });
    };

    session();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return false;
      }
      await fetchProfile();
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (userData.referralCode) {
        const isValidReferral = await processReferralCode(userData.referralCode);
        if (!isValidReferral) {
          toast.error('Invalid referral code.');
          return false;
        }

        // Update the user's record with the referral information
        const { error: profileError } = await supabase
          .from('users')
          .update({ referred_by: userData.referralCode })
          .eq('id', data.user?.id);

        if (profileError) {
          toast.error('Failed to apply referral code.');
          return false;
        }
      }

      await fetchProfile();
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser?.id);

      if (error) {
        throw error;
      }

      await fetchProfile();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setCurrentUser(profile);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value: UserAuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    fetchProfile,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {!loading && children}
    </UserAuthContext.Provider>
  );
};
