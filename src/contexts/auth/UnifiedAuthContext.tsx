
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
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [expert, setExpert] = useState<ExpertProfile | null>(null);

  const isAuthenticated = Boolean(user || admin || expert);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          await loadUserProfiles(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', { event, hasSession: !!session, userId: session?.user?.id });
        
        if (session?.user) {
          await loadUserProfiles(session.user);
        } else {
          // Clear all profile states
          setUser(null);
          setAdmin(null);
          setExpert(null);
          setSessionType(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfiles = async (authUser: User) => {
    try {
      console.log('Loading user profiles for:', authUser.id);
      
      // Check stored session type preference
      const storedSessionType = localStorage.getItem('sessionType') as 'user' | 'admin' | 'expert' | null;
      console.log('Stored session type:', storedSessionType);
      
      // Try to load expert profile first if stored type is expert
      if (storedSessionType === 'expert') {
        const expertProfile = await expertRepository.getExpertByAuthId(authUser.id);
        if (expertProfile) {
          console.log('Expert profile loaded:', expertProfile);
          setExpert(expertProfile);
          setSessionType('expert');
          setUser(null);
          setAdmin(null);
          return;
        }
      }
      
      // Try to load admin profile
      if (storedSessionType === 'admin') {
        const adminProfile = await adminRepository.getAdminByAuthId(authUser.id);
        if (adminProfile) {
          console.log('Admin profile loaded:', adminProfile);
          setAdmin(adminProfile);
          setSessionType('admin');
          setUser(null);
          setExpert(null);
          return;
        }
      }
      
      // Try to load user profile
      const userProfile = await userRepository.getUserByAuthId(authUser.id);
      if (userProfile) {
        console.log('User profile loaded:', userProfile);
        setUser(userProfile);
        setSessionType('user');
        setAdmin(null);
        setExpert(null);
        return;
      }
      
      // If no stored preference, try expert first, then admin, then user
      if (!storedSessionType) {
        const expertProfile = await expertRepository.getExpertByAuthId(authUser.id);
        if (expertProfile) {
          console.log('Expert profile loaded (no preference):', expertProfile);
          setExpert(expertProfile);
          setSessionType('expert');
          localStorage.setItem('sessionType', 'expert');
          return;
        }
        
        const adminProfile = await adminRepository.getAdminByAuthId(authUser.id);
        if (adminProfile) {
          console.log('Admin profile loaded (no preference):', adminProfile);
          setAdmin(adminProfile);
          setSessionType('admin');
          localStorage.setItem('sessionType', 'admin');
          return;
        }
        
        const userProfile = await userRepository.getUserByAuthId(authUser.id);
        if (userProfile) {
          console.log('User profile loaded (no preference):', userProfile);
          setUser(userProfile);
          setSessionType('user');
          localStorage.setItem('sessionType', 'user');
          return;
        }
      }
      
      console.log('No profiles found for user:', authUser.id);
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  };

  const login = async (type: 'user' | 'admin' | 'expert', credentials: any): Promise<boolean> => {
    try {
      console.log(`Attempting ${type} login:`, credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('Login error:', error);
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
      console.error('Login error:', error);
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
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout error:', error);
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
