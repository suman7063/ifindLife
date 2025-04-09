
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { User, Session } from '@supabase/supabase-js';
import { handleAuthError } from '@/lib/authUtils';
import { toast } from 'sonner';
import { UserSettings, ReferralInfo } from '@/types/user';
import { walletDataDefaults } from '@/data/userDefaults';

// Define types for the context
export interface UserAuthContextType {
  currentUser: UserProfile | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLoading: boolean;
  authError: string | null;
  favoritesCount: number;
  referrals: ReferralInfo[];
  userSettings: UserSettings | null;
  walletBalance: number;
  hasProfile: boolean;
  profileLoading: boolean;
  profileError: string | null;
  isExpertUser: boolean;
  expertId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  checkIsFavorite: (expertId: string) => Promise<boolean>;
  refreshFavoritesCount: () => Promise<void>;
  getReferrals: () => Promise<ReferralInfo[]>;
  refreshWalletBalance: () => Promise<number>;
  addFunds: (amount: number) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  reviewExpert: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
}

// Create context with default values
export const UserAuthContext = createContext<UserAuthContextType>({
  currentUser: null,
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  authLoading: false,
  authError: null,
  favoritesCount: 0,
  referrals: [],
  userSettings: null,
  walletBalance: 0,
  hasProfile: false,
  profileLoading: false,
  profileError: null,
  isExpertUser: false,
  expertId: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  updateProfile: async () => false,
  updateUserSettings: async () => false,
  updateEmail: async () => false,
  updatePassword: async () => false,
  resetPassword: async () => false,
  sendVerificationEmail: async () => false,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  checkIsFavorite: async () => false,
  refreshFavoritesCount: async () => {},
  getReferrals: async () => [],
  refreshWalletBalance: async () => 0,
  addFunds: async () => false,
  deductFunds: async () => false,
  reportExpert: async () => false,
  reviewExpert: async () => false,
  getExpertShareLink: () => '',
  hasTakenServiceFrom: async () => false,
});

