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
      try {
        // Check if we need to convert the profile
        if (targetType === 'A' && 'profilePicture' in user) {
          // Already Type A format, no conversion needed
          adaptedUser = user;
        } else if (targetType === 'A' && 'profile_picture' in user) {
          // Convert from database format to Type A
          adaptedUser = toTypeA(user as UserProfile);
        } else if (targetType === 'B' && 'favorite_experts' in user) {
          // Convert from Type A to Type B
          adaptedUser = toTypeB(user as UserProfileA);
        } else if ('favorite_programs' in user) {
          // Check if favorite_programs exists and determine type
          if (targetType === 'A' && Array.isArray(user.favorite_programs)) {
            adaptedUser = toTypeA(user as UserProfile);
          } else if (targetType === 'B') {
            adaptedUser = toTypeB(user as UserProfileA);
          }
        }
      } catch (error) {
        console.error("Error adapting user profile:", error);
        // Keep original user as fallback
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
