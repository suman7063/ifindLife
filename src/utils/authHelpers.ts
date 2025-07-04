
import { SimpleAuthContextType } from '@/contexts/SimpleAuthContext';

export const isUserAuthenticated = (auth: SimpleAuthContextType): boolean => {
  return Boolean(
    auth.isAuthenticated && 
    auth.userType === 'user' && 
    auth.userProfile
  );
};

export const isExpertAuthenticated = (auth: SimpleAuthContextType): boolean => {
  console.log('🔍 isExpertAuthenticated check:', {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    hasExpert: !!auth.expert,
    expertStatus: auth.expert?.status
  });
  
  return Boolean(
    auth.isAuthenticated && 
    auth.userType === 'expert' && 
    auth.expert && 
    auth.expert.status === 'approved'
  );
};

export const isDualAuthenticated = (auth: SimpleAuthContextType): boolean => {
  return Boolean(
    auth.isAuthenticated && 
    auth.userType === 'dual' && 
    auth.userProfile && 
    auth.expert
  );
};
