
import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * Higher Order Component to adapt profile types for components that have incompatible type expectations
 */
export const withProfileTypeAdapter = <P extends { currentUser?: UserProfileA | UserProfileB | null }>(
  Component: React.ComponentType<P>
) => {
  const WithProfileTypeAdapter: React.FC<P> = (props) => {
    const { toTypeA, toTypeB } = useProfileTypeAdapter();
    
    // Detect which type of profile is expected by examining component props
    const isTypeAExpected = (props as any).expectProfileTypeA;
    
    // If no user profile, just pass through
    if (!props.currentUser) {
      return <Component {...props} />;
    }
    
    // Adapt the profile type based on component needs
    const adaptedProps = {...props};
    if (isTypeAExpected && 'favoriteExperts' in props.currentUser) {
      // Component expects type A but we have type B
      adaptedProps.currentUser = toTypeA(props.currentUser as UserProfileB);
    } else if (!isTypeAExpected && 'favorite_experts' in props.currentUser) {
      // Component expects type B but we have type A
      adaptedProps.currentUser = toTypeB(props.currentUser as UserProfileA);
    }
    
    return <Component {...adaptedProps as P} />;
  };
  
  const displayName = Component.displayName || Component.name || 'Component';
  WithProfileTypeAdapter.displayName = `withProfileTypeAdapter(${displayName})`;
  
  return WithProfileTypeAdapter;
};

/**
 * Helper function to wrap function parameters that require specific profile types
 */
export const adaptFunctionParams = <T extends unknown[], R>(
  fn: (...args: T) => R,
  profileParamIndex = 0,
  targetType: 'A' | 'B' = 'A'
) => {
  return (...args: T): R => {
    const { toTypeA, toTypeB } = useProfileTypeAdapter();
    
    if (!args[profileParamIndex]) {
      return fn(...args);
    }
    
    const profile = args[profileParamIndex] as UserProfileA | UserProfileB;
    const newArgs = [...args];
    
    if (targetType === 'A' && 'favoriteExperts' in profile) {
      // Function expects type A but we have type B
      newArgs[profileParamIndex] = toTypeA(profile as UserProfileB) as any;
    } else if (targetType === 'B' && 'favorite_experts' in profile) {
      // Function expects type B but we have type A
      newArgs[profileParamIndex] = toTypeB(profile as UserProfileA) as any;
    }
    
    return fn(...newArgs as T);
  };
};

export default withProfileTypeAdapter;
