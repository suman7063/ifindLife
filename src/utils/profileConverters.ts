
import { AuthContextType } from '@/contexts/auth/AuthContext';

// This adapter helps components that use the old userProfile property
export function getUserProfile(auth: AuthContextType) {
  return auth.profile;
}

// This adapter helps components that use the old updateUserProfile method
export function getUpdateUserProfile(auth: AuthContextType) {
  return auth.updateProfile;
}
