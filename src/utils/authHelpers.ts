
export const isUserAuthenticated = (authState: any): boolean => {
  console.log('AuthHelper: UNIFIED CHECK - Input:', authState);
  
  // Use the EXACT same logic everywhere
  const hasUser = !!authState?.user;
  const hasEmail = !!authState?.user?.email;
  const notLoading = !authState?.isLoading;
  const isAuthenticated = !!authState?.isAuthenticated;
  const hasUserProfile = !!authState?.userProfile;
  
  const result = hasUser && hasEmail && notLoading && isAuthenticated && hasUserProfile;
  
  console.log('AuthHelper: UNIFIED CHECK - Results:', {
    hasUser,
    hasEmail,
    notLoading,
    isAuthenticated,
    hasUserProfile,
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
  
  const hasUser = !!authState?.user;
  const hasEmail = !!authState?.user?.email;
  const notLoading = !authState?.isLoading;
  const isAuthenticated = !!authState?.isAuthenticated;
  const isExpertType = authState?.userType === 'expert';
  const hasExpertProfile = !!authState?.expert;
  const isApproved = authState?.expert?.status === 'approved';
  
  const result = hasUser && hasEmail && notLoading && isAuthenticated && isExpertType && hasExpertProfile && isApproved;
  
  console.log('AuthHelper: EXPERT CHECK - Results:', {
    hasUser,
    hasEmail,
    notLoading,
    isAuthenticated,
    isExpertType,
    hasExpertProfile,
    isApproved,
    finalResult: result
  });
  
  return result;
};
