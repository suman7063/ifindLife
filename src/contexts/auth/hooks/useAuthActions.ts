
import { useAuthLogin } from './auth/useAuthLogin';
import { useAuthSignup } from './auth/useAuthSignup';
import { useAuthLogout } from './auth/useAuthLogout';
import { useProfileOperations } from './auth/useProfileOperations';
import { usePasswordManagement } from './auth/usePasswordManagement';
import { useExpertRegistration } from './auth/useExpertRegistration';
import { useExpertServices } from './auth/useExpertServices';
import { AuthState } from '../types';
import { warnIfUndefined, logFunctionCall } from '@/utils/errorLogger';

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
  
  if (!login || typeof login !== 'function') {
    console.error('useAuthActions: login function is missing or not a function!', {
      loginExists: !!login,
      loginType: typeof login
    });
  }

  // Return all the functions from the modular hooks with proper error logging
  const actions = {
    login: (...args: Parameters<typeof login>) => {
      logFunctionCall('login', args);
      return warnIfUndefined(login, 'login')(...args);
    },
    signup: (...args: Parameters<typeof signup>) => {
      logFunctionCall('signup', args);
      return warnIfUndefined(signup, 'signup')(...args);
    },
    registerExpert: registerExpert,
    logout: (...args: Parameters<typeof logout>) => {
      logFunctionCall('logout', args);
      return warnIfUndefined(logout, 'logout')(...args);
    },
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
  
  // Verify all required actions exist
  console.log('useAuthActions: returning actions with keys:', Object.keys(actions));

  return actions;
};
