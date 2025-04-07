
import { useState } from 'react';
import { useExpertLogin } from './auth/useExpertLogin';
import { useExpertLogout } from './auth/useExpertLogout';
import { useExpertRegistration } from './auth/useExpertRegistration';
import { useUserAccountCheck } from './auth/useUserAccountCheck';
import { ExpertProfile, ExpertRegistrationData } from './types';

export const useExpertAuthentication = (
  setExpert: (expert: ExpertProfile | null) => void,
  setLoading: (loading: boolean) => void,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Compose the hooks
  const { login } = useExpertLogin(setExpert, setLoading, fetchExpertProfile);
  const { logout } = useExpertLogout(setExpert, setLoading, setIsUserLoggedIn);
  const { register } = useExpertRegistration(setLoading);
  const { hasUserAccount } = useUserAccountCheck();
  
  return {
    login,
    logout,
    register,
    isUserLoggedIn,
    hasUserAccount
  };
};
