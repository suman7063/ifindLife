
import { useAuthLogin } from './auth/useAuthLogin';
import { useAuthSignup } from './auth/useAuthSignup';
import { useAuthLogout } from './auth/useAuthLogout';
import { useProfileOperations } from './auth/useProfileOperations';
import { usePasswordManagement } from './auth/usePasswordManagement';
import { useExpertRegistration } from './auth/useExpertRegistration';
import { useExpertServices } from './auth/useExpertServices';
import { AuthState } from '../types';

export const useAuthActions = (state: AuthState, onActionComplete: () => void) => {
  // Import all the modularized hooks
  const { login } = useAuthLogin(state, onActionComplete);
  const { signup } = useAuthSignup(onActionComplete);
  const { logout } = useAuthLogout(onActionComplete);
  const { 
    refreshUserProfile, 
    refreshExpertProfile, 
    refreshProfile,
    updateUserProfile,
    updateExpertProfile,
    updateProfile
  } = useProfileOperations(state);
  const { updatePassword } = usePasswordManagement();
  const { registerExpert } = useExpertRegistration(onActionComplete);
  const { addExpertService, removeExpertService } = useExpertServices(state);

  // Log the login function to verify it exists and is being properly returned
  console.log('useAuthActions: login function type:', typeof login);

  // Return all the functions from the modular hooks
  return {
    login,
    signup,
    registerExpert,
    logout,
    refreshUserProfile,
    refreshExpertProfile,
    refreshProfile,
    updateUserProfile,
    updateExpertProfile,
    updateProfile,
    updatePassword,
    addExpertService,
    removeExpertService
  };
};
