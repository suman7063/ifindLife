
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      return false;
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

  return {
    session,
    loading,
    setSession,
    login,
    signup,
    logout,
    getSession
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
    // Add more as needed
  };
  
  return DEFAULT_CURRENCY_MAP[country] || 'USD';
};
