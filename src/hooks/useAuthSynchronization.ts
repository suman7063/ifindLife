
// Backward compatibility layer for existing components
import { useAuthBackCompat } from './auth/useAuthBackCompat';

export const useAuthSynchronization = () => {
  const { authSync } = useAuthBackCompat();
  return authSync;
};

// Export the new hook directly as well
export { useAuth as useAuthUnified } from '@/contexts/auth/AuthContext';
