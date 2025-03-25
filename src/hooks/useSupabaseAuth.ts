
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useAuthLogin } from './auth/useAuthLogin';
import { useAuthSignup } from './auth/useAuthSignup';
import { useAuthLogout } from './auth/useAuthLogout';
import { useAuthSession } from './auth/useAuthSession';
import { useAuthPassword } from './auth/useAuthPassword';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Import functionality from separate hooks
  const { login } = useAuthLogin(setLoading, setSession);
  const { signup } = useAuthSignup(setLoading);
  const { logout } = useAuthLogout(setLoading);
  const { getSession } = useAuthSession(setLoading, setSession);
  const { resetPassword, updatePassword } = useAuthPassword(setLoading);

  // Set up auth state listener on component mount
  useEffect(() => {
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
    updatePassword
  };
};
