
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile, UserRole, initialAuthState } from '@/contexts/auth/types';
import { useAuthState } from './hooks/useAuthState';

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile?: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword?: (password: string) => Promise<boolean>;
  signup?: (email: string, password: string, userData?: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: number | string) => Promise<boolean>;
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (reviewParams: any) => Promise<boolean>;
  reportExpert?: (reportParams: any) => Promise<boolean>;
  getExpertShareLink?: (expertId: number | string) => string;
  getReferralLink?: () => string | null;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState } = useAuthState();
  const [error, setError] = useState<string | null>(null);

  // Extract values from auth state for easier access
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    session, 
    userProfile, 
    expertProfile, 
    role, 
    sessionType 
  } = authState;

  // Login function with role override
  const login = async (email: string, password: string, roleOverride?: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      console.log(`AuthContext: Attempting login for ${email}${roleOverride ? ` as ${roleOverride}` : ''}`);
      
      // Store login origin to prioritize correct role on dual accounts
      if (roleOverride) {
        sessionStorage.setItem('loginOrigin', roleOverride);
        console.log(`Setting login origin: ${roleOverride}`);
      }
      
      // Clean up any existing sessions before login
      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession.session) {
        console.log("AuthContext: Found existing session, signing out first");
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      if (!data.session) {
        console.error("Login failed: No session created");
        setError("Login failed: No session was created");
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      console.log("AuthContext: Login successful, saving session");
      
      // Set temporary session data
      setAuthState(prev => ({
        ...prev, 
        session: data.session,
        user: data.user,
        isAuthenticated: true
      }));
      
      // Store role preference if provided
      if (roleOverride) {
        localStorage.setItem('preferredRole', roleOverride);
      }
      
      return true;
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      setError(error.message || "Unexpected login error");
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      console.log("AuthContext: Logging out user");
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error("Logout error:", error);
        setError(error.message);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Clear auth state
      setAuthState({
        ...initialAuthState,
        isLoading: false
      });
      
      // Clear stored preferences
      localStorage.removeItem('preferredRole');
      sessionStorage.removeItem('loginOrigin');
      
      console.log("AuthContext: Logout successful");
      return true;
    } catch (error: any) {
      console.error("Unexpected logout error:", error);
      setError(error.message || "Unexpected logout error");
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };
  
  // Export the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    session,
    userProfile,
    expertProfile,
    role,
    sessionType,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
