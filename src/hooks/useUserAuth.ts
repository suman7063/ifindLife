
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  
  if (!context || Object.keys(context).length === 0) {
    console.error('useUserAuth must be used within a UserAuthProvider');
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  
  return context;
};

// For backward compatibility
export { useAuth } from '@/contexts/auth/AuthContext';
