
import { SimpleAuthContextType } from '@/contexts/SimpleAuthContext';

export const isUserAuthenticated = (authState: SimpleAuthContextType): boolean => {
  console.log('AuthHelper: Checking auth state:', {
    hasUser: !!authState?.user,
    hasEmail: !!authState?.user?.email,
    isAuthenticated: authState?.isAuthenticated,
    userType: authState?.userType,
    isLoading: authState?.isLoading,
    hasUserProfile: !!authState?.userProfile
  });
  
  // Use the SAME logic that LoginDropdown uses (since it works)
  // LoginDropdown checks: Boolean(isAuthenticated) || Boolean(hasExpertProfile)
  // But for user login, we specifically want user authentication
  const hasUser = Boolean(authState?.user);
  const hasEmail = Boolean(authState?.user?.email);
  const notLoading = !authState?.isLoading;
  const isAuthenticatedFlag = Boolean(authState?.isAuthenticated);
  
  // The key insight: LoginDropdown works because it checks for ANY authentication
  // But for user-specific auth, we need user + email + not loading
  const userAuthenticated = hasUser && hasEmail && notLoading && isAuthenticatedFlag;
  
  console.log('AuthHelper: Auth checks:', {
    hasUser,
    hasEmail,
    notLoading,
    isAuthenticatedFlag,
    userAuthenticated,
    finalResult: userAuthenticated
  });
  
  return userAuthenticated;
};

export const isUserAuthenticatedForDashboard = (authState: SimpleAuthContextType): boolean => {
  console.log('AuthHelper: Dashboard auth check:', {
    user: !!authState?.user,
    userType: authState?.userType,
    isAuthenticated: authState?.isAuthenticated,
    isLoading: authState?.isLoading
  });
  
  // For dashboard access, we need user type to be 'user' and authenticated
  const hasValidUserSession = Boolean(
    authState?.isAuthenticated && 
    authState?.userType === 'user' && 
    authState?.user &&
    !authState?.isLoading
  );
  
  return hasValidUserSession;
};
