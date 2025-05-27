
import { UserProfile as UnifiedUserProfile } from '@/types/database/unified';
import { UserProfile as SupabaseUserProfile } from '@/types/supabase/userProfile';

/**
 * Converts a unified UserProfile to a Supabase UserProfile format
 * This helps resolve type compatibility issues between different profile type definitions
 */
export function adaptToSupabaseUserProfile(profile: UnifiedUserProfile | null): SupabaseUserProfile | null {
  if (!profile) return null;
  
  return {
    ...profile,
    favorite_experts: Array.isArray(profile.favorite_experts) 
      ? profile.favorite_experts.map(expert => String(expert))
      : [],
    favorite_programs: Array.isArray(profile.favorite_programs)
      ? profile.favorite_programs.map(program => String(program))
      : [],
    // Ensure all required properties are present with proper types
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || [],
    enrolled_courses: profile.enrolled_courses || []
  };
}

/**
 * Ensures type compatibility for user profiles across different contexts
 */
export function ensureUserProfileCompatibility(profile: any): SupabaseUserProfile | null {
  if (!profile) return null;
  
  return adaptToSupabaseUserProfile(profile);
}
