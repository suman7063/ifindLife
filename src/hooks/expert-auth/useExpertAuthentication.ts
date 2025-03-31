
import { useExpertLogin } from './auth/useExpertLogin';
import { useExpertLogout } from './auth/useExpertLogout';
import { useExpertRegistration } from './auth/useExpertRegistration';
import { ExpertProfile, ExpertRegistrationData } from './types';

/**
 * Main hook that combines all expert authentication operations
 */
export const useExpertAuthentication = (
  setExpert: React.Dispatch<React.SetStateAction<ExpertProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  // Login functionality
  const { login } = useExpertLogin(setExpert, setLoading, fetchExpertProfile);
  
  // Logout functionality
  const { logout } = useExpertLogout(setExpert, setLoading);
  
  // Registration functionality
  const { register } = useExpertRegistration(setExpert, setLoading);

  return { login, logout, register };
};
