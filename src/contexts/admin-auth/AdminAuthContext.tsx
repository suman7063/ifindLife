
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AdminUser {
  username: string;
  role: 'admin' | 'editor';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => false,
  logout: () => {},
});

// Admin credentials (in a real app, these would be stored securely in a database)
const adminUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' as const },
  { username: 'editor', password: 'editor123', role: 'editor' as const },
];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('admin-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('admin-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Find matching admin user
    const foundUser = adminUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userInfo = {
        username: foundUser.username,
        role: foundUser.role,
      };
      
      // Store user info in localStorage
      localStorage.setItem('admin-user', JSON.stringify(userInfo));
      setUser(userInfo);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin-user');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  return context;
};
