
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
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdminRoute) {
      setIsLoading(false);
      return;
    }

    console.log('🔒 AdminAuthClean: Initializing for iFindLife admin (isolated)');

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
            localStorage.removeItem('clean_admin_session');
          }
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
      console.log('🔒 AdminAuthClean: iFindLife admin login (isolated):', email);
      setError(null);
      setIsLoading(true);
      
      // Check credentials against admin_users table
      const { data: adminUser, error: queryError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', email.toLowerCase().trim())
        .single();

      if (queryError || !adminUser) {
        setError('Invalid admin credentials');
        return false;
      }

      // Validate password (in production, this should be hashed)
      const validPassword = password === 'IFLadmin2024';
      
      if (!validPassword) {
        setError('Invalid admin credentials');
        return false;
      }

      // Create clean admin session
      const adminSession = {
        id: adminUser.id,
        role: adminUser.role,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('clean_admin_session', JSON.stringify(adminSession));
      
      setAdmin({
        id: adminUser.id,
        name: adminUser.id,
        role: adminUser.role
      });
      setIsAuthenticated(true);
      setError(null);

      console.log('✅ AdminAuthClean: Login successful (isolated system)');
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
      window.location.href = '/admin-login-clean';
    } catch (err) {
      console.error('❌ AdminAuthClean: Logout error:', err);
    }
  };

  // SAFETY: Don't provide context on non-admin routes
  if (!isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthClean = () => {
  const context = useContext(AdminAuthContext);
  if (!context && window.location.pathname.startsWith('/admin')) {
    throw new Error('useAdminAuthClean must be used within AdminAuthProvider');
  }
  return context;
};
