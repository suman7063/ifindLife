
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthActions } from '../hooks/useAuthActions';
import { useProfileFunctions } from '../hooks/useProfileFunctions';
import { useAuthMethods } from '../hooks/useAuthMethods';
import { AuthState, initialAuthState } from '../types';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

// Export both as named export AND as default export for backwards compatibility
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  // Use the various hooks to build up the auth context
  const authState = useAuthState();
  const authActions = useAuthActions(authState);
  const profileFunctions = useProfileFunctions(authState);
  const authMethods = useAuthMethods(authState);

  // Mark as initialized once all state is loaded
  useEffect(() => {
    if (!authState.isLoading && !initialized) {
      setInitialized(true);
    }
  }, [authState.isLoading, initialized]);

  // Combine all the pieces into a single context value
  const contextValue = {
    ...authState,
    ...authActions,
    ...profileFunctions,
    ...authMethods,
    updateProfilePicture: async (file: File) => {
      try {
        if (!authState.user || !authState.profile) return null;
        
        // This is a placeholder implementation
        // You would typically upload the file to storage and update the profile
        console.log('Uploading profile picture', file.name);
        
        // Return a fake URL for the profile picture
        return `https://example.com/profiles/${authState.user.id}/${file.name}`;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return null;
      }
    }
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Adding this export for backward compatibility
export const AuthProvider = AuthContextProvider;

// Also export as default for dynamic imports
export default AuthContextProvider;
