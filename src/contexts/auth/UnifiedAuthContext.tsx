import React, { createContext, useContext, ReactNode } from 'react';
import { ExpertProfile, UserProfile } from '@/types/database/unified';
import { Session } from '@supabase/supabase-js';

export interface UnifiedAuthContextType {
  expert: ExpertProfile | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  session: Session | null;
  logout: () => Promise<void>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType>({
  expert: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  sessionType: 'none',
  session: null,
  logout: async () => {},
  updateExpertProfile: async () => false
});

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
};

export const UnifiedAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // This is a placeholder - you'll need to implement the actual provider logic
  const contextValue: UnifiedAuthContextType = {
    expert: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    sessionType: 'none',
    session: null,
    logout: async () => {},
    updateExpertProfile: async () => false
  };

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
