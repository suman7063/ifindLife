
import { SimpleAuthContextType } from '@/contexts/SimpleAuthContext';

export const isUserAuthenticated = (auth: SimpleAuthContextType): boolean => {
  console.log('🔍 isUserAuthenticated check:', {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    hasUser: !!auth.user,
    hasUserProfile: !!auth.userProfile
  });
  
  // User is authenticated if they have a session and user, regardless of profile loading status
  return Boolean(
    auth.isAuthenticated && 
    auth.user &&
    (auth.userType === 'user' || auth.userType === 'none') // Allow 'none' during profile loading
  );
};

export const isExpertAuthenticated = (auth: SimpleAuthContextType): boolean => {
  console.log('🔍 isExpertAuthenticated check:', {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    hasUser: !!auth.user,
    hasExpert: !!auth.expert,
    expertStatus: auth.expert?.status,
    authId: auth.expert?.auth_id
  });
  
  const result = Boolean(
    auth.isAuthenticated && 
    auth.user &&
    auth.userType === 'expert' && 
    auth.expert && 
    auth.expert.status === 'approved'
  );
  
  console.log('🔍 isExpertAuthenticated result:', result);
  
  return result;
};

export const isDualAuthenticated = (auth: SimpleAuthContextType): boolean => {
  return Boolean(
    auth.isAuthenticated && 
    auth.userType === 'dual' && 
    auth.userProfile && 
    auth.expert
  );
};
