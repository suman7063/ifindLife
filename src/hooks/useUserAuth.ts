
// Import from the compatibility layer
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  
  if (!context || Object.keys(context).length === 0) {
    console.error('useUserAuth must be used within a UserAuthProvider, current context:', context);
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  
  return context;
};

// Export the new hook directly as well
export { useAuth } from '@/contexts/auth/AuthContext';
