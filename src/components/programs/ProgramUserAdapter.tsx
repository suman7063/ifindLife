
import React from 'react';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

export interface ProgramComponentProps {
  program: any;
  currentUser: UserProfileA | UserProfileB | UserProfile | null;
  isAuthenticated: boolean;
  [key: string]: any;
}

/**
 * Higher Order Component to adapt user profile types for program components
 * @param Component The component that takes a program and currentUser prop
 * @param targetType The type to convert to ('A' or 'B')
 */
export function withProgramUserAdapter<P extends ProgramComponentProps>(
  Component: React.ComponentType<P>,
  targetType: 'A' | 'B' = 'A'
) {
  const WithProgramUserAdapter = (props: P) => {
    const { toTypeA, toTypeB } = useProfileTypeAdapter();
    const { currentUser, ...rest } = props;
    
    // Adapt user profile
    let adaptedUser = currentUser;
    
    if (currentUser) {
      // Detect current type and convert if needed
      if (targetType === 'A' && 'profilePicture' in currentUser) {
        adaptedUser = toTypeA(currentUser as UserProfileB);
      } else if (targetType === 'B' && 'favorite_experts' in currentUser) {
        adaptedUser = toTypeB(currentUser as UserProfileA);
      }
    }
    
    return <Component {...rest as any} currentUser={adaptedUser} />;
  };
  
  WithProgramUserAdapter.displayName = `withProgramUserAdapter(${Component.displayName || Component.name || 'Component'})`;
  return WithProgramUserAdapter;
}

// Pre-configured adapter for components that expect Type A
export const withProgramUserTypeA = <P extends ProgramComponentProps>(Component: React.ComponentType<P>) => {
  return withProgramUserAdapter(Component, 'A');
};

// Pre-configured adapter for components that expect Type B
export const withProgramUserTypeB = <P extends ProgramComponentProps>(Component: React.ComponentType<P>) => {
  return withProgramUserAdapter(Component, 'B');
};
