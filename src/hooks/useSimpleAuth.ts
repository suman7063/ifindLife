
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';

export const useSimpleAuth = () => {
  return useSimpleAuthContext();
};

export type { UserType, SimpleAuthState } from '@/contexts/SimpleAuthContext';
