
import React from 'react';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

// This HOC adapts components that expect UserProfileA to work with either type
export const withBookingAdapter = <P extends { user?: UserProfileA | UserProfileB | null }>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, 'user'> & { user?: UserProfileA | UserProfileB | null }> => {
  const WrappedComponent = (props: Omit<P, 'user'> & { user?: UserProfileA | UserProfileB | null }) => {
    const { toTypeA } = useProfileTypeAdapter();
    const adaptedUser = props.user ? toTypeA(props.user) : null;
    
    return <Component {...props as unknown as P} user={adaptedUser} />;
  };
  
  WrappedComponent.displayName = `withBookingAdapter(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// This HOC adapts components that need expertId, expertName props instead of a user object
export const withExpertBookingAdapter = <P extends { expertId: string; expertName: string }>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return Component; // Pass through since we're not transforming anything
};
