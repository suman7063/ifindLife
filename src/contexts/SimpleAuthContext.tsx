
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { UserRepository } from '@/repositories/userRepository';
import { ExpertRepository } from '@/repositories/expertRepository';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

interface SimpleAuthContextType {
  // Core auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userType: SessionType;
  
  // Profile data
  userProfile: UserProfile | null;
  expert: ExpertProfile | null;
  
  // Auth actions
  login: (email: string, password: string, options?: { asExpert?: boolean }) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Profile actions
  refreshProfiles: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

// Export the hook with the expected name for compatibility
export const useSimpleAuthContext = useSimpleAuth;

// Export types for compatibility
export type UserType = SessionType;
export interface SimpleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userType: SessionType;
  userProfile: UserProfile | null;
  expert: ExpertProfile | null;
}

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [userType, setUserType] = useState<SessionType>('none');

  // Derive authentication state - CRITICAL: This must be consistent
  const isAuthenticated = Boolean(user && session);

  console.log('SimpleAuthContext: Current detailed state:', {
    user: user ? { id: user.id, email: user.email } : null,
    session: session ? 'exists' : null,
    isAuthenticated,
    userType,
    isLoading,
    userProfile: userProfile ? { id: userProfile.id, name: userProfile.name } : null,
    expert: expert ? { id: expert.id, name: expert.name } : null
  });

  // Load profiles based on user
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('SimpleAuthContext: Loading user profile for:', userId);
      const profile = await UserRepository.findById(userId);
      console.log('SimpleAuthContext: User profile loaded:', profile ? { id: profile.id, name: profile.name } : null);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  const loadExpertProfile = async (userId: string) => {
    try {
      console.log('SimpleAuthContext: Loading expert profile for:', userId);
      const expertProfile = await ExpertRepository.getExpertByAuthId(userId);
      console.log('SimpleAuthContext: Expert profile loaded:', expertProfile ? { id: expertProfile.id, name: expertProfile.name } : null);
      setExpert(expertProfile);
      return expertProfile;
    } catch (error) {
      console.error('Error loading expert profile:', error);
      return null;
    }
  };

  const refreshProfiles = async () => {
    if (!user) {
      console.log('SimpleAuthContext: No user to refresh profiles for');
      return;
    }
    
    console.log('SimpleAuthContext: Starting profile refresh for user:', user.id);
    
    const [userProfileResult, expertProfileResult] = await Promise.all([
      loadUserProfile(user.id),
      loadExpertProfile(user.id)
    ]);

    // Determine user type based on available profiles and login intent
    let newUserType: SessionType = 'none';
    const preferredRole = localStorage.getItem('sessionType') || localStorage.getItem('preferredRole');
    
    console.log('SimpleAuthContext: Profile refresh results:', {
      hasUserProfile: !!userProfileResult,
      hasExpertProfile: !!expertProfileResult,
      preferredRole
    });
    
    if (userProfileResult && expertProfileResult) {
      // User has both profiles - check preference
      if (preferredRole === 'expert') {
        newUserType = 'expert';
      } else {
        newUserType = 'user';
      }
    } else if (expertProfileResult) {
      newUserType = 'expert';
    } else if (userProfileResult) {
      newUserType = 'user';
    }
    
    console.log('SimpleAuthContext: Setting user type to:', newUserType);
    setUserType(newUserType);
  };

  // Auth actions
  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<boolean> => {
    try {
      console.log('SimpleAuthContext: Login attempt for:', email, 'as expert:', options?.asExpert);
      
      // Set session type preference before login
      if (options?.asExpert) {
        localStorage.setItem('sessionType', 'expert');
        localStorage.setItem('preferredRole', 'expert');
      } else {
        localStorage.setItem('sessionType', 'user');
        localStorage.setItem('preferredRole', 'user');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('SimpleAuthContext: Login error:', error.message);
        return false;
      }

      if (data.user && data.session) {
        console.log('SimpleAuthContext: Login successful');
        return true;
      }

      return false;
    } catch (error) {
      console.error('SimpleAuthContext: Login exception:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('SimpleAuthContext: Logout initiated');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('SimpleAuthContext: Logout error:', error);
      } else {
        console.log('SimpleAuthContext: Logout successful');
      }
      
      // Clear local state and preferences
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setExpert(null);
      setUserType('none');
      localStorage.removeItem('sessionType');
      localStorage.removeItem('preferredRole');
    } catch (error) {
      console.error('SimpleAuthContext: Logout exception:', error);
    }
  };

  // Auth initialization and state management
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      console.log('Auth: Starting initialization...');
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.warn('Auth: Session check error:', error);
        } else if (session) {
          console.log('Auth: Initial session found:', { userId: session.user.id, email: session.user.email });
          setSession(session);
          setUser(session.user);
        } else {
          console.log('Auth: No initial session found');
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
      } catch (error) {
        console.error('Auth: Initialization failed:', error);
      } finally {
        if (mounted) {
          console.log('Auth: Initial check complete, setting loading to false');
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth: State change event:', event, session ? { userId: session.user.id } : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('SimpleAuthContext: User authenticated, loading profiles...');
          // Don't set loading true here - let profiles load in background
          await refreshProfiles();
        } else {
          // Clear profiles when user is not authenticated
          console.log('SimpleAuthContext: User logged out, clearing profiles');
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // CRITICAL: Make sure we return all required values consistently
  const contextValue: SimpleAuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    session,
    userType,
    userProfile,
    expert,
    login,
    logout,
    refreshProfiles
  };

  console.log('SimpleAuthContext: Providing detailed context value:', {
    isAuthenticated: contextValue.isAuthenticated,
    isLoading: contextValue.isLoading,
    userType: contextValue.userType,
    hasUser: !!contextValue.user,
    hasUserProfile: !!contextValue.userProfile,
    hasExpert: !!contextValue.expert,
    userEmail: contextValue.user?.email
  });

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
