
// Backward compatibility layer for existing components
import { useAuthBackCompat } from './auth/useAuthBackCompat';

export const useUserAuth = () => {
  const { userAuth } = useAuthBackCompat();
  return userAuth;
};

// Export the new hook directly as well
export { useAuth } from '@/contexts/auth/AuthContext';
