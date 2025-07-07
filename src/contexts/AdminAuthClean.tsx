
// ✅ CLEAN ADMIN AUTH - COMPLETELY ISOLATED
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email?: string;
  name?: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SAFETY: Only initialize on admin routes
  const isAdminRoute = window.location.pathname.startsWith('/admin-login') || 
                      window.location.pathname.startsWith('/admin');

  console.log('🔒 AdminAuthClean: Provider initialized', {
    isAdminRoute,
    currentPath: window.location.pathname
  });

  useEffect(() => {
    if (!isAdminRoute) {
      console.log('🔒 AdminAuthClean: Not on admin route, skipping initialization');
      setIsLoading(false);
      return;
    }

    console.log('🔒 AdminAuthClean: Initializing for iFindLife admin (completely isolated)');

    const checkSession = async () => {
      try {
        // Check localStorage for existing admin session
        const sessionData = localStorage.getItem('clean_admin_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          const now = new Date().getTime();
          const sessionTime = new Date(session.timestamp).getTime();
          const maxAge = 8 * 60 * 60 * 1000; // 8 hours
          
          if (now - sessionTime < maxAge) {
            console.log('✅ AdminAuthClean: Valid session found (isolated system):', session.id);
            setAdmin({
              id: session.id,
              name: session.id,
              role: session.role
            });
            setIsAuthenticated(true);
            setError(null);
          } else {
            console.log('⏰ AdminAuthClean: Session expired, clearing');
            localStorage.removeItem('clean_admin_session');
          }
        } else {
          console.log('ℹ️ AdminAuthClean: No existing session found');
        }
      } catch (err) {
        console.error('❌ AdminAuthClean: Session check error:', err);
        localStorage.removeItem('clean_admin_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [isAdminRoute]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔒 AdminAuthClean: iFindLife admin login attempt (isolated):', email);
      setError(null);
      setIsLoading(true);
      
      // Simple credential validation (isolated from database)
      const validCredentials = [
        { id: 'iflsuperadmin', password: 'IFLadmin2024', role: 'superadmin' },
        { id: 'admin', password: 'Admin@123', role: 'admin' }
      ];
      
      const foundUser = validCredentials.find(
        cred => cred.id.toLowerCase() === email.toLowerCase().trim() && cred.password === password
      );
      
      if (!foundUser) {
        console.log('❌ AdminAuthClean: Invalid credentials for:', email);
        setError('Invalid admin credentials');
        return false;
      }

      // Create clean admin session
      const adminSession = {
        id: foundUser.id,
        role: foundUser.role,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('clean_admin_session', JSON.stringify(adminSession));
      
      setAdmin({
        id: foundUser.id,
        name: foundUser.id,
        role: foundUser.role
      });
      setIsAuthenticated(true);
      setError(null);

      console.log('✅ AdminAuthClean: Login successful (completely isolated system)');
      return true;
    } catch (err) {
      console.error('❌ AdminAuthClean: Login failed:', err);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🔒 AdminAuthClean: iFindLife admin logout (isolated)');
      localStorage.removeItem('clean_admin_session');
      setAdmin(null);
      setIsAuthenticated(false);
      setError(null);
      window.location.href = '/admin-login';
    } catch (err) {
      console.error('❌ AdminAuthClean: Logout error:', err);
    }
  };

  // SAFETY: Don't provide context on non-admin routes
  if (!isAdminRoute) {
    console.log('🔒 AdminAuthClean: Not on admin route, rendering children without context');
    return <>{children}</>;
  }

  const contextValue = {
    admin,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  };

  console.log('🔒 AdminAuthClean: Providing context:', {
    hasAdmin: !!admin,
    isAuthenticated,
    isLoading,
    hasError: !!error
  });

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthClean = () => {
  const context = useContext(AdminAuthContext);
  const isOnAdminRoute = window.location.pathname.startsWith('/admin-login') || 
                        window.location.pathname.startsWith('/admin');
  
  if (!context && isOnAdminRoute) {
    console.error('❌ useAdminAuthClean: Must be used within AdminAuthProvider on admin routes');
    throw new Error('useAdminAuthClean must be used within AdminAuthProvider');
  }
  
  return context;
};
