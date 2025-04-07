
// This file is maintained for backward compatibility
// New components should use the unified AuthProvider directly

import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuthBackCompat } from '@/hooks/auth/useAuthBackCompat';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userAuth } = useAuthBackCompat();
  
  return (
    <UserAuthContext.Provider value={userAuth}>
      {children}
    </UserAuthContext.Provider>
  );
};
