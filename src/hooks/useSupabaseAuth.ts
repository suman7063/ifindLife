
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useAuthLogin } from './auth/useAuthLogin';
import { useAuthSignup } from './auth/useAuthSignup';
import { useAuthLogout } from './auth/useAuthLogout';
import { useAuthSession } from './auth/useAuthSession';
import { useAuthPassword } from './auth/useAuthPassword';
import { toast } from 'sonner';

// Define the SignupData interface to match how it's used
export interface SignupData {
  email: string;
  password: string;
  [key: string]: any; // Allow additional user data fields
}

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginInProgress, setLoginInProgress] = useState(false);

  // Import functionality from separate hooks
  const authLoginHook = useAuthLogin(setLoading, setSession);
  const { signup } = useAuthSignup(setLoading);
  const { logout } = useAuthLogout(); 
  const { getSession } = useAuthSession(setLoading, setSession);
  const { resetPassword, updatePassword } = useAuthPassword(setLoading);

  // Wrap the login function to ensure we don't have multiple login attempts at once
  const login = async (email: string, password: string): Promise<boolean> => {
    if (loginInProgress) {
      console.log('Login already in progress, aborting');
      return false;
    }

    setLoginInProgress(true);
    try {
      return await authLoginHook.login(email, password);
    } catch (error) {
      console.error('Login error in wrapper:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      setLoginInProgress(false);
    }
  };

  // Set up auth state listener on component mount
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session ? "Session exists" : "No session");
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    setSession,
    login,
    signup,
    logout,
    getSession,
    resetPassword,
    updatePassword,
    loginInProgress
  };
};
