
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';
import { UserAuthContextType } from '@/contexts/auth/types';

// Export the hook with proper type definitions
export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  
  return context;
};
