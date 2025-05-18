
import { useContext } from 'react';
import { AdminAuthContext } from '../AdminAuthContext';

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};

export const useAuth = useAdminAuth; // Add an alias for backward compatibility
