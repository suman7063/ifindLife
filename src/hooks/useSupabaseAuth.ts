
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener on component mount
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
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
    city?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      // Determine currency based on country
      const currency = getCurrencyByCountry(userData.country);

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
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Account created successfully! Please check your email for verification.');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSession = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset instructions');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user: session?.user || null,
    loading,
    setSession,
    login,
    signup,
    logout,
    getSession,
    resetPassword,
    updatePassword
  };
};

// Helper function to determine currency based on country
const getCurrencyByCountry = (country: string): string => {
  const DEFAULT_CURRENCY_MAP: Record<string, string> = {
    'India': 'INR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Japan': 'JPY',
    'China': 'CNY',
    'Brazil': 'BRL',
    // Add more as needed
  };
  
  return DEFAULT_CURRENCY_MAP[country] || 'USD';
};
