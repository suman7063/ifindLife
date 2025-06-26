
import React, { createContext, useContext, ReactNode } from 'react';
import { useSimpleAuth, UserType } from '@/hooks/useSimpleAuth';
import { User, Session } from '@supabase/supabase-js';

// Export UserType so it can be used by other components
export type { UserType };

interface SimpleAuthContextType {
  user: User | null;
  session: Session | null;
  userType: UserType;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, type?: UserType) => Promise<{ success: boolean; data?: any; error?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

export const SimpleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSimpleAuth();

  return (
    <SimpleAuthContext.Provider value={auth}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within SimpleAuthProvider');
  }
  return context;
};
