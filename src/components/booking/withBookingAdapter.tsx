
import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';

export interface BookingComponentProps {
  user?: UserProfileA | UserProfileB | UserProfile | null;
  expertId?: string | number;
  [key: string]: any;
}

export function withBookingAdapter<P extends BookingComponentProps>(
  Component: React.ComponentType<P>,
  targetType: 'A' | 'B' = 'A'
) {
  const WithBookingAdapter = (props: Omit<P, 'user'> & { user?: UserProfileA | UserProfileB | UserProfile | null }) => {
    const { toTypeA, toTypeB } = useProfileTypeAdapter();
    const { user, ...rest } = props;
    
    // Adapt user profile
    let adaptedUser = user;
    
    if (user) {
      // Check if we need to convert the profile
      if (targetType === 'A' && 'profilePicture' in user) {
        // Convert from B to A
        adaptedUser = toTypeA(user as UserProfileB);
      } else if (targetType === 'B' && 'favorite_experts' in user) {
        // Convert from A to B 
        adaptedUser = toTypeB(user as UserProfileA);
      } else if ('favorite_programs' in user) {
        // Check if favorite_programs is number[] (Type B) but targetType is 'A'
        const firstItem = (user.favorite_programs || [])[0];
        if (targetType === 'A' && typeof firstItem === 'number') {
          adaptedUser = toTypeA(user as UserProfileB);
        } else if (targetType === 'B' && typeof firstItem === 'string') {
          adaptedUser = toTypeB(user as UserProfileA);
        }
      }
    }
    
    return <Component {...rest as any} user={adaptedUser} />;
  };
  
  WithBookingAdapter.displayName = `withBookingAdapter(${Component.displayName || Component.name || 'Component'})`;
  
  return WithBookingAdapter;
}

// Pre-configured adapter for components that expect Type A
export const withBookingTypeA = <P extends BookingComponentProps>(Component: React.ComponentType<P>) => {
  return withBookingAdapter(Component, 'A');
};

// Pre-configured adapter for components that expect Type B
export const withBookingTypeB = <P extends BookingComponentProps>(Component: React.ComponentType<P>) => {
  return withBookingAdapter(Component, 'B');
};

export default withBookingAdapter;
