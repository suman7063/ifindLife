
import { UserAuthContext } from './UserAuthContext';
import { UserAuthProvider } from './UserAuthProvider';
import { useContext } from 'react';
import { UserAuthContextType } from './UserAuthContext';

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
