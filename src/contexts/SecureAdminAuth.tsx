import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface SecureAdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifySession: () => Promise<boolean>;
}

const SecureAdminAuthContext = createContext<SecureAdminAuthContextType | undefined>(undefined);

interface SecureAdminAuthProviderProps {
  children: ReactNode;
}

const SESSION_TOKEN_KEY = 'secure_admin_session_token';
const SESSION_EXPIRY_KEY = 'secure_admin_session_expiry';

export const SecureAdminAuthProvider: React.FC<SecureAdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Input sanitization helper
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>\"'&]/g, '');
  };

  // Secure session management
  const getStoredSession = () => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      
      if (!token || !expiry) return null;
      
      const expiryDate = new Date(expiry);
      if (expiryDate <= new Date()) {
        clearStoredSession();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error reading session from storage:', error);
      return null;
    }
  };

  const setStoredSession = (token: string, expiry: string) => {
    try {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      localStorage.setItem(SESSION_EXPIRY_KEY, expiry);
    } catch (error) {
      console.error('Error storing session:', error);
    }
  };

  const clearStoredSession = () => {
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Input validation and sanitization
      if (!username || !password) {
        toast.error('Please enter both username and password');
        return false;
      }

      const sanitizedUsername = sanitizeInput(username);
      const sanitizedPassword = sanitizeInput(password);

      if (sanitizedUsername.length < 3 || sanitizedPassword.length < 8) {
        toast.error('Invalid credentials format');
        return false;
      }

      // Call secure authentication endpoint
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'login',
          username: sanitizedUsername,
          password: sanitizedPassword,
        },
      });

      if (error) {
        console.error('Admin login error:', error);
        toast.error('Authentication failed. Please try again.');
        return false;
      }

      if (!data?.success) {
        toast.error(data?.error || 'Invalid credentials');
        return false;
      }

      // Store session securely
      setStoredSession(data.sessionToken, data.expiresAt);
      setAdmin(data.admin);
      setIsAuthenticated(true);
      
      toast.success('Successfully logged in');
      return true;

    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifySession = async (): Promise<boolean> => {
    try {
      console.log('🔍 Verifying admin session...');
      const sessionToken = getStoredSession();
      
      if (!sessionToken) {
        console.log('❌ No session token found in localStorage');
        return false;
      }

      console.log('✅ Session token found, verifying with backend...');
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'verify',
          sessionToken,
        },
      });

      if (error || !data?.success) {
        console.log('❌ Session verification failed:', error || data?.error);
        clearStoredSession();
        setAdmin(null);
        setIsAuthenticated(false);
        return false;
      }

      console.log('✅ Session verified successfully, admin:', data.admin);
      setAdmin(data.admin);
      setIsAuthenticated(true);
      return true;

    } catch (error) {
      console.error('❌ Session verification error:', error);
      clearStoredSession();
      setAdmin(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const sessionToken = getStoredSession();
      
      if (sessionToken) {
        // Notify backend to invalidate session
        await supabase.functions.invoke('admin-auth', {
          body: {
            action: 'logout',
            sessionToken,
          },
        });
      }

      clearStoredSession();
      setAdmin(null);
      setIsAuthenticated(false);
      toast.success('Successfully logged out');

    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local session even if backend call fails
      clearStoredSession();
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  // Verify session on mount and set up periodic verification
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      await verifySession();
      setIsLoading(false);
    };

    initializeAuth();

    // Verify session every 5 minutes
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        verifySession();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Auto-logout on tab close/refresh (optional security measure)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Optional: clear session on tab close for extra security
      // Uncomment the line below for maximum security (user will need to login again)
      // clearStoredSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const contextValue: SecureAdminAuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    verifySession,
  };

  return (
    <SecureAdminAuthContext.Provider value={contextValue}>
      {children}
    </SecureAdminAuthContext.Provider>
  );
};

export const useSecureAdminAuth = (): SecureAdminAuthContextType => {
  const context = useContext(SecureAdminAuthContext);
  if (!context) {
    throw new Error('useSecureAdminAuth must be used within a SecureAdminAuthProvider');
  }
  return context;
};