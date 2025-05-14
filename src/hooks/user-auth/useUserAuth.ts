
import { useAuthBackCompat } from '@/hooks/auth/useAuthBackCompat';

export const useUserAuth = () => {
  const { userAuth } = useAuthBackCompat();
  return userAuth;
};
