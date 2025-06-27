
export const isUserAuthenticated = (authState: any): boolean => {
  console.log('AuthHelper: UNIFIED CHECK - Input:', authState);
  
  // Use the EXACT same logic everywhere
  const hasUser = !!authState?.user;
  const hasEmail = !!authState?.user?.email;
  const notLoading = !authState?.isLoading;
  const isAuthenticated = !!authState?.isAuthenticated;
  
  const result = hasUser && hasEmail && notLoading && isAuthenticated;
  
  console.log('AuthHelper: UNIFIED CHECK - Results:', {
    hasUser,
    hasEmail,
    notLoading,
    isAuthenticated,
    finalResult: result,
    userObject: authState?.user
  });
  
  return result;
};

export const isUserAuthenticatedForDashboard = (authState: any): boolean => {
  // Use the same unified logic for consistency
  return isUserAuthenticated(authState);
};

export const isExpertAuthenticated = (authState: any): boolean => {
  console.log('AuthHelper: EXPERT CHECK - Input:', authState);
  
  const baseAuth = isUserAuthenticated(authState);
  const isExpertType = authState?.userType === 'expert';
  const hasExpertProfile = !!authState?.expert;
  const isApproved = authState?.expert?.status === 'approved';
  
  const result = baseAuth && isExpertType && hasExpertProfile && isApproved;
  
  console.log('AuthHelper: EXPERT CHECK - Results:', {
    baseAuth,
    isExpertType,
    hasExpertProfile,
    isApproved,
    finalResult: result
  });
  
  return result;
};
