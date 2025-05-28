
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

interface ComponentWithUserProfile {
  userProfile?: UserProfile | null;
  [key: string]: any;
}

export function withProfileTypeAdapter<T extends ComponentWithUserProfile>(
  WrappedComponent: React.ComponentType<T>
) {
  const WithProfileTypeAdapter = (props: T) => {
    const { userProfile, ...otherProps } = props;
    
    // Adapt the user profile to ensure type consistency
    const adaptedProfile = userProfile ? adaptUserProfile(userProfile) : null;
    
    return (
      <WrappedComponent 
        {...otherProps as T} 
        userProfile={adaptedProfile}
      />
    );
  };
  
  WithProfileTypeAdapter.displayName = `withProfileTypeAdapter(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithProfileTypeAdapter;
}
