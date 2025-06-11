
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, UserProfile, AdminProfile } from '@/types/database/unified';
import { expertRepository } from '@/repositories/expertRepository';
import { userRepository } from '@/repositories/userRepository';
import { adminRepository } from '@/repositories/adminRepository';

interface UnifiedAuthContextType {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionType: 'user' | 'admin' | 'expert' | null;
  
  // User profiles
  user: UserProfile | null;
  admin: AdminProfile | null;
  expert: ExpertProfile | null;
  
  // Auth methods
  login: (type: 'user' | 'admin' | 'expert', credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Profile setters for updates
  setUser: (user: UserProfile | null) => void;
  setAdmin: (admin: AdminProfile | null) => void;
  setExpert: (expert: ExpertProfile | null) => void;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionType, setSessionType] = useState<'user' | 'admin' | 'expert' | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [expert, setExpert] = useState<ExpertProfile | null>(null);

  const isAuthenticated = Boolean(user || admin || expert);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('UnifiedAuth: Initializing auth state...');
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('UnifiedAuth: Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
            setAuthInitialized(true);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('UnifiedAuth: Session found, loading profiles...');
          await loadUserProfiles(session.user);
        } else {
          console.log('UnifiedAuth: No session found');
          if (mounted) {
            clearAuthState();
          }
        }
      } catch (error) {
        console.error('UnifiedAuth: Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('UnifiedAuth: Auth state changed:', { event, hasSession: !!session, userId: session?.user?.id });
        
        if (session?.user) {
          setIsLoading(true);
          await loadUserProfiles(session.user);
        } else {
          console.log('UnifiedAuth: Clearing auth state (no session)');
          clearAuthState();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearAuthState = () => {
    setUser(null);
    setAdmin(null);
    setExpert(null);
    setSessionType(null);
    setIsLoading(false);
    setAuthInitialized(true);
  };

  const loadUserProfiles = async (authUser: User) => {
    try {
      console.log('UnifiedAuth: Loading user profiles for:', authUser.id);
      
      // Get stored session type preference - check both localStorage and sessionStorage
      const storedSessionType = localStorage.getItem('sessionType') || sessionStorage.getItem('sessionType') as 'user' | 'admin' | 'expert' | null;
      console.log('UnifiedAuth: Stored session type:', storedSessionType);
      
      // Clear previous state
      setUser(null);
      setAdmin(null);
      setExpert(null);
      
      // Load profile based on session type
      if (storedSessionType === 'expert') {
        console.log('UnifiedAuth: Loading expert profile...');
        const expertProfile = await expertRepository.getExpertByAuthId(authUser.id);
        if (expertProfile) {
          console.log('UnifiedAuth: Expert profile loaded:', expertProfile.id);
          setExpert(expertProfile);
          setSessionType('expert');
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        } else {
          console.log('UnifiedAuth: No expert profile found, trying user profile');
        }
      }
      
      if (storedSessionType === 'admin') {
        console.log('UnifiedAuth: Loading admin profile...');
        const adminProfile = await adminRepository.getAdminByAuthId(authUser.id);
        if (adminProfile) {
          console.log('UnifiedAuth: Admin profile loaded:', adminProfile.id);
          setAdmin(adminProfile);
          setSessionType('admin');
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        } else {
          console.log('UnifiedAuth: No admin profile found, trying user profile');
        }
      }
      
      // Default to user profile
      console.log('UnifiedAuth: Loading user profile...');
      const userProfile = await userRepository.getUserByAuthId(authUser.id);
      if (userProfile) {
        console.log('UnifiedAuth: User profile loaded:', userProfile.id);
        setUser(userProfile);
        setSessionType('user');
        // Store user as default if no preference was set
        if (!storedSessionType) {
          localStorage.setItem('sessionType', 'user');
        }
      } else {
        console.log('UnifiedAuth: No user profile found');
        // Even with no profile, we have authentication
        setSessionType('user');
      }
      
      setIsLoading(false);
      setAuthInitialized(true);
    } catch (error) {
      console.error('UnifiedAuth: Error loading user profiles:', error);
      setIsLoading(false);
      setAuthInitialized(true);
    }
  };

  const login = async (type: 'user' | 'admin' | 'expert', credentials: any): Promise<boolean> => {
    try {
      console.log(`UnifiedAuth: Attempting ${type} login:`, credentials.email);
      
      // Store the intended session type BEFORE login
      localStorage.setItem('sessionType', type);
      sessionStorage.setItem('sessionType', type);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('UnifiedAuth: Login error:', error);
        // Clear session type on failure
        localStorage.removeItem('sessionType');
        sessionStorage.removeItem('sessionType');
        return false;
      }

      if (data.user) {
        console.log(`UnifiedAuth: ${type} login successful for:`, data.user.id);
        // Profile loading will be handled by the auth state change listener
        return true;
      }

      return false;
    } catch (error) {
      console.error('UnifiedAuth: Login error:', error);
      localStorage.removeItem('sessionType');
      sessionStorage.removeItem('sessionType');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('UnifiedAuth: Logging out...');
      
      // Clear stored session types
      localStorage.removeItem('sessionType');
      sessionStorage.removeItem('sessionType');
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear all states
      clearAuthState();
      
      console.log('UnifiedAuth: Logout completed');
    } catch (error) {
      console.error('UnifiedAuth: Logout error:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    sessionType,
    user,
    admin,
    expert,
    login,
    logout,
    setUser,
    setAdmin,
    setExpert
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};
