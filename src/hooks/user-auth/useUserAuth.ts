
import { useAuthBackCompat } from '@/hooks/auth/useAuthBackCompat';

/**
 * This hook provides backward compatibility for the old useUserAuth hook
 */
export const useUserAuth = () => {
  const { userAuth } = useAuthBackCompat();
  return userAuth;
};
