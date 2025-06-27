
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

  // Derive authentication state
  const isAuthenticated = !!user && !!session;

  // Load profiles based on user
  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await UserRepository.findById(userId);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  const loadExpertProfile = async (userId: string) => {
    try {
      const expertProfile = await ExpertRepository.getExpertByAuthId(userId);
      setExpert(expertProfile);
      return expertProfile;
    } catch (error) {
      console.error('Error loading expert profile:', error);
      return null;
    }
  };

  const refreshProfiles = async () => {
    if (!user) return;
    
    console.log('SimpleAuthContext: Refreshing profiles for user:', user.id);
    
    const [userProfileResult, expertProfileResult] = await Promise.all([
      loadUserProfile(user.id),
      loadExpertProfile(user.id)
    ]);

    // Determine user type based on available profiles
    let newUserType: SessionType = 'none';
    
    if (userProfileResult && expertProfileResult) {
      newUserType = 'dual';
    } else if (expertProfileResult) {
      newUserType = 'expert';
    } else if (userProfileResult) {
      newUserType = 'user';
    }
    
    console.log('SimpleAuthContext: User type determined:', newUserType);
    setUserType(newUserType);
  };

  // Auth actions
  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<boolean> => {
    try {
      console.log('SimpleAuthContext: Login attempt for:', email);
      
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
        // The auth state change listener will handle the rest
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
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setExpert(null);
      setUserType('none');
    } catch (error) {
      console.error('SimpleAuthContext: Logout exception:', error);
    }
  };

  // Set up auth state listener and initial session check
  useEffect(() => {
    let mounted = true;
    
    console.log('SimpleAuthContext: Setting up auth state listener (singleton)...');
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('SimpleAuthContext: Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load profiles when user is authenticated
          setTimeout(async () => {
            if (!mounted) return;
            await refreshProfiles();
            setIsLoading(false);
          }, 0);
        } else {
          // Clear profiles when user is not authenticated
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const checkInitialSession = async () => {
      try {
        console.log('SimpleAuthContext: Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SimpleAuthContext: Session check error:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          console.log('SimpleAuthContext: Found existing session');
          setSession(session);
          setUser(session.user);
          await refreshProfiles();
        } else {
          console.log('SimpleAuthContext: Initial session check: No session');
        }
      } catch (error) {
        console.error('SimpleAuthContext: Session check exception:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
