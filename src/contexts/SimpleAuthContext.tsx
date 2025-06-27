
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

    // Determine user type based on available profiles and login intent
    let newUserType: SessionType = 'none';
    const preferredRole = localStorage.getItem('sessionType') || localStorage.getItem('preferredRole');
    
    console.log('SimpleAuthContext: Profile loading results:', {
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
    
    console.log('SimpleAuthContext: User type determined:', newUserType);
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
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);
        
        if (!mounted) return;
        
        if (error) {
          console.warn('Auth: Session check error:', error);
        } else if (session) {
          console.log('Auth: Session found');
          setSession(session);
          setUser(session.user);
        } else {
          console.log('Auth: No session found');
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
      } catch (error) {
        console.error('Auth: Initialization failed:', error);
      } finally {
        if (mounted) {
          console.log('Auth: Setting loading to false');
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth: State change:', event);
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
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Emergency fallback: Force loading to false after 10 seconds
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      console.warn('Auth: Emergency timeout - forcing loading to false');
      setIsLoading(false);
    }, 10000);
    
    return () => clearTimeout(emergencyTimeout);
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
