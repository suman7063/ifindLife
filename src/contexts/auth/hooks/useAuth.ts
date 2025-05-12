
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { AuthContextType } from '../types';

// Export the hook for easy use
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