// Provider component
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // User profile state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Auth state
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // User data state
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [referrals, setReferrals] = useState<ReferralInfo[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Expert related state
  const [isExpertUser, setIsExpertUser] = useState(false);
  const [expertId, setExpertId] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await fetchUserProfile(session.user.id);
            } else {
              setCurrentUser(null);
              setHasProfile(false);
            }
          }
        );

        // THEN check for existing session
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    if (!userId) {
      setProfileLoading(false);
      return;
    }
    
    try {
      setProfileLoading(true);
      
      // Fetch basic profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Not found - new user, no profile yet
          setCurrentUser(null);
          setHasProfile(false);
        } else {
          console.error('Error fetching profile:', profileError);
          setProfileError('Failed to load user profile');
        }
      } else {
        setCurrentUser(profile as UserProfile);
        setHasProfile(true);
        
        // Once profile is loaded, fetch additional data
        await Promise.all([
          fetchUserSettings(userId),
          checkExpertAccount(userId),
          refreshFavoritesCount(),
          fetchWalletBalance(userId),
          getReferrals(),
        ]);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setProfileError('An unexpected error occurred loading user data');
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user settings
  const fetchUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user settings:', error);
        return null;
      }
      
      setUserSettings(data as UserSettings);
      return data;
    } catch (error) {
      console.error('Error in fetchUserSettings:', error);
      return null;
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
        return false;
      }
      
      const hasExpertAccount = !!data;
      setIsExpertUser(hasExpertAccount);
      setExpertId(data ? data.id : null);
      return hasExpertAccount;
    } catch (error) {
      console.error('Error in checkExpertAccount:', error);
      return false;
    }
  };

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
      
      // Clear local state
      setUser(null);
      setSession(null);
      setCurrentUser(null);
      setHasProfile(false);
      
      toast.success('Successfully logged out');
      return true;
    } catch (error) {
      handleAuthError(error, 'Logout failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update profile');
      return false;
    }
    
    try {
      setProfileLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }
      
      // Update local state
      setCurrentUser(current => current ? { ...current, ...updates } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An error occurred while updating profile');
      return false;
    } finally {
      setProfileLoading(false);
    }
  };
  
  // Update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update settings');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Settings update error:', error);
        toast.error('Failed to update settings: ' + error.message);
        return false;
      }
      
      // Update local state
      setUserSettings(current => current ? { ...current, ...settings } : null);
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error('An error occurred while updating settings');
      return false;
    }
  };
  
  // Update user email
  const updateEmail = async (newEmail: string): Promise<boolean> => {
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
  const updatePassword = async (newPassword: string): Promise<boolean> => {
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
  const sendVerificationEmail = async (): Promise<boolean> => {
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
  
  // Add expert to favorites
  const addToFavorites = async (expertId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: user.id, expert_id: expertId }]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This expert is already in your favorites');
        } else {
          console.error('Error adding favorite:', error);
          toast.error('Failed to add to favorites');
        }
        return false;
      }
      
      // Update count
      await refreshFavoritesCount();
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('An error occurred while adding to favorites');
      return false;
    }
  };
  
  // Remove expert from favorites
  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to manage favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: user.id, expert_id: expertId });
      
      if (error) {
        console.error('Error removing favorite:', error);
        toast.error('Failed to remove from favorites');
        return false;
      }
      
      // Update count
      await refreshFavoritesCount();
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('An error occurred while removing from favorites');
      return false;
    }
  };
  
  // Check if expert is in favorites
  const checkIsFavorite = async (expertId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .match({ user_id: user.id, expert_id: expertId })
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  };
  
  // Refresh favorites count
  const refreshFavoritesCount = async (): Promise<void> => {
    if (!user) {
      setFavoritesCount(0);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error getting favorites count:', error);
        return;
      }
      
      setFavoritesCount(data.length);
    } catch (error) {
      console.error('Error getting favorites count:', error);
    }
  };
  
  // Get user referrals
  const getReferrals = async (): Promise<ReferralInfo[]> => {
    if (!user) return [];
    
    try {
      // Get people user has referred
      const { data: referredUsers, error: referredError } = await supabase
        .from('referrals')
        .select(`
          id,
          created_at,
          status,
          referred_id,
          profiles:referred_id (
            name,
            email,
            avatar_url
          )
        `)
        .eq('referrer_id', user.id);
      
      if (referredError) {
        console.error('Error getting referrals:', referredError);
        return [];
      }
      
      // Format referral data
      const formattedReferrals = (referredUsers || []).map(ref => ({
        id: ref.id,
        userId: ref.referred_id,
        name: ref.profiles?.name || 'Unknown User',
        email: ref.profiles?.email || 'unknown@example.com',
        avatar: ref.profiles?.avatar_url,
        date: ref.created_at,
        status: ref.status
      }));
      
      setReferrals(formattedReferrals);
      return formattedReferrals;
    } catch (error) {
      console.error('Error getting referrals:', error);
      return [];
    }
  };
  
  // Get wallet balance
  const fetchWalletBalance = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error getting wallet balance:', error);
        return 0;
      }
      
      const balance = data?.balance || 0;
      setWalletBalance(balance);
      return balance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  };
  
  // Refresh wallet balance
  const refreshWalletBalance = async (): Promise<number> => {
    if (!user) return 0;
    return fetchWalletBalance(user.id);
  };
  
  // Add funds to wallet
  const addFunds = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add funds');
      return false;
    }
    
    try {
      // First get current balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (walletError) {
        console.error('Error getting wallet:', walletError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      const currentBalance = walletData?.balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update wallet
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating wallet:', updateError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: amount,
          type: 'credit',
          status: 'completed',
          description: 'Wallet recharge',
          created_at: new Date().toISOString()
        }]);
      
      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Non-blocking error, continue
      }
      
      // Update local state
      setWalletBalance(newBalance);
      toast.success(`$${amount} added to your wallet`);
      return true;
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('An error occurred while adding funds');
      return false;
    }
  };
  
  // Deduct funds from wallet
  const deductFunds = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to use wallet');
      return false;
    }
    
    try {
      // First get current balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (walletError) {
        console.error('Error getting wallet:', walletError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      const currentBalance = walletData?.balance || 0;
      
      // Check if balance is sufficient
      if (currentBalance < amount) {
        toast.error('Insufficient balance. Please recharge your wallet.');
        return false;
      }
      
      const newBalance = currentBalance - amount;
      
      // Update wallet
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating wallet:', updateError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: amount,
          type: 'debit',
          status: 'completed',
          description: description || 'Service fee',
          created_at: new Date().toISOString()
        }]);
      
      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Non-blocking error, continue
      }
      
      // Update local state
      setWalletBalance(newBalance);
      return true;
    } catch (error) {
      console.error('Error deducting funds:', error);
      toast.error('An error occurred while processing payment');
      return false;
    }
  };
  
  // Report an expert
  const reportExpert = async (expertId: string, reason: string, details: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to report an expert');
      return false;
    }
    
    try {
      // Create the report
      const { error } = await supabase
        .from('user_reports')
        .insert([{
          reporter_id: user.id,
          reported_entity_id: expertId,
          entity_type: 'expert',
          reason,
          details,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error reporting expert:', error);
        toast.error('Failed to submit report');
        return false;
      }
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      toast.error('An error occurred while submitting report');
      return false;
    }
  };
  
  // Review an expert
  const reviewExpert = async (expertId: string, rating: number, comment: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to review an expert');
      return false;
    }
    
    try {
      // Check if already reviewed
      const { data: existingReview, error: checkError } = await supabase
        .from('expert_reviews')
        .select('id')
        .match({ user_id: user.id, expert_id: expertId })
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking reviews:', checkError);
        toast.error('Failed to submit review');
        return false;
      }
      
      let success = false;
      
      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from('expert_reviews')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);
        
        if (updateError) {
          console.error('Error updating review:', updateError);
          toast.error('Failed to update review');
          return false;
        }
        
        success = true;
        toast.success('Review updated successfully');
      } else {
        // Create new review
        const { error: insertError } = await supabase
          .from('expert_reviews')
          .insert([{
            user_id: user.id,
            expert_id: expertId,
            rating,
            comment,
            created_at: new Date().toISOString(),
            status: 'published'
          }]);
        
        if (insertError) {
          console.error('Error submitting review:', insertError);
          toast.error('Failed to submit review');
          return false;
        }
        
        success = true;
        toast.success('Review submitted successfully');
      }
      
      return success;
    } catch (error) {
      console.error('Error reviewing expert:', error);
      toast.error('An error occurred while submitting review');
      return false;
    }
  };

  // Check if user has taken a service from an expert
  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check appointments
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('id')
        .match({ user_id: user.id, expert_id: expertId, status: 'completed' })
        .limit(1);
      
      if (appointmentError) {
        console.error('Error checking appointments:', appointmentError);
        return false;
      }
      
      // If they have completed appointments, they've taken service
      if (appointments && appointments.length > 0) {
        return true;
      }
      
      // Also check program enrollments (if expert is a program instructor)
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('program_enrollments')
        .select(`
          id,
          programs (
            instructor_id
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1);
      
      if (enrollmentError) {
        console.error('Error checking enrollments:', enrollmentError);
        return false;
      }
      
      // Check if any enrollments have the expert as instructor
      const hasProgram = (enrollments || []).some(
        enrollment => enrollment.programs && enrollment.programs.instructor_id === expertId
      );
      
      return hasProgram;
    } catch (error) {
      console.error("Error in hasTakenServiceFrom:", error);
      return false;
    }
  }; // Added missing closing brace here

  const getExpertShareLink = (expertId: string | number): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
  };
  
  return (
    <UserAuthContext.Provider value={{
      currentUser,
      user,
      session,
      isAuthenticated: !!session,
      loading,
      authLoading,
      authError,
      favoritesCount,
      referrals,
      userSettings,
      walletBalance,
      hasProfile,
      profileLoading,
      profileError,
      isExpertUser,
      expertId,
      login,
      signup,
      logout,
      updateProfile,
      updateUserSettings,
      updateEmail,
      updatePassword,
      resetPassword,
      sendVerificationEmail,
      addToFavorites,
      removeFromFavorites,
      checkIsFavorite,
      refreshFavoritesCount,
      getReferrals,
      refreshWalletBalance,
      addFunds,
      deductFunds,
      reportExpert,
      reviewExpert,
      getExpertShareLink,
      hasTakenServiceFrom
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};
