
import { useContext } from 'react';
import { AdminAuthContext } from '../AdminAuthContext';
import { AdminAuthContextType } from '../types';

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};

// Backward compatibility hook with 'useAuth' name for existing components
export const useAuth = useAdminAuth;
