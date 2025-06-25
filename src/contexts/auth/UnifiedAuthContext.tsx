
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
  const [hasInitialized, setHasInitialized] = useState(false);
  
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
            setHasInitialized(true);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('UnifiedAuth: Session found, loading profiles...');
          await loadUserProfiles(session.user);
        } else {
          console.log('UnifiedAuth: No session found, setting not authenticated state');
          if (mounted) {
            setUser(null);
            setAdmin(null);
            setExpert(null);
            setSessionType(null);
            setIsLoading(false);
            setHasInitialized(true);
          }
        }
      } catch (error) {
        console.error('UnifiedAuth: Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
          setHasInitialized(true);
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
          // Clear all profile states
          console.log('UnifiedAuth: Clearing auth state (no session)');
          setUser(null);
          setAdmin(null);
          setExpert(null);
          setSessionType(null);
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfiles = async (authUser: User) => {
    try {
      console.log('UnifiedAuth: Loading user profiles for:', authUser.id);
      
      // Check stored session type preference
      const storedSessionType = localStorage.getItem('sessionType') as 'user' | 'admin' | 'expert' | null;
      console.log('UnifiedAuth: Stored session type:', storedSessionType);
      
      // Try to load expert profile first if stored type is expert
      if (storedSessionType === 'expert') {
        const expertProfile = await expertRepository.getExpertByAuthId(authUser.id);
        if (expertProfile) {
          console.log('UnifiedAuth: Expert profile loaded:', expertProfile);
          setExpert(expertProfile);
          setSessionType('expert');
          setUser(null);
          setAdmin(null);
          setIsLoading(false);
          setHasInitialized(true);
          return;
        }
      }
      
      // Try to load admin profile
      if (storedSessionType === 'admin') {
        const adminProfile = await adminRepository.getAdminByAuthId(authUser.id);
        if (adminProfile) {
          console.log('UnifiedAuth: Admin profile loaded:', adminProfile);
          setAdmin(adminProfile);
          setSessionType('admin');
          setUser(null);
          setExpert(null);
          setIsLoading(false);
          setHasInitialized(true);
          return;
        }
      }
      
      // Try to load user profile
      const userProfile = await userRepository.getUserByAuthId(authUser.id);
      if (userProfile) {
        console.log('UnifiedAuth: User profile loaded:', userProfile);
        setUser(userProfile);
        setSessionType('user');
        setAdmin(null);
        setExpert(null);
        setIsLoading(false);
        setHasInitialized(true);
        return;
      }
      
      // If no stored preference, try expert first, then admin, then user
      if (!storedSessionType) {
        const expertProfile = await expertRepository.getExpertByAuthId(authUser.id);
        if (expertProfile) {
          console.log('UnifiedAuth: Expert profile loaded (no preference):', expertProfile);
          setExpert(expertProfile);
          setSessionType('expert');
          localStorage.setItem('sessionType', 'expert');
          setIsLoading(false);
          setHasInitialized(true);
          return;
        }
        
        const adminProfile = await adminRepository.getAdminByAuthId(authUser.id);
        if (adminProfile) {
          console.log('UnifiedAuth: Admin profile loaded (no preference):', adminProfile);
          setAdmin(adminProfile);
          setSessionType('admin');
          localStorage.setItem('sessionType', 'admin');
          setIsLoading(false);
          setHasInitialized(true);
          return;
        }
        
        const userProfile = await userRepository.getUserByAuthId(authUser.id);
        if (userProfile) {
          console.log('UnifiedAuth: User profile loaded (no preference):', userProfile);
          setUser(userProfile);
          setSessionType('user');
          localStorage.setItem('sessionType', 'user');
          setIsLoading(false);
          setHasInitialized(true);
          return;
        }
      }
      
      console.log('UnifiedAuth: No profiles found for user:', authUser.id);
      // Even if no profiles found, we should stop loading
      setIsLoading(false);
      setHasInitialized(true);
    } catch (error) {
      console.error('UnifiedAuth: Error loading user profiles:', error);
      setIsLoading(false);
      setHasInitialized(true);
    }
  };

  const login = async (type: 'user' | 'admin' | 'expert', credentials: any): Promise<boolean> => {
    try {
      console.log(`UnifiedAuth: Attempting ${type} login:`, credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('UnifiedAuth: Login error:', error);
        return false;
      }

      if (data.user) {
        // Store the login type preference
        localStorage.setItem('sessionType', type);
        
        // Load the specific profile type
        await loadUserProfiles(data.user);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('UnifiedAuth: Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear stored session type
      localStorage.removeItem('sessionType');
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear all states
      setUser(null);
      setAdmin(null);
      setExpert(null);
      setSessionType(null);
      setIsLoading(false);
      setHasInitialized(true);
      
      console.log('UnifiedAuth: Logout completed');
    } catch (error) {
      console.error('UnifiedAuth: Logout error:', error);
      throw error;
    }
  };

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !hasInitialized) {
        console.log('UnifiedAuth: Force completing loading after timeout');
        setIsLoading(false);
        setHasInitialized(true);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading, hasInitialized]);

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
