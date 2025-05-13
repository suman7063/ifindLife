import React, { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType } from '../AuthContext';
import { UserProfile, UserRole, ExpertProfile } from '../types';
import { useAuthMethods } from '../hooks/useAuthMethods';
import { useAuthBackCompat } from '@/hooks/auth/useAuthBackCompat';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Initialize auth methods
  const authMethods = useAuthMethods(user);

  // Fetch user data on initial load and auth state changes
  useEffect(() => {
    const fetchAuthData = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          setSession(session);
          setIsAuthenticated(true);
          setAuthStatus('authenticated');
          setSessionType(session.type);

          // Determine user role and fetch profile
          const userRole = session.user.app_metadata?.role as UserRole || 'user';
          setRole(userRole);

          // Fetch user profile data
          const { data: profileData, error: profileError } = await supabase
            .from<UserProfile>('user_profiles')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setProfile(null);
          } else {
            setProfile(profileData);
            setUserProfile(profileData);
            setWalletBalance(profileData?.wallet_balance || 0);
          }

          // Fetch expert profile if role is expert
          if (userRole === 'expert') {
            const { data: expertData, error: expertError } = await supabase
              .from<ExpertProfile>('expert_accounts')
              .select('*')
              .eq('auth_id', session.user.id)
              .single();

            if (expertError) {
              console.error('Error fetching expert profile:', expertError);
              setExpertProfile(null);
            } else {
              setExpertProfile(expertData);
            }
          } else {
            setExpertProfile(null);
          }
        } else {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setRole(null);
          setProfile(null);
          setUserProfile(null);
          setExpertProfile(null);
          setAuthStatus('unauthenticated');
          setSessionType(null);
          setWalletBalance(null);
        }
      } catch (error) {
        console.error('Error fetching auth data:', error);
        setIsAuthenticated(false);
        setRole(null);
        setProfile(null);
        setUserProfile(null);
        setExpertProfile(null);
        setAuthStatus('error');
        setSessionType(null);
        setWalletBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthData();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event);
      fetchAuthData();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Function to handle login
  const login = async (email: string, password: string, roleOverride?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data);
        setIsAuthenticated(true);
        setAuthStatus('authenticated');
        setSessionType(data.type);

        // Determine user role and fetch profile
        const userRole = roleOverride || data.user.app_metadata?.role as UserRole || 'user';
        setRole(userRole);

        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from<UserProfile>('user_profiles')
          .select('*')
          .eq('auth_id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setProfile(null);
          setUserProfile(null);
        } else {
          setProfile(profileData);
          setUserProfile(profileData);
          setWalletBalance(profileData?.wallet_balance || 0);
        }

        // Fetch expert profile if role is expert
        if (userRole === 'expert') {
          const { data: expertData, error: expertError } = await supabase
            .from<ExpertProfile>('expert_accounts')
            .select('*')
            .eq('auth_id', data.user.id)
            .single();

          if (expertError) {
            console.error('Error fetching expert profile:', expertError);
            setExpertProfile(null);
          } else {
            setExpertProfile(expertData);
          }
        } else {
          setExpertProfile(null);
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle signup
  const signup = async (email: string, password: string, userData: any, referralCode?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            ...userData,
            role: 'user',
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data);
        setIsAuthenticated(true);
        setAuthStatus('authenticated');
        setSessionType(data.type);
        setRole('user');

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            auth_id: data.user.id,
            email: email,
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
            referral_code: userData.referralCode,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return false;
        }

        // Fetch user profile data
        const { data: profileData, error: fetchProfileError } = await supabase
          .from<UserProfile>('user_profiles')
          .select('*')
          .eq('auth_id', data.user.id)
          .single();

        if (fetchProfileError) {
          console.error('Error fetching user profile:', fetchProfileError);
          setProfile(null);
          setUserProfile(null);
        } else {
          setProfile(profileData);
          setUserProfile(profileData);
          setWalletBalance(profileData?.wallet_balance || 0);
        }

        setExpertProfile(null);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const logout = async (): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        return { error };
      } else {
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setRole(null);
        setProfile(null);
        setUserProfile(null);
        setExpertProfile(null);
        setAuthStatus('unauthenticated');
        setSessionType(null);
        setWalletBalance(null);
        return { error: null };
      }
    } catch (error: any) {
      console.error('Logout failed:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;

      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('auth_id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        return false;
      }

      // Fetch updated profile data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from<UserProfile>('user_profiles')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated profile:', fetchError);
        return false;
      }

      setProfile(updatedProfile);
      setUserProfile(updatedProfile);
      setWalletBalance(updatedProfile?.wallet_balance || 0);
      return true;
    } catch (error) {
      console.error('Update profile failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile (backward compatibility)
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    return updateProfile(data);
  };

  // Function to update password
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('Update password error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Update password failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset password
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }
      return { error: null };
    } catch (error: any) {
      console.error('Reset password failed:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add expert to favorites
  const addToFavorites = async (expertId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, expert_id: expertId });

      if (error) {
        console.error('Add to favorites error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Add to favorites failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove expert from favorites
  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('expert_id', expertId);

      if (error) {
        console.error('Remove from favorites error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Remove from favorites failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to recharge wallet
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user || !profile) return false;

      const newBalance = (profile.wallet_balance || 0) + amount;

      const { error } = await supabase
        .from('user_profiles')
        .update({ wallet_balance: newBalance })
        .eq('auth_id', user.id);

      if (error) {
        console.error('Recharge wallet error:', error);
        return false;
      }

      // Update local state
      setWalletBalance(newBalance);
      setProfile({ ...profile, wallet_balance: newBalance });
      setUserProfile({ ...profile, wallet_balance: newBalance });
      return true;
    } catch (error) {
      console.error('Recharge wallet failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addReview = async (review: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;

      const { error } = await supabase
        .from('reviews')
        .insert({
          ...review,
          user_id: user.id,
        });

      if (error) {
        console.error('Add review error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Add review failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reportExpert = async (report: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;

      const { error } = await supabase
        .from('reports')
        .insert({
          ...report,
          user_id: user.id,
        });

      if (error) {
        console.error('Report expert error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Report expert failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getExpertShareLink = (expertId: number): string => {
    return `${window.location.origin}/expert/${expertId}`;
  };

  const hasTakenServiceFrom = async (expertId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!user) return false;

      // Check if the user has taken service from the expert
      // This is a placeholder, replace with your actual logic
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('expert_id', expertId);

      if (error) {
        console.error('Has taken service error:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Has taken service failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getReferralLink = (): string | null => {
    if (!profile || !profile.referral_code) return null;
    return `${window.location.origin}/signup?referralCode=${profile.referral_code}`;
  };

  // In the provider where authMethods is used, make sure updateProfilePicture is included in the return value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    session,
    role,
    profile,
    userProfile,
    expertProfile,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUserProfile,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    getExpertShareLink,
    hasTakenServiceFrom,
    getReferralLink,
    walletBalance,
    sessionType,
    authStatus,

    // Include additional methods from authMethods
    loginWithOtp: authMethods.loginWithOtp,
    resetPassword: authMethods.resetPassword,
    updateEmail: authMethods.updateEmail,
    refreshSession: authMethods.refreshSession,
    updateExpertProfile: authMethods.updateExpertProfile,
    fetchExpertProfile: authMethods.fetchExpertProfile,
    registerAsExpert: authMethods.registerAsExpert,
    updateProfilePicture: authMethods.updateProfilePicture
  };

  const backCompatContext = useAuthBackCompat(contextValue);

  return (
    <AuthContext.Provider value={backCompatContext}>
      {children}
    </AuthContext.Provider>
  );
};
