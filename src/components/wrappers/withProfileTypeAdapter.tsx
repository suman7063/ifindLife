
import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';

// Type for components that accept any kind of user profile
type ComponentWithProfile<P = {}> = React.ComponentType<P & { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
}>;

/**
 * Higher Order Component to adapt profile types for components expecting specific types
 */
export const withProfileTypeAdapter = <P extends { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
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
      if (targetType === 'A' && 'profilePicture' in props.user) {
        // Convert from B to A
        newProps.user = toTypeA(props.user as UserProfileB) as any;
      } else if (targetType === 'B' && 'favorite_experts' in props.user) {
        // Convert from A to B
        newProps.user = toTypeB(props.user as UserProfileA) as any;
      }
    }
    
    // Adapt currentUser property if it exists
    if (props.currentUser) {
      if (targetType === 'A' && 'profilePicture' in props.currentUser) {
        // Convert from B to A
        newProps.currentUser = toTypeA(props.currentUser as UserProfileB) as any;
      } else if (targetType === 'B' && 'favorite_experts' in props.currentUser) {
        // Convert from A to B
        newProps.currentUser = toTypeB(props.currentUser as UserProfileA) as any;
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
}>(Component: ComponentWithProfile<P>) => {
  return withProfileTypeAdapter(Component, 'B');
};

/**
 * Helper function for creating components that need type A UserProfile
 */
export const withTypeA = <P extends { 
  user?: UserProfileA | UserProfileB | UserProfile | null;
  currentUser?: UserProfileA | UserProfileB | UserProfile | null;
}>(Component: ComponentWithProfile<P>) => {
  return withProfileTypeAdapter(Component, 'A');
};

export default withProfileTypeAdapter;
