
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { handleAuthError } from '@/lib/authUtils';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';
import { walletDataDefaults } from '@/data/userDefaults';

export const useAuthAccount = () => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Login with email/password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        handleAuthError(error, 'Login failed');
        setAuthError(error.message);
        return false;
      }
      
      return !!data.session;
    } catch (error) {
      handleAuthError(error, 'Login failed');
      setAuthError('An unexpected error occurred during login');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Signup new user
  const signup = async (
    email: string, 
    password: string, 
    userData?: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      
      // 1. Create auth account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name,
            phone: userData?.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      
      if (error) {
        handleAuthError(error, 'Signup failed');
        setAuthError(error.message);
        return false;
      }
      
      // 2. Check if the signup was successful
      if (!data.user) {
        setAuthError('Signup failed: No user data returned');
        toast.error('Signup failed: No user data returned');
        return false;
      }

      // 3. Create user profile
      const userId = data.user.id;
      const profile: Partial<UserProfile> = {
        id: userId,
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
        // Continue anyway as the auth account is created
      }
      
      // 4. Create default wallet record
      const wallet = {
        user_id: userId,
        balance: walletDataDefaults.initialBalance,
        currency: walletDataDefaults.currency,
        updated_at: new Date().toISOString()
      };
      
      const { error: walletError } = await supabase
        .from('wallet')
        .insert([wallet]);
      
      if (walletError) {
        console.error('Error creating wallet:', walletError);
        // Non-blocking error, continue
      }
      
      // 5. Create default user settings
      const settings = {
        user_id: userId,
        theme: 'system',
        notifications_enabled: true,
        email_notifications: true,
        newsletter: false,
        two_factor_auth: false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'english'
      };
      
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert([settings]);
      
      if (settingsError) {
        console.error('Error creating settings:', settingsError);
        // Non-blocking error, continue
      }
      
      // 6. Record referral if one was provided
      if (referralCode) {
        // Find the referring user
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .single();
          
        if (referrer) {
          const referral = {
            referrer_id: referrer.id,
            referred_id: userId,
            created_at: new Date().toISOString(),
            status: 'pending'
          };
          
          await supabase
            .from('referrals')
            .insert([referral]);
            
          // Log for debugging
          console.log('Referral recorded:', referralCode);
        }
      }
      
      // If needs email verification, show message
      if (data.user.identities?.[0]?.identity_data?.email_verified === false) {
        toast.success('Signup successful! Please check your email for verification.');
      } else {
        toast.success('Signup successful!');
      }
      
      return true;
    } catch (error) {
      handleAuthError(error, 'Signup failed');
      setAuthError('An unexpected error occurred during signup');
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
      
      toast.success('Successfully logged out');
      return true;
    } catch (error) {
      handleAuthError(error, 'Logout failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Update user email
  const updateEmail = async (newEmail: string, user: User | null): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update email');
      return false;
    }
    
    try {
      setAuthLoading(true);
      
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) {
        handleAuthError(error, 'Email update failed');
        return false;
      }
      
      toast.success('Verification email sent to the new address. Please check your inbox.');
      return true;
    } catch (error) {
      handleAuthError(error, 'Email update failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Update user password
  const updatePassword = async (newPassword: string, user: User | null): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update password');
      return false;
    }
    
    try {
      setAuthLoading(true);
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        handleAuthError(error, 'Password update failed');
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      handleAuthError(error, 'Password update failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        handleAuthError(error, 'Password reset failed');
        return false;
      }
      
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      handleAuthError(error, 'Password reset failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Send verification email
  const sendVerificationEmail = async (user: User | null): Promise<boolean> => {
    if (!user || !user.email) {
      toast.error('No user or email to verify');
      return false;
    }
    
    try {
      setAuthLoading(true);
      
      // Re-send verification email
      // Note: The API for this may change in supabase versions
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      
      if (error) {
        handleAuthError(error, 'Failed to send verification email');
        return false;
      }
      
      toast.success('Verification email sent. Please check your inbox.');
      return true;
    } catch (error) {
      handleAuthError(error, 'Failed to send verification email');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Check if user has an expert account
  const checkExpertAccount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('id')
        .eq('auth_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking expert account:', error);
        return { isExpertUser: false, expertId: null };
      }
      
      return { 
        isExpertUser: !!data, 
        expertId: data ? data.id : null 
      };
    } catch (error) {
      console.error('Error in checkExpertAccount:', error);
      return { isExpertUser: false, expertId: null };
    }
  };

  return {
    authLoading,
    authError,
    login,
    signup,
    logout,
    updateEmail,
    updatePassword,
    resetPassword,
    sendVerificationEmail,
    checkExpertAccount
  };
};
