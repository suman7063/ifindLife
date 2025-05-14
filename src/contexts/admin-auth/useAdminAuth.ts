
import { useContext } from 'react';
import { AdminAuthContext } from './AdminAuthContext';

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};
