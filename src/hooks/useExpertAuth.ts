
// Backward compatibility layer for existing components
import { useAuthBackCompat } from './auth/useAuthBackCompat';

export const useExpertAuth = () => {
  const auth = useAuthBackCompat();
  return auth.expertAuth;
};

// Export the new hook directly as well
export { useAuth as useAuthUnified } from '@/contexts/auth/AuthContext';
