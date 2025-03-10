
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  username: string;
  role: 'admin' | 'superadmin';
};

type AuthContextType = {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for stored authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('ifindlife-auth');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('ifindlife-auth');
      }
    }
  }, []);

  // Admin credentials (in a real app, these would be stored securely on the server)
  const adminUsers = [
    { username: 'Soultribe', password: 'Freesoul@99', role: 'superadmin' as const }
  ];

  const login = (username: string, password: string): boolean => {
    const user = adminUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      const userData = { username: user.username, role: user.role };
      setCurrentUser(userData);
      localStorage.setItem('ifindlife-auth', JSON.stringify(userData));
      toast.success(`Welcome back, ${user.username}!`);
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ifindlife-auth');
    navigate('/admin-login');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
