
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { ExpertRepository } from '@/repositories/expertRepository';
import { UserRepository } from '@/repositories/userRepository';

export interface UnifiedAuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  loading: boolean;
  sessionType: 'user' | 'expert' | 'dual' | 'none';
}

interface UnifiedAuthContextType extends UnifiedAuthState {
  login: (email: string, password: string, type?: 'user' | 'expert') => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
};

interface UnifiedAuthProviderProps {
  children: ReactNode;
}

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<UnifiedAuthState>({
    session: null,
    user: null,
    userProfile: null,
    expertProfile: null,
    loading: true,
    sessionType: 'none'
  });

  const refreshProfiles = async () => {
    if (!state.session?.user) return;

    try {
      const [userProfile, expertProfile] = await Promise.all([
        UserRepository.findByAuthId(state.session.user.id),
        ExpertRepository.getExpertByAuthId(state.session.user.id)
      ]);

      setState(prev => ({
        ...prev,
        userProfile,
        expertProfile,
        sessionType: userProfile && expertProfile ? 'dual' : 
                    userProfile ? 'user' : 
                    expertProfile ? 'expert' : 'none'
      }));
    } catch (error) {
      console.error('Error refreshing profiles:', error);
    }
  };

  const login = async (email: string, password: string, type: 'user' | 'expert' = 'user'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session) {
        console.error('Login error:', error);
        return false;
      }

      setState(prev => ({
        ...prev,
        session: data.session,
        user: data.session.user
      }));

      await refreshProfiles();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setState({
        session: null,
        user: null,
        userProfile: null,
        expertProfile: null,
        loading: false,
        sessionType: 'none'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false
      }));

      if (session) {
        refreshProfiles();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false
        }));

        if (session) {
          await refreshProfiles();
        } else {
          setState(prev => ({
            ...prev,
            userProfile: null,
            expertProfile: null,
            sessionType: 'none'
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: UnifiedAuthContextType = {
    ...state,
    login,
    logout,
    refreshProfiles
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
