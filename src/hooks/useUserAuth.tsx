
import { useContext } from 'react';
import { UserAuthContext, UserAuthContextType } from '@/contexts/UserAuthContext';

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  
  return context;
};
