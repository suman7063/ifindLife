
import { useAuthBackCompat } from '@/hooks/auth/useAuthBackCompat';

/**
 * Hook for backward compatibility with components expecting the older UserAuthContextType structure
 */
export const useUserAuth = () => {
  const { userAuth } = useAuthBackCompat();
  return userAuth;
};
