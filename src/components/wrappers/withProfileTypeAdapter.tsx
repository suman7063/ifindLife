
import React, { ComponentType } from 'react';
import { UserProfile as UnifiedUserProfile } from '@/types/database/unified';
import { UserProfile as SupabaseUserProfile } from '@/types/supabase/userProfile';

// This is an adapter function that makes sure all required fields are present
// when adapting from a Supabase API profile to our unified schema
const adaptUserProfile = (profile: SupabaseUserProfile | null): UnifiedUserProfile | null => {
  if (!profile) return null;
  
  // Create a default transactions array if it's missing
  const transactions = profile.transactions || [];
  
  return {
    ...profile,
    transactions, // Ensure transactions is always defined
    // Add any other required fields with default values if they're missing
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    favorite_experts: profile.favorite_experts || [],
    favorite_programs: profile.favorite_programs || [],
    enrolled_courses: profile.enrolled_courses || [],
    referrals: profile.referrals || []
  } as UnifiedUserProfile;
};

// HOC to adapt profiles from one format to another
export function withProfileTypeAdapter<P extends object>(
  WrappedComponent: ComponentType<P>,
  profileKey: keyof P = 'profile' as keyof P,
  profilesKey: keyof P = 'profiles' as keyof P,
  userProfileKey: keyof P = 'userProfile' as keyof P,
  currentUserKey: keyof P = 'currentUser' as keyof P,
  expertProfileKey: keyof P = 'expertProfile' as keyof P,
  currentExpertKey: keyof P = 'currentExpert' as keyof P
) {
  return (props: P) => {
    // Create adaptedProps as a copy of props
    const adaptedProps = { ...props } as any;
    
    // Adapt single profile if it exists under profileKey
    if (props[profileKey] && typeof props[profileKey] === 'object') {
      adaptedProps[profileKey] = adaptUserProfile(props[profileKey] as unknown as SupabaseUserProfile);
    }
    
    // Adapt user profile if it exists
    if (props[userProfileKey] && typeof props[userProfileKey] === 'object') {
      adaptedProps[userProfileKey] = adaptUserProfile(props[userProfileKey] as unknown as SupabaseUserProfile);
    }
    
    // Adapt current user if it exists
    if (props[currentUserKey] && typeof props[currentUserKey] === 'object') {
      adaptedProps[currentUserKey] = adaptUserProfile(props[currentUserKey] as unknown as SupabaseUserProfile);
    }
    
    // Adapt array of profiles if it exists
    if (Array.isArray(props[profilesKey])) {
      adaptedProps[profilesKey] = (props[profilesKey] as unknown as SupabaseUserProfile[]).map(
        profile => adaptUserProfile(profile)
      ).filter(Boolean);
    }
    
    return <WrappedComponent {...adaptedProps} />;
  };
}

export default withProfileTypeAdapter;
