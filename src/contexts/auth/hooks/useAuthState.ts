
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRepository } from '@/repositories/userRepository';
import { ExpertRepository } from '@/repositories/expertRepository';
import { AuthState, AuthUser, UserRole, SessionType, initialAuthState } from '../types';

export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  const determineRole = (userProfile: any, expertProfile: any): UserRole => {
    if (userProfile && expertProfile) return 'user'; // Default to user if both exist
    if (expertProfile) return 'expert';
    if (userProfile) return 'user';
    return null;
  };

  const determineSessionType = (userProfile: any, expertProfile: any): SessionType => {
    if (userProfile && expertProfile) return 'dual';
    if (expertProfile) return 'expert';
    if (userProfile) return 'user';
    return 'none';
  };

  const loadProfiles = async (session: Session) => {
    try {
      const [userProfile, expertProfile] = await Promise.all([
        UserRepository.findByAuthId(session.user.id),
        ExpertRepository.getExpertByAuthId(session.user.id)
      ]);

      const role = determineRole(userProfile, expertProfile);
      const sessionType = determineSessionType(userProfile, expertProfile);

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email || '',
        role
      };

      setState(prev => ({
        ...prev,
        user: authUser,
        userProfile,
        expertProfile,
        profile: userProfile, // For backward compatibility
        role,
        sessionType,
        isAuthenticated: true,
        walletBalance: userProfile?.wallet_balance || 0,
        hasUserAccount: !!userProfile,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading profiles:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadProfiles(session);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setState(prev => ({ ...prev, session, isLoading: true }));
          await loadProfiles(session);
        } else {
          setState({
            ...initialAuthState,
            isLoading: false
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return state;
};
