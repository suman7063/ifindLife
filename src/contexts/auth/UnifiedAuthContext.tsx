
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { useAuth as useMainAuth } from './AuthContext';
import { AuthContextType } from './types';

// Create a unified context that provides enhanced auth functionality
interface UnifiedAuthContextType extends AuthContextType {
  // Additional utility methods
  isExpert: boolean;
  isUser: boolean;
  isDualSession: boolean;
  switchToExpert: () => void;
  switchToUser: () => void;
  getUserDisplayName: () => string;
  getProfilePicture: () => string;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | null>(null);

export const useUnifiedAuth = (): UnifiedAuthContextType => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
};

interface UnifiedAuthProviderProps {
  children: ReactNode;
}

const UnifiedAuthWrapper: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  const auth = useMainAuth();
  
  // Enhanced auth methods
  const isExpert = auth.role === 'expert' || auth.sessionType === 'expert' || auth.sessionType === 'dual';
  const isUser = auth.role === 'user' || auth.sessionType === 'user' || auth.sessionType === 'dual';
  const isDualSession = auth.sessionType === 'dual';
  
  const switchToExpert = () => {
    if (auth.expertProfile) {
      localStorage.setItem('sessionType', 'expert');
      window.location.reload();
    }
  };
  
  const switchToUser = () => {
    if (auth.userProfile) {
      localStorage.setItem('sessionType', 'user');
      window.location.reload();
    }
  };
  
  const getUserDisplayName = () => {
    if (isExpert && auth.expertProfile) {
      return auth.expertProfile.name || 'Expert';
    }
    if (auth.userProfile) {
      return auth.userProfile.name || 'User';
    }
    return auth.user?.email || 'User';
  };
  
  const getProfilePicture = () => {
    if (isExpert && auth.expertProfile) {
      return auth.expertProfile.profile_picture || '';
    }
    if (auth.userProfile) {
      return auth.userProfile.profile_picture || '';
    }
    return '';
  };
  
  const enhancedAuth: UnifiedAuthContextType = {
    ...auth,
    isExpert,
    isUser,
    isDualSession,
    switchToExpert,
    switchToUser,
    getUserDisplayName,
    getProfilePicture
  };
  
  return (
    <UnifiedAuthContext.Provider value={enhancedAuth}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UnifiedAuthWrapper>
        {children}
      </UnifiedAuthWrapper>
    </AuthProvider>
  );
};
