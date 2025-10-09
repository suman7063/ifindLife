import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SouliAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const SouliAuthContext = createContext<SouliAuthContextType | undefined>(undefined);

const SOULI_SESSION_KEY = 'souli_admin_session';
const VALID_CREDENTIALS = {
  username: 'dk@ifindlife.com',
  password: 'Souli@1978'
};

interface SouliAuthProviderProps {
  children: ReactNode;
}

export const SouliAuthProvider: React.FC<SouliAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem(SOULI_SESSION_KEY);
    setIsAuthenticated(session === 'authenticated');
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      sessionStorage.setItem(SOULI_SESSION_KEY, 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SOULI_SESSION_KEY);
    setIsAuthenticated(false);
  };

  return (
    <SouliAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </SouliAuthContext.Provider>
  );
};

export const useSouliAuth = (): SouliAuthContextType => {
  const context = useContext(SouliAuthContext);
  if (!context) {
    throw new Error('useSouliAuth must be used within a SouliAuthProvider');
  }
  return context;
};
