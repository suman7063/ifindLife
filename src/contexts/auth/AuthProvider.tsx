
import React, { useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContext';
import { AuthState, initialAuthState } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);
  
  const { 
    login, 
    signup, 
    logout, 
    updateProfile, 
    updatePassword,
    refreshProfile
  } = useAuthActions(state, setState);

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
