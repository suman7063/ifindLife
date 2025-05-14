
import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';

// Type for components that accept any kind of user profile
type ComponentWithProfile<P = {}> = React.ComponentType<P & { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
  profile?: UserProfileA | UserProfileB | UserProfile | null;
}>;

/**
 * Higher Order Component to adapt profile types for components expecting specific types
 */
export const withProfileTypeAdapter = <P extends { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
  profile?: UserProfileA | UserProfileB | UserProfile | null;
}>(
  Component: ComponentWithProfile<P>,
  targetType: 'A' | 'B' = 'A'
) => {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WithProfileTypeAdapter: React.FC<P> = (props) => {
    const { toTypeA, toTypeB } = useProfileTypeAdapter();
    
    // Create new props with adapted user profile
    const newProps = { ...props };
    
    // Adapt user property if it exists
    if (props.user) {
      if (targetType === 'A' && ('profilePicture' in props.user || 'favorite_programs' in props.user && Array.isArray(props.user.favorite_programs) && props.user.favorite_programs.length > 0 && typeof props.user.favorite_programs[0] === 'number')) {
        // Convert from B to A
        newProps.user = toTypeA(props.user as UserProfileB) as any;
      } else if (targetType === 'B' && ('favorite_experts' in props.user || 'favorite_programs' in props.user && Array.isArray(props.user.favorite_programs) && props.user.favorite_programs.length > 0 && typeof props.user.favorite_programs[0] === 'string')) {
        // Convert from A to B
        newProps.user = toTypeB(props.user as UserProfileA) as any;
      }
    }
    
    // Adapt currentUser property if it exists
    if (props.currentUser) {
      if (targetType === 'A' && ('profilePicture' in props.currentUser || 'favorite_programs' in props.currentUser && Array.isArray(props.currentUser.favorite_programs) && props.currentUser.favorite_programs.length > 0 && typeof props.currentUser.favorite_programs[0] === 'number')) {
        // Convert from B to A
        newProps.currentUser = toTypeA(props.currentUser as UserProfileB) as any;
      } else if (targetType === 'B' && ('favorite_experts' in props.currentUser || 'favorite_programs' in props.currentUser && Array.isArray(props.currentUser.favorite_programs) && props.currentUser.favorite_programs.length > 0 && typeof props.currentUser.favorite_programs[0] === 'string')) {
        // Convert from A to B
        newProps.currentUser = toTypeB(props.currentUser as UserProfileA) as any;
      }
    }
    
    // Adapt profile property if it exists
    if (props.profile) {
      if (targetType === 'A' && ('profilePicture' in props.profile || 'favorite_programs' in props.profile && Array.isArray(props.profile.favorite_programs) && props.profile.favorite_programs.length > 0 && typeof props.profile.favorite_programs[0] === 'number')) {
        // Convert from B to A
        newProps.profile = toTypeA(props.profile as UserProfileB) as any;
      } else if (targetType === 'B' && ('favorite_experts' in props.profile || 'favorite_programs' in props.profile && Array.isArray(props.profile.favorite_programs) && props.profile.favorite_programs.length > 0 && typeof props.profile.favorite_programs[0] === 'string')) {
        // Convert from A to B
        newProps.profile = toTypeB(props.profile as UserProfileA) as any;
      }
    }
    
    return <Component {...newProps as P} />;
  };

  WithProfileTypeAdapter.displayName = `withProfileTypeAdapter(${displayName})`;
  
  return WithProfileTypeAdapter;
};

/**
 * Helper function for creating components that need type B UserProfile
 */
export const withTypeB = <P extends { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
  profile?: UserProfileA | UserProfileB | UserProfile | null;
}>(Component: ComponentWithProfile<P>) => {
  return withProfileTypeAdapter(Component, 'B');
};

/**
 * Helper function for creating components that need type A UserProfile
 */
export const withTypeA = <P extends { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
  profile?: UserProfileA | UserProfileB | UserProfile | null;
}>(Component: ComponentWithProfile<P>) => {
  return withProfileTypeAdapter(Component, 'A');
};

export default withProfileTypeAdapter;
