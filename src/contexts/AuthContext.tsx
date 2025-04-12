
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      setIsAuthenticated(true);
    }
  }, []);

  // Simple admin authentication
  const login = (username: string, password: string): boolean => {
    // For demo purposes, hardcoded credentials
    // In a real application, this would validate against a secure backend
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_username', username);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
