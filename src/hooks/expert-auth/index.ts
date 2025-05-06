
// Export all expert authentication related hooks and types
export { useExpertAuth } from './useExpertAuth';
export { useExpertLogin } from './auth/useExpertLogin';
export { useExpertLogout } from './auth/useExpertLogout'; 
export { useExpertRegistration } from './auth/useExpertRegistration';
export { useExpertProfile } from './useExpertProfile';
export { useExpertAuthentication } from './useExpertAuthentication';
export { useFetchExpertProfile } from './auth/useFetchExpertProfile';
export { useUserAccountCheck } from './auth/useUserAccountCheck';
export type { 
  ExpertProfile, 
  ExpertRegistrationData, 
  ExpertTimeSlot, 
  ProfileUpdateData,
  ExpertAuthState,  // Add the previously missing type
  UseExpertAuthReturn // Add the previously missing type
} from './types';
