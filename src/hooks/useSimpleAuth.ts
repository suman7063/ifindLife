
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export type UserType = 'user' | 'expert' | 'admin' | null;

interface SimpleAuthState {
  user: User | null;
  session: Session | null;
  userType: UserType;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useSimpleAuth = () => {
  const [state, setState] = useState<SimpleAuthState>({
    user: null,
    session: null,
    userType: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Simple auth state change:', event, !!session);
        
        if (session?.user) {
          // Determine user type from localStorage or database
          const storedType = localStorage.getItem('sessionType') as UserType;
          
          setState({
            user: session.user,
            session,
            userType: storedType || 'user',
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          setState({
            user: null,
            session: null,
            userType: null,
            isLoading: false,
            isAuthenticated: false
          });
          localStorage.removeItem('sessionType');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const storedType = localStorage.getItem('sessionType') as UserType;
        setState({
          user: session.user,
          session,
          userType: storedType || 'user',
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, type: UserType = 'user') => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem('sessionType', type);
        return { success: true, data };
      }

      return { success: false, error: 'No session created' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('sessionType');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    }
  };

  return {
    ...state,
    login,
    logout
  };
};
