
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState } from '../types';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/supabase/user';

export const useAuthActions = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const [loading, setLoading] = useState(false);

  // Login function
  const login = useCallback(
    async (email: string, password: string, loginAs?: 'user' | 'expert') => {
      setLoading(true);
      try {
        // Add the login origin to localStorage for later use
        if (loginAs) {
          localStorage.setItem('loginAs', loginAs);
        }
        
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error.message);
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
          setLoading(false);
          return false;
        }

        const { user: authUser, session } = data;
        if (!authUser || !session) {
          toast({
            title: 'Error',
            description: 'Authentication failed',
            variant: 'destructive',
          });
          setLoading(false);
          return false;
        }

        // Get user profile
        let { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        // Get expert profile
        let { data: expertProfile } = await supabase
          .from('experts')
          .select('*')
          .eq('auth_id', authUser.id)
          .maybeSingle();

        // Determine role based on profile data and login preference
        let role = null;
        if (profile) {
          role = 'user';
        }
        if (expertProfile) {
          // If user has both profiles but specifically wants to login as expert
          if (loginAs === 'expert' || !profile) {
            role = 'expert';
          }
        }

        // Ensure profile has all required fields with safe defaults
        const completeProfile = profile ? {
          ...profile,
          favorite_experts: profile.favorite_experts || [],
          favorite_programs: Array.isArray(profile.favorite_programs) 
            ? profile.favorite_programs.map(id => String(id)) 
            : [],
          enrolled_courses: profile.enrolled_courses || [],
          reviews: profile.reviews || [],
          reports: profile.reports || [],
          transactions: profile.transactions || [],
          referrals: profile.referrals || []
        } : null;

        // Update auth state
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          loading: false,
          isLoading: false,
          user: authUser ? {
            id: authUser.id,
            email: authUser.email || '',
            role
          } : null,
          session,
          profile: completeProfile as UserProfile,
          userProfile: completeProfile as UserProfile,
          expertProfile,
          role,
          sessionType: profile && expertProfile ? 'dual' : profile ? 'user' : expertProfile ? 'expert' : 'none',
          walletBalance: completeProfile?.wallet_balance || 0
        }));

        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });

        setLoading(false);
        return true;
      } catch (error) {
        console.error('Error during login:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred during login',
          variant: 'destructive',
        });
        setLoading(false);
        return false;
      }
    },
    [setAuthState]
  );

  // Signup function
  const signup = useCallback(
    async (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => {
      setLoading(true);
      try {
        // First, check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (existingUser) {
          toast({
            title: 'Error',
            description: 'An account with this email already exists',
            variant: 'destructive',
          });
          setLoading(false);
          return false;
        }

        // Register the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        });

        if (error) {
          console.error('Signup error:', error);
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
          setLoading(false);
          return false;
        }

        if (!data.user) {
          toast({
            title: 'Error',
            description: 'Failed to create user',
            variant: 'destructive',
          });
          setLoading(false);
          return false;
        }

        // Create user profile
        const profileData = {
          id: data.user.id,
          email: email,
          name: userData.name || '',
          phone: userData.phone || '',
          country: userData.country || '',
          city: userData.city || '',
          referred_by: referralCode || null,
          wallet_balance: 0,
          favorite_experts: [],
          favorite_programs: [],
          profile_picture: ''
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([profileData]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
        
        setLoading(false);
        return true;
      } catch (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred during signup',
          variant: 'destructive',
        });
        setLoading(false);
        return false;
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear any stored login preference
      localStorage.removeItem('loginAs');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
        return false;
      }

      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        profile: null,
        userProfile: null,
        expertProfile: null,
        session: null,
        role: null,
        sessionType: 'none',
        loading: false,
        isLoading: false
      }));

      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during logout',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  }, [setAuthState]);

  return { login, signup, logout, loading };
};
