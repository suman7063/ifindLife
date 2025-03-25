
import { UserAuthContext } from './UserAuthContext';
import { UserAuthProvider } from './UserAuthProvider';
import { UserAuthContextType } from './types';
import { useContext } from 'react';

// Hook for using the auth context
export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export { UserAuthContext, UserAuthProvider };
export type { UserAuthContextType };
export * from './types';
