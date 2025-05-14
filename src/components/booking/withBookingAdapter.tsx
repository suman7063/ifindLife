
import React from 'react';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

// This HOC adapts components that expect UserProfileA to work with either type
export const withBookingAdapter = <P extends { user?: UserProfileA | UserProfileB | null }>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, 'user'> & { user?: UserProfileA | UserProfileB | null }> => {
  const WrappedComponent: React.FC<Omit<P, 'user'> & { user?: UserProfileA | UserProfileB | null }> = (props) => {
    const { toTypeA } = useProfileTypeAdapter();
    const adaptedUser = props.user ? toTypeA(props.user) : null;
    
    return <Component {...props as unknown as P} user={adaptedUser} />;
  };
  
  WrappedComponent.displayName = `withBookingAdapter(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

// This HOC adapts components that need expertId, expertName props instead of a user object
export const withExpertBookingAdapter = <P extends { expertId: string; expertName: string; onBookingComplete?: () => void }>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withExpertBookingAdapter(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};
