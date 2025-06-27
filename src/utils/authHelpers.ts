
export const isUserAuthenticated = (authState: any): boolean => {
  console.log('AuthHelper: UNIFIED CHECK - Input:', authState);
  
  // Use the EXACT same logic everywhere
  const hasUser = !!authState?.user;
  const hasEmail = !!authState?.user?.email;
  const notLoading = !authState?.isLoading;
  
  const result = hasUser && hasEmail && notLoading;
  
  console.log('AuthHelper: UNIFIED CHECK - Results:', {
    hasUser,
    hasEmail,
    notLoading,
    finalResult: result,
    userObject: authState?.user
  });
  
  return result;
};

export const isUserAuthenticatedForDashboard = (authState: any): boolean => {
  // Use the same unified logic for consistency
  return isUserAuthenticated(authState);
};
