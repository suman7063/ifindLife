
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'superadmin';
}

interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('adminUser');
        const sessionExpiry = localStorage.getItem('adminSessionExpiry');
        
        if (storedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          if (now < expiry) {
            setCurrentUser(JSON.parse(storedUser));
          } else {
            // Session expired
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminSessionExpiry');
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionExpiry');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('AdminAuth: Attempting login for:', username);
      
      // Simple credential check - in production, this should be against your backend
      const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' as const },
        { username: 'superadmin', password: 'super123', role: 'superadmin' as const },
        { username: 'test', password: 'test', role: 'admin' as const }
      ];
      
      const user = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (user) {
        const adminUser: AdminUser = {
          id: `admin_${user.username}`,
          username: user.username,
          role: user.role
        };
        
        // Set session expiry (24 hours)
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminSessionExpiry', expiryTime.toString());
        
        setCurrentUser(adminUser);
        
        console.log('AdminAuth: Login successful for:', username);
        toast.success('Admin login successful');
        return true;
      } else {
        console.log('AdminAuth: Invalid credentials for:', username);
        toast.error('Invalid admin credentials');
        return false;
      }
    } catch (error) {
      console.error('AdminAuth: Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminSessionExpiry');
      setCurrentUser(null);
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('AdminAuth: Logout error:', error);
      toast.error('Logout failed');
      return false;
    }
  };

  const value: AdminAuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
